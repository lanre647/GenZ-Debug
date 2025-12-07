import * as vscode from 'vscode';
import { DiagnosticInterceptor } from './diagnosticInterceptor';

let diagnosticInterceptor: DiagnosticInterceptor;

export function activate(context: vscode.ExtensionContext) {
    console.log('GenZ Debug is now active! 💀');

    // Initialize diagnostic interceptor
    diagnosticInterceptor = new DiagnosticInterceptor(context);

    const toggleCommand = vscode.commands.registerCommand('genzDebug.toggleRoasts', () => {
        const config = vscode.workspace.getConfiguration('genzDebug');
        const currentState = config.get('enabled');
        config.update('enabled', !currentState, vscode.ConfigurationTarget.Global);
        
        const message = !currentState 
            ? 'GenZ Debug roasts enabled 🔥 Prepare for savagery!'
            : 'GenZ Debug roasts disabled 😢 Back to boring errors...';
        
        vscode.window.showInformationMessage(message);
        
        // Refresh diagnostics
        vscode.workspace.textDocuments.forEach(doc => {
            vscode.languages.getDiagnostics(doc.uri);
        });
    });

    context.subscriptions.push(toggleCommand);
}

export function deactivate() {
    if (diagnosticInterceptor) {
        diagnosticInterceptor.dispose();
    }
    console.log('GenZ Debug deactivated. Sad times 😢');
}