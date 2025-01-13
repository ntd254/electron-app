import { ApiRenderer } from './index'

declare global {
  interface Window {
    api: ApiRenderer
  }
}
