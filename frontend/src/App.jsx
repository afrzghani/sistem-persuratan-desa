import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import UploadKTP from './pages/uploadKTP'
import Riwayat from './pages/riwayat'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadKTP />} />
        <Route path="/riwayat" element={<Riwayat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App