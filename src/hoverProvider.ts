import * as vscode from 'vscode';
import { RoastEngine } from './roastTemplates';
import { SavageLevel } from './types';

export class GenZHoverProvider implements vscode.HoverProvider {
    private roastEngine: RoastEngine;

    constructor() {
        this.roastEngine = new RoastEngine();
    }

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const config = vscode.workspace.getConfiguration('genzDebug');
        const enabled = config.get<boolean>('enabled', true);
        
        if (!enabled) {
            return null;
        }

        const savageMode = config.get<SavageLevel>('savageMode', 'savage');
        const enableEmojis = config.get<boolean>('enableEmojis', true);

        // Get diagnostics at current position
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const relevantDiagnostics = diagnostics.filter(diag => 
            diag.range.contains(position) &&
            (diag.severity === vscode.DiagnosticSeverity.Error || 
             diag.severity === vscode.DiagnosticSeverity.Warning)
        );

        if (relevantDiagnostics.length === 0) {
            return null;
        }

        // Build hover content
        const hoverContents: vscode.MarkdownString[] = [];

        relevantDiagnostics.forEach(diag => {
            const errorMatch = this.roastEngine.translateError(diag.message, savageMode);
            
            const markdown = new vscode.MarkdownString();
            markdown.isTrusted = true;
            markdown.supportHtml = true;

            if (errorMatch) {
                const emoji = enableEmojis ? errorMatch.emoji : '';
                
                markdown.appendMarkdown(`### ${errorMatch.roast} ${emoji}\n\n`);
                
                if (errorMatch.fixSuggestion) {
                    markdown.appendMarkdown(`**💡 Quick Fix:**\n\n`);
                    markdown.appendCodeblock(errorMatch.fixSuggestion, 'javascript');
                    markdown.appendMarkdown('\n');
                }
                
                markdown.appendMarkdown(`---\n\n`);
                markdown.appendMarkdown(`*Original error: ${diag.message}*\n\n`);
                
                // Add severity indicator
                const severityEmoji = diag.severity === vscode.DiagnosticSeverity.Error ? '❌' : '⚠️';
                markdown.appendMarkdown(`${severityEmoji} Severity: ${this.getSeverityText(diag.severity)}`);
            } else {
                const genericRoast = this.roastEngine.getRandomRoastForUnknown(savageMode);
                const emoji = enableEmojis ? this.getRandomEmoji(savageMode) : '';
                
                markdown.appendMarkdown(`### ${genericRoast} ${emoji}\n\n`);
                markdown.appendMarkdown(`---\n\n`);
                markdown.appendMarkdown(`*Original: ${diag.message}*`);
            }

            hoverContents.push(markdown);
        });

        return new vscode.Hover(hoverContents);
    }

    private getSeverityText(severity: vscode.DiagnosticSeverity): string {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'Error (broken fr)';
            case vscode.DiagnosticSeverity.Warning:
                return 'Warning (sus code detected)';
            case vscode.DiagnosticSeverity.Information:
                return 'Info (just saying...)';
            case vscode.DiagnosticSeverity.Hint:
                return 'Hint (pro tip)';
            default:
                return 'Unknown';
        }
    }

    private getRandomEmoji(level: SavageLevel): string {
        const emojis = {
            mild: ['😅', '😊', '🤔'],
            savage: ['💀', '😂', '🔥'],
            nuclear: ['💀💀💀', '😭', '🚨']
        };
        const emojiArray = emojis[level];
        return emojiArray[Math.floor(Math.random() * emojiArray.length)];
    }
}