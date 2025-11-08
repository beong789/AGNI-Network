import { Link } from 'react-router-dom';
import { Flame, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { api } from './services/api';

const Header: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage('');
    
    try {
      const result = await api.refreshData();
      setMessage(`✅ Successfully updated ${result.counties} counties!`);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
      
      // Reload the page to show new data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      setMessage('❌ Failed to refresh data. Try again.');
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

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
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Retrieve New Data'}
            </button>
          </div>
        </div>
        {/* Success/Error message */}
        {message && (
          <div className="mt-3 text-center text-sm bg-white/20 rounded-lg px-4 py-2">
            {message}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;