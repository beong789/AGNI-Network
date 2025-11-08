import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import FirstResponders from './FirstResponders';
import Login from './Login';  // Add this import

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />  
        <Route path="/first-responders" element={<FirstResponders />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;