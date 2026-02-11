import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OperationsPage() {
  const [incidents, setIncidents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const incRes = await axios.get('http://127.0.0.1:8000/api/incidents');
        const teamRes = await axios.get('http://127.0.0.1:8000/api/teams');
        // Only show 'Open' or 'Pending' incidents
        setIncidents(incRes.data.filter(i => i.status !== 'Resolved'));
        setTeams(teamRes.data);
      } catch (err) {
        console.error("Failed to load operations data", err);
      }
    };
    loadData();
  }, []);

  const handleDispatch = async (incidentId) => {
    if (!selectedTeam) {
      alert("Please select a team first!");
      return;
    }
    
    try {
      await axios.post(`http://127.0.0.1:8000/api/assign?incident_id=${incidentId}&team_id=${selectedTeam}`);
      
      setIncidents(incidents.filter(i => i.id !== incidentId));
      alert(`Team ${selectedTeam} dispatched successfully!`);
      setSelectedTeam(''); 
    } catch (err) {
      alert("Dispatch failed. Check console.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">📋 Operations Command Center</h1>
      <p className="text-gray-500 mb-8">Assign cleaning crews to verified incidents.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="font-bold text-xl mb-4">Field Teams Status</h2>
          <div className="space-y-4">
            {teams.map(team => (
              <div key={team.id} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                <div>
                  <p className="font-bold">{team.name}</p>
                  <p className="text-xs text-gray-500">📍 {team.location}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  team.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {team.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-xl mb-4">Pending Work Orders ({incidents.length})</h2>
          
          {incidents.length === 0 ? (
            <p className="text-green-600 bg-green-50 p-4 rounded">🎉 No pending incidents! Good job.</p>
          ) : (
            incidents.map(incident => (
              <div key={incident.id} className="bg-white border-l-4 border-red-500 p-6 rounded shadow hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{incident.type}</h3>
                    <p className="text-sm text-gray-500">Detected: {incident.timestamp}</p>
                    <p className="mt-2 text-gray-700">{incident.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded uppercase font-bold">
                      {incident.severity} Priority
                    </span>
                  </div>
                </div>

                {/* ACTION AREA */}
                <div className="mt-6 flex items-center gap-4 bg-gray-50 p-3 rounded">
                  <label className="text-sm font-bold text-gray-700">Assign To:</label>
                  <select 
                    className="border-gray-300 border rounded p-2 text-sm flex-1"
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    value={selectedTeam}
                  >
                    <option value="">-- Select Available Team --</option>
                    {teams.filter(t => t.status === 'Available').map(t => (
                      <option key={t.id} value={t.id}>{t.name} (Available)</option>
                    ))}
                  </select>
                  
                  <button 
                    onClick={() => handleDispatch(incident.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-bold transition"
                  >
                    Dispatch Crew 🚀
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}