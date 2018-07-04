const electron = require('electron');
const nativeImage = electron.nativeImage;
const url = require('url');
const path = require('path');
const fs = require('fs');
const settings = require('./data/settings.json')
const translation = require(`./data/i18n/${settings.language}.json`)

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {

    // Create new windows
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720
    });

    // Load HTML into Window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Open dev tools
    // mainWindow.webContents.toggleDevTools();

    // Quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    })

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert the menu
    Menu.setApplicationMenu(mainMenu);
});

// Catch item:add
ipcMain.on('item:add', (e, item) => {
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
    {
        label: translation.file.file,
        submenu: [
            {
                label: translation.file.new,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-add-file-48.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
                click() {

                }
            },
            {
                label: translation.file.open,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-open-48.png').resize({
                    width: 20,
                    height: 20
                }), accelerator: process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
                click() {

                }
            },
            { type: 'separator' },
            {
                label: translation.file.save,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-save-as-48.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
                click() {

                }
            },
            {
                label: translation.file.quit,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-close-window-48.png').resize({
                    width: 20,
                    height: 20
                }), accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: translation.edit.edit,
        submenu: [
            {
                label: translation.edit.position.bank,
                icon: nativeImage.createFromPath('./data/assets/ui/bank.png').resize({
                    width: 20,
                    height: 20
                }),
                click() {

                }
            },
            {
                label: translation.edit.position.house,
                icon: nativeImage.createFromPath('./data/assets/ui/home.png').resize({
                    width: 20,
                    height: 20
                }),
                click() {

                }
            },
            {
                label: translation.edit.position.phoenix,
                icon: nativeImage.createFromPath('./data/assets/ui/fire.png').resize({
                    width: 20,
                    height: 20
                }),
                click() {

                }
            },
            { type: 'separator' },
            {
                label: translation.edit.linear,
                icon: nativeImage.createFromPath('./data/assets/ui/sort.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+L' : 'Ctrl+L',
                type: 'checkbox'
            },
            {
                label: translation.edit.delete,
                icon: nativeImage.createFromPath('./data/assets/ui/eraser.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'e' : 'e',
                type: 'checkbox'
            },
            { type: 'separator' },
            {
                label: translation.edit.movement,
                icon: nativeImage.createFromPath('./data/assets/ui/move.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+M' : 'Ctrl+M',
                type: 'radio'
            },
            {
                label: translation.edit.bank,
                icon: nativeImage.createFromPath('./data/assets/ui/bank.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+B' : 'Ctrl+B',
                type: 'radio'
            },
            {
                label: translation.edit.gather,
                icon: nativeImage.createFromPath('./data/assets/ui/wheat.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+G' : 'Ctrl+G',
                type: 'radio'
            },
            {
                label: translation.edit.fight,
                icon: nativeImage.createFromPath('./data/assets/ui/sword.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+F' : 'Ctrl+F',
                type: 'radio'
            },
            {
                label: translation.edit.phoenix,
                icon: nativeImage.createFromPath('./data/assets/ui/fire.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'Command+P' : 'Ctrl+P',
                type: 'radio'
            },
            { type: 'separator' },
            {
                label: translation.edit.top,
                icon: nativeImage.createFromPath('./data/assets/ui/up.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'z' : 'z',
                type: 'checkbox'
            },
            {
                label: translation.edit.left,
                icon: nativeImage.createFromPath('./data/assets/ui/left.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'q' : 'q',
                type: 'checkbox'
            },
            {
                label: translation.edit.right,
                icon: nativeImage.createFromPath('./data/assets/ui/right.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 'd' : 'd',
                type: 'checkbox'
            },
            {
                label: translation.edit.down,
                icon: nativeImage.createFromPath('./data/assets/ui/down.png').resize({
                    width: 20,
                    height: 20
                }),
                accelerator: process.platform == 'darwin' ? 's' : 's',
                type: 'checkbox'
            }
        ]
    },
    {
        label: translation.view.view,
        submenu: [
            {
                label: translation.view.toggle.marker.marker,
                submenu: [
                    {
                        label: translation.view.toggle.marker.class,
                        type: 'checkbox',
                        checked: settings.toggleClass,
                        icon: nativeImage.createFromPath('./data/assets/ui/misc/class.png').resize({
                            width: 20,
                            height: 20
                        }),
                        click(e) {
                            settings.toggleClass = e.checked
                            fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                            // NEED TO ADD MORE STUFF
                        }
                    },
                    {
                        label: translation.view.toggle.marker.workshop,
                        type: 'checkbox',
                        checked: settings.toggleWorkshop,
                        icon: nativeImage.createFromPath('./data/assets/ui/misc/workshops.png').resize({
                            width: 20,
                            height: 20
                        }),
                        click(e) {
                            settings.toggleWorkshop = e.checked
                            fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                            // NEED TO ADD MORE STUFF
                        }
                    },
                    {
                        label: translation.view.toggle.marker.misc,
                        type: 'checkbox',
                        checked: settings.toggleMisc,
                        icon: nativeImage.createFromPath('./data/assets/ui/misc/miscellaneaous.png').resize({
                            width: 20,
                            height: 20
                        }),
                        click(e) {
                            settings.toggleMisc = e.checked
                            fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                            // NEED TO ADD MORE STUFF
                        }
                    },
                    {
                        label: translation.view.toggle.marker.market,
                        type: 'checkbox',
                        checked: settings.toggleMarket,
                        icon: nativeImage.createFromPath('./data/assets/ui/misc/markets.png').resize({
                            width: 20,
                            height: 20
                        }),
                        click(e) {
                            settings.toggleMarket = e.checked
                            fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                            // NEED TO ADD MORE STUFF
                        }
                    },
                    {
                        label: translation.view.toggle.marker.lairs,
                        type: 'checkbox',
                        checked: settings.toggleLairs,
                        icon: nativeImage.createFromPath('./data/assets/ui/misc/lairs.png').resize({
                            width: 20,
                            height: 20
                        }),
                        click(e) {
                            settings.toggleLairs = e.checked
                            fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                            // NEED TO ADD MORE STUFF
                        }
                    },
                    {
                        label: translation.view.toggle.marker.dungeons,
                        type: 'checkbox',
                        checked: settings.toggleDungeons,
                        icon: nativeImage.createFromPath('./data/assets/ui/misc/dungeons.png').resize({
                            width: 20,
                            height: 20
                        }),
                        click(e) {
                            settings.toggleDungeons = e.checked
                            fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                            // NEED TO ADD MORE STUFF
                        }
                    },
                ],
                icon: nativeImage.createFromPath('./data/assets/ui/marker.png').resize({
                    width: 20,
                    height: 20
                }),
            },
            {
                label: translation.view.toggle.area,
                type: 'checkbox',
                checked: settings.toggleArea,
                click(e) {
                    settings.toggleArea = e.checked
                    fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                    // NEED TO ADD MORE STUFF
                }
            },
            {
                label: translation.view.toggle.ressources,
                type: 'checkbox',
                checked: settings.toggleRessources,
                click(e) {
                    settings.toggleRessources = e.checked
                    fs.writeFile('./data/settings.json', JSON.stringify(settings), (err) => { console.log(err) })
                    // NEED TO ADD MORE STUFF
                }
            }
        ]
    },
    {
        label: translation.option.option,
        submenu: [
            {
                label: translation.option.settings,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-services-48.png').resize({
                    width: 20,
                    height: 20
                }),
                click() {
                    // mainWindow.getElementById('exampleModalCenter').modal('toggle')
                }
            },
            { type: 'separator' },
            {
                label: translation.option.information,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-property-script-48.png').resize({
                    width: 20,
                    height: 20
                }),
            }
        ]
    },
    {
        label: translation.help.help,
        submenu: [
            {
                label: translation.help.updates,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-downloading-updates-48.png').resize({
                    width: 20,
                    height: 20
                }),
            },
            { type: 'separator' },
            {
                label: translation.help.about,
                icon: nativeImage.createFromPath('./data/assets/ui/icons8-info-48.png').resize({
                    width: 20,
                    height: 20
                }),
            },
        ]
    }
];

// If mac, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
};

// Add developer tools if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Devleloper tools',
        submenu: [
            {
                label: 'toggle dev tools',
                accelerator: process.platform == 'darwin' ? 'Command+i' : 'Ctrl+i',
                click(items, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
};