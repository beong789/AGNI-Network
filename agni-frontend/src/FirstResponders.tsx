import { Shield, FileText, AlertTriangle, Upload, Users } from 'lucide-react';

const FirstResponders: React.FC = () => {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold">First Responders Portal</h1>
              <p className="text-blue-100 mt-2">
                Real-time incident reporting and resource management
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Submit Incident Report */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold">Submit Report</h2>
            </div>
            <p className="text-gray-600 mb-4">
              File an incident report or update on ongoing situations
            </p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              New Report
            </button>
          </div>

          {/* Active Incidents */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold">Active Incidents</h2>
            </div>
            <p className="text-gray-600 mb-4">
              View and manage currently active fire incidents
            </p>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              View Incidents
            </button>
          </div>

          {/* Upload Evidence */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Upload Media</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Upload photos, videos, or documentation from the field
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Upload Files
            </button>
          </div>

          {/* Resource Coordination */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Team Coordination</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Coordinate with other response teams and resources
            </p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              View Teams
            </button>
          </div>

          {/* Historical Reports */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold">Report History</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Access historical incident reports and analytics
            </p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              View History
            </button>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-xl font-semibold">Quick Access</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Emergency contacts and quick reference information
            </p>
            <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              View Contacts
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Notice:</strong> This portal is for authorized first responders only. 
            All activities are logged and monitored for security purposes.
          </p>
        </div>
      </div>
    </main>
  );
};

export default FirstResponders;