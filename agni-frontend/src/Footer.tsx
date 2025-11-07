// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-3">About</h4>
            <p className="text-sm">
              Real-time wildfire risk monitoring for California using advanced weather data and machine learning.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Fire Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition">Evacuation Plans</a></li>
              <li><a href="#" className="hover:text-white transition">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-sm">
              Questions or feedback?<br />
              <a href="mailto:info@fireriskmaps.com" className="text-orange-400 hover:text-orange-300 transition">
                info@fireriskmaps.com
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; 2024 California Fire Risk Monitor. Built for safety.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer