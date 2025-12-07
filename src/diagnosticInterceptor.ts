import * as vscode from 'vscode';
import { RoastEngine } from './roastTemplates';
import { SavageLevel } from './types';

export class DiagnosticInterceptor {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private roastEngine: RoastEngine;
    private originalDiagnostics: Map<string, vscode.Diagnostic[]>;

    constructor(context: vscode.ExtensionContext) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('genzDebug');
        this.roastEngine = new RoastEngine();
        this.originalDiagnostics = new Map();
        
        context.subscriptions.push(this.diagnosticCollection);
        this.startListening(context);
    }

    private startListening(context: vscode.ExtensionContext) {
        // Listen to diagnostic changes
        vscode.languages.onDidChangeDiagnostics((event) => {
            const config = vscode.workspace.getConfiguration('genzDebug');
            const enabled = config.get<boolean>('enabled', true);
            
            if (!enabled) {
                return;
            }

            event.uris.forEach(uri => {
                this.processDiagnostics(uri);
            });
        }, null, context.subscriptions);

        // Process existing diagnostics on activation
        vscode.workspace.textDocuments.forEach(doc => {
            this.processDiagnostics(doc.uri);
        });
    }

    private processDiagnostics(uri: vscode.Uri) {
        const config = vscode.workspace.getConfiguration('genzDebug');
        const savageMode = config.get<SavageLevel>('savageMode', 'savage');
        const enableEmojis = config.get<boolean>('enableEmojis', true);

        // Get all diagnostics for this file
        const allDiagnostics = vscode.languages.getDiagnostics(uri);
        
        // Filter for JavaScript/TypeScript/Python errors and warnings
        const targetDiagnostics = allDiagnostics.filter(diag => 
            diag.severity === vscode.DiagnosticSeverity.Error ||
            diag.severity === vscode.DiagnosticSeverity.Warning
        );

        if (targetDiagnostics.length === 0) {
            this.diagnosticCollection.delete(uri);
            return;
        }

        // Store original diagnostics
        const uriString = uri.toString();
        if (!this.originalDiagnostics.has(uriString)) {
            this.originalDiagnostics.set(uriString, targetDiagnostics);
        }

        // Transform diagnostics with Gen Z roasts
        const roastedDiagnostics = targetDiagnostics.map(diag => {
            const errorMatch = this.roastEngine.translateError(diag.message, savageMode);
            
            if (errorMatch) {
                const newMessage = enableEmojis 
                    ? `${errorMatch.roast} ${errorMatch.emoji}\n\n💡 Fix: ${errorMatch.fixSuggestion || 'Check the docs bestie'}\n\n🤓 Original: ${diag.message}`
                    : `${errorMatch.roast}\n\nFix: ${errorMatch.fixSuggestion || 'Check the docs'}\n\nOriginal: ${diag.message}`;

                return new vscode.Diagnostic(
                    diag.range,
                    newMessage,
                    diag.severity
                );
            } else {
                // Fallback for unmatched errors
                const genericRoast = this.roastEngine.getRandomRoastForUnknown(savageMode);
                const newMessage = enableEmojis
                    ? `${genericRoast}\n\n🤓 Original: ${diag.message}`
                    : `${genericRoast}\n\nOriginal: ${diag.message}`;

                return new vscode.Diagnostic(
                    diag.range,
                    newMessage,
                    diag.severity
                );
            }
        });

        // Apply roasted diagnostics
        this.diagnosticCollection.set(uri, roastedDiagnostics);
    }

    public dispose() {
        this.diagnosticCollection.dispose();
        this.originalDiagnostics.clear();
    }
}