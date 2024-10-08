import {app, ipcMain} from 'electron';
import {Config} from "./config/config";
import {UsbManager} from "./printer/usb-manager";
import {Log} from "./config/log";
import {PrinterManager} from "./printer/printer-manager";
import {Utils} from "./config/utils";
import Socket from "./socket/socket";
import WindowManager from "./windowManager";

import { updateElectronApp, UpdateSourceType } from 'update-electron-app'
updateElectronApp({
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: 'jlcarmenate2017/express-app'
  },
  logger: require('electron-log')
})
new Log();
const utils = new Utils();
const config = new Config(utils);
const windowManager = new WindowManager(config.config, utils);
async function main() {
  await config.getServerConfig();
  const printerManager = new PrinterManager(config.serverConfig, windowManager, config.config, utils);
  const usbManager = new UsbManager(printerManager);
  new Socket(config, printerManager);
  usbManager.startUsbListener();
  printerManager.startCheckPrinter();
  if (require('electron-squirrel-startup')) {
    app.quit();
  }

  ipcMain.on("EXPRESS", async (event, args) => {
    if (args === "socket_connected") {
      console.log("Event with name : " + args);
      setTimeout(() => {
        usbManager.checkPrinterStatus()
      }, 1000, this)
    }else if (args.event) {
      if (args.event === "print_ticket") {
        console.log("Event with name : " + args);
        await printerManager.printCommandsLines(args.data.deviceId, args.data.commands);
      }
      if (args.event === "close_app") {
        windowManager.closeWindow()
        app.quit();
      }
      if (args.event === "open_drawer") {
        await printerManager.openDrawer();
      }
      if (args.event === "ticket_changed") {
        windowManager.sendToMainClientWindows(args);
      }
    } else {
      console.log("Event: " + JSON.stringify(args));
    }
  });


  app.on('before-quit', () => {
    usbManager.stopUsbListener();
    windowManager.closeWindow()
  });
  /*

  const isSingleInstance = app.requestSingleInstanceLock();

  if (!isSingleInstance) {
    console.error('No single instance found');
    app.quit();
  }
  */

  process.on('SIGINT', () => {
    console.log('SIGINT received, closing app...');
    windowManager.closeWindow()
    app.quit();
  });

}
app.on('ready', () => {
  windowManager.openWindows();
});
ipcMain.on('close-app', () => {
  windowManager.closeWindow()
  app.quit();
});
app.on('window-all-closed', () => {
  app.quit();
});
main().catch((error) => {
  console.error("Error in initialization:", error);
});
