import { BrowserRouter, Routes, Route } from 'react-router';
import ResponsiveAppBar from './components/ResponsiveAppBar.jsx';
import Landing from './components/Landing.jsx'
import Films from './components/Films.jsx'
import Customers from './components/Customers.jsx'

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/Films" element={<Films />} />
        <Route path="/Customers" element={<Customers />} />
      </Routes>
    </div>
  )
}
export default App
