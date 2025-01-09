import { HashRouter, Route, Routes } from 'react-router-dom'
import Main from './window/Main'
import Tray from './window/Tray'

function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/tray" element={<Tray />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </HashRouter>
  )
}

export default App
