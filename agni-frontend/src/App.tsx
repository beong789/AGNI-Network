import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import FirstResponders from './FirstResponders';  // Add this import

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/first-responders" element={<FirstResponders />} />  {/* Add this route */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;