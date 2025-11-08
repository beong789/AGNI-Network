import { Flame, Shield, Zap, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-12 h-12" />
            <h1 className="text-5xl font-bold">AGNI</h1>
          </div>
          <p className="text-center text-xl text-orange-100 max-w-2xl mx-auto">
            Advanced Geospatial Network Intelligence for Real-Time Wildfire Risk Assessment
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            AGNI leverages real-time weather data and advanced analytics to provide 
            California communities with accurate, up-to-date wildfire risk assessments. 
            Our goal is to empower residents, emergency responders, and policymakers 
            with the information they need to stay safe and make informed decisions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Real-Time Data</h3>
            <p className="text-gray-600 text-sm">
              Live weather updates from the National Weather Service API covering all 58 California counties.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Risk Analysis</h3>
            <p className="text-gray-600 text-sm">
              Intelligent algorithms analyze temperature, humidity, wind speed, and conditions to calculate fire danger.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Maps</h3>
            <p className="text-gray-600 text-sm">
              Visual county-by-county risk mapping with color-coded danger levels for easy understanding.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Assistant</h3>
            <p className="text-gray-600 text-sm">
              Chat with AGNI to get personalized fire safety information and county-specific insights.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Data Collection</h3>
                <p className="text-gray-600">
                  We continuously fetch weather data from the National Weather Service for all 58 California counties, 
                  including temperature, wind speed, humidity, and current conditions.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Risk Assessment</h3>
                <p className="text-gray-600">
                  Our algorithms evaluate multiple fire danger indicators: high temperatures (≥85°F), 
                  low humidity (≤30%), and high winds (≥25 mph) to calculate overall risk levels.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Visualization</h3>
                <p className="text-gray-600">
                  Risk levels are displayed on an interactive map with color coding: 
                  Green (Low), Orange (Moderate), and Red (High) for quick visual assessment.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">AI Assistance</h3>
                <p className="text-gray-600">
                  Our AI chatbot powered by Google Gemini provides personalized answers about fire risks, 
                  safety tips, and county-specific information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Technology</h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Frontend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• React + TypeScript</li>
                  <li>• Vite for fast development</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Plotly.js for interactive maps</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Backend</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• FastAPI (Python)</li>
                  <li>• National Weather Service API + NASA FIRMS</li>
                  <li>• LangGraph + Google Gemini AI</li>
                  <li>• Real-time data processing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Team/Contact */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Built for Reboot the Earth 2025</h2>
          <p className="text-lg text-gray-600 mb-8">
            AGNI was created to address the growing wildfire threat in California by providing 
            accessible, real-time risk information to communities across the state.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/" 
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              View Live Map
            </a>
            <a 
              href="mailto:info@agnifire.com" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;