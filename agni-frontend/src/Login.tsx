import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hard-coded password
    if (password === 'fire2025') {
      localStorage.setItem('responderAuth', 'true');
      navigate('/first-responders');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">First Responders</h1>
          <p className="text-gray-600 mt-2">Enter password to access portal</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Access Portal
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded text-center">
            <p className="text-xs text-gray-600">Demo password: <code className="bg-white px-2 py-1 rounded font-mono">fire2025</code></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;