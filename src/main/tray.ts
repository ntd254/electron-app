import { is } from '@electron-toolkit/utils'
import { menubar } from 'menubar'
import { join } from 'path'
import appIcon from '../../resources/icon.png?asset'

export function createTray(): void {
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  const index =
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? `${process.env['ELECTRON_RENDERER_URL']}#/tray`
      : `file://${join(__dirname, '../renderer/index.html')}#/tray`

  menubar({
    index,
    icon: appIcon,
    browserWindow: {
      frame: false,
      resizable: false,
      fullscreenable: false,
      transparent: true,
      alwaysOnTop: true,
      useContentSize: true
    }
  })
}
