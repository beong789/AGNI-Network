import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <Flame className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">AGNI</h1>
              <p className="text-orange-100 text-sm">Real-time wildfire risk assessment</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/about"
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition cursor-pointer"
            >
              About
            </Link>
            <button className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition cursor-pointer">
              Retrieve New Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;