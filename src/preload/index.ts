import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  get: (key: string): Promise<any> => {
    return ipcRenderer.invoke('get', key)
  },
  set: (key: string, value: any): void => {
    return ipcRenderer.send('set', key, value)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}

export type ApiRenderer = typeof api
