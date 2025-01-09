import { BrowserWindow, ipcMain, Tray } from 'electron'
import appIcon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'

const WINDOW_SIZE = {
  width: 200,
  height: 300,
  margin: {
    x: 10,
    y: 10
  }
} as const

let trayApp: Tray | null = null
let trayWindow: BrowserWindow | null = null

export function initTray(): void {
  trayApp = new Tray(appIcon)
  createTrayWindow()

  trayApp.on('click', () => {
    ipcMain.emit('tray-window-click', { window: trayWindow, tray: trayApp })
    toggleTrayWindow()
  })

  alignWindow()
  ipcMain.emit('tray-window-ready', { window: trayWindow, tray: trayApp })
}

function createTrayWindow(): void {
  trayWindow = new BrowserWindow({
    width: WINDOW_SIZE.width,
    height: WINDOW_SIZE.height,
    show: false,
    frame: false,
    resizable: false,
    fullscreenable: false,
    transparent: true,
    alwaysOnTop: true
  })

  trayWindow.setMenu(null)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    trayWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    trayWindow.loadURL(`file://${join(__dirname, '../renderer/index.html')}`)
  }

  trayWindow.on('blur', () => {
    if (!trayWindow) return
    if (!trayWindow.webContents.isDevToolsOpened()) {
      trayWindow.hide()
      ipcMain.emit('tray-window-hidden', { window: trayWindow, tray: trayApp })
    }
  })

  trayWindow.on('blur', () => {
    if (!trayWindow?.webContents.isDevToolsOpened()) {
      trayWindow?.hide()
    }
  })

  trayWindow.on('close', (event) => {
    if (!trayWindow) return
    event.preventDefault()
    trayWindow.hide()
  })
}

function toggleTrayWindow(): void {
  if (!trayWindow) return
  trayWindow.isVisible() ? trayWindow.hide() : trayWindow.show()
  ipcMain.emit('tray-window-hidden', { window: trayWindow, tray: trayApp })
}

function alignWindow(): void {
  if (!trayApp || !trayWindow) return

  const trayBounds = trayApp.getBounds()
  const windowBounds = trayWindow.getBounds()

  const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)
  const y = Math.round(trayBounds.y + trayBounds.height + WINDOW_SIZE.margin.y)

  trayWindow.setPosition(x, y)
  // const position = calculateWindowPosition()
  // if (!position) return

  // trayWindow.setPosition(position.x, position.y)
}
