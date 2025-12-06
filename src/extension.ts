import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('GenZ Debug is now active! 💀');

    const toggleCommand = vscode.commands.registerCommand('genzDebug.toggleRoasts', () => {
        const config = vscode.workspace.getConfiguration('genzDebug');
        const currentState = config.get('enabled');
        config.update('enabled', !currentState, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(
            `GenZ Debug roasts ${!currentState ? 'enabled' : 'disabled'} 🔥`
        );
    });

    context.subscriptions.push(toggleCommand);
}

export function deactivate() {
    console.log('GenZ Debug deactivated. Sad times 😢');
}