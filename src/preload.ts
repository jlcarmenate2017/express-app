import { ipcRenderer, contextBridge } from 'electron';
(() => {
  console.log("Add listeners")
  addEventListener("message", ev => {
    if (ev && ev.data && !ev.data.backend) {
      ipcRenderer.send("EXPRESS", ev.data)
    }
  });
  ipcRenderer.on("EXPRESS_TO_CLIENT", (event, arg) => {
    arg.status.backend = true
    window.postMessage(arg.status, '*');
  });
  ipcRenderer.on("EXPRESS_TO_CLIENT_ARTICLE", (event, arg) => {
    arg.status.backend = true
    window.postMessage(arg.status, '*');
  });
  contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('close-app')
  });
})();
