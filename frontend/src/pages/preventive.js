import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PreventivePage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Controls the Modal popup

  useEffect(() => {
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Mock function to handle fines
  const handleIssueFine = (userName) => {
    alert(`🚨 System Alert: 2000 AED Fine generated and sent to ${userName} for non-compliance.`);
  };

  // Helper function to render stars for credit score
  const renderStars = (score) => {
    return "⭐".repeat(score) + "☆".repeat(5 - score);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8 relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Preventive Compliance Tracking</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Contractor</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Credit Score</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Waste Usage</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">History</th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {/* 1. Name and Status */}
                <td className="px-5 py-5 border-b text-sm">
                  <div className="font-bold text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className={`px-2 py-1 rounded-full text-white ${user.status === 'Warning' ? 'bg-orange-500' : 'bg-green-500'}`}>
                      {user.status}
                    </span>
                  </div>
                </td>
                
                {/* 2. Credit Score */}
                <td className="px-5 py-5 border-b text-sm">
                  <div className="text-lg tracking-widest">{renderStars(user.credit_score)}</div>
                  <div className="text-xs text-gray-500 mt-1">{user.credit_score} / 5 Rating</div>
                </td>

                {/* 3. Waste Usage */}
                <td className="px-5 py-5 border-b text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${user.current_waste > user.waste_limit * 0.8 ? 'bg-red-600' : 'bg-green-600'}`} 
                      style={{ width: `${(user.current_waste / user.waste_limit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">{user.current_waste} / {user.waste_limit} kg</p>
                </td>

                {/* 4. History Hyperlink */}
                <td className="px-5 py-5 border-b text-sm">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-800 underline font-semibold transition"
                  >
                    View {user.name.split(' ')[0]}'s History
                  </button>
                </td>

                {/* 5. Fine Action */}
                <td className="px-5 py-5 border-b text-sm">
                  {user.status === 'Warning' || user.credit_score <= 2 ? (
                    <button 
                      onClick={() => handleIssueFine(user.name)}
                      className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-3 py-1 rounded border border-red-300 transition font-bold text-xs"
                    >
                      Issue Fine ⚠️
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Compliant</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl animate-fade-in relative">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedUser.name}</h2>
            <p className="text-sm text-gray-500 mb-6">License ID: {selectedUser.id} | Type: {selectedUser.license_type}</p>

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Prediction Score Card */}
              <div className="col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">AI Compliance Prediction</h3>
                <div className={`text-5xl font-black ${selectedUser.compliance_prediction > 80 ? 'text-green-500' : 'text-orange-500'}`}>
                  {selectedUser.compliance_prediction}<span className="text-2xl">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Likelihood of legal disposal</p>
              </div>

              {/* Action History List */}
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Recent Disposal Activity</h3>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {selectedUser.history.map((record, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded text-sm">
                      <div>
                        <p className="font-bold text-gray-700">{record.type} <span className="font-normal text-gray-500">({record.amount})</span></p>
                        <p className="text-xs text-gray-400">{record.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${record.status === 'Legal Dump' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}