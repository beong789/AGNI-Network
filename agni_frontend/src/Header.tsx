// Header Component
import { Flame } from 'lucide-react';


const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">AGNI Fire Detection Network</h1>
              <p className="text-orange-100 text-sm">Real-time wildfire risk assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition cursor-pointer">
              About
            </button>
            <button className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition cursor-pointer">
              Retrieve New Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header