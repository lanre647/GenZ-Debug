import * as vscode from 'vscode';
import { DiagnosticInterceptor } from './diagnosticInterceptor';
import { GenZHoverProvider } from './hoverProvider';

let diagnosticInterceptor: DiagnosticInterceptor;

export function activate(context: vscode.ExtensionContext) {
    console.log('GenZ Debug is now active! 💀');

    // Initialize diagnostic interceptor
    diagnosticInterceptor = new DiagnosticInterceptor(context);

    // Register hover provider for JS/TS/Python
    const hoverProvider = new GenZHoverProvider();
    
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            ['javascript', 'typescript', 'python', 'javascriptreact', 'typescriptreact'],
            hoverProvider
        )
    );

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

    // Add command to change savage level
    const changeLevelCommand = vscode.commands.registerCommand('genzDebug.changeSavageLevel', async () => {
        const level = await vscode.window.showQuickPick(
            ['mild', 'savage', 'nuclear'],
            {
                placeHolder: 'Choose your roast intensity',
                title: 'GenZ Debug Savage Mode'
            }
        );
        
        if (level) {
            const config = vscode.workspace.getConfiguration('genzDebug');
            await config.update('savageMode', level, vscode.ConfigurationTarget.Global);
            
            const emojis = { mild: '😊', savage: '🔥', nuclear: '💀💀💀' };
            vscode.window.showInformationMessage(
                `Savage mode set to: ${level} ${emojis[level as keyof typeof emojis]}`
            );
        }
    });

    context.subscriptions.push(toggleCommand, changeLevelCommand);
}

export function deactivate() {
    if (diagnosticInterceptor) {
        diagnosticInterceptor.dispose();
    }
    console.log('GenZ Debug deactivated. Sad times 😢');
}