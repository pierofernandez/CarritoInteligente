import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import SmartCart from './pages/SmartCart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/cart" element={<SmartCart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

export default App;
