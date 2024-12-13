const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Включено для более простого взаимодействия
            devTools: true, // Включено для отладки
        },
    });

    // Загрузить приложение React (URL или локальный файл index.html)
    mainWindow.loadURL('http://localhost:3000'); // Заменить на путь к статическим файлам после сборки
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
