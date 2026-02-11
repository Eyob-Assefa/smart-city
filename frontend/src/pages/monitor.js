import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const HeatmapLayer = dynamic(() => import('../components/HeatmapLayer'), { ssr: false });

export default function MonitorPage() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/incidents')
      .then(res => setIncidents(res.data))
      .catch(err => console.error(err));
  }, []);


  

  return (
    <div className="flex h-[calc(100vh-64px)]"> 
   
      <div className="w-1/2 h-full relative border-r-4 border-gray-300">
        <MapContainer center={[24.4539, 54.3773]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          
          <HeatmapLayer points={incidents} />

            {incidents.map((incident) => (
            <Marker 
              key={incident.id} 
              position={[incident.lat, incident.lng]}
              eventHandlers={{
                click: () => {
                  setSelectedIncident(incident);
                },
              }}
            />
          ))}
        </MapContainer>
        
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-lg z-[400] text-xs">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> High Severity</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Low Severity</div>
        </div>
      </div>

     
      <div className="w-1/2 h-full bg-[#FAF9F6] p-6 overflow-y-auto">
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          🔍 Incident Analysis
        </h2>

 
        

 
        {selectedIncident ? (
          
          <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedIncident.type}</h3>
                <p className="text-gray-500 text-sm">{selectedIncident.timestamp}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                selectedIncident.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedIncident.severity}
              </span>
            </div>
            
            <div className="mt-4 border-t pt-4">
              {selectedIncident.image ? (
                <div className="mb-4">
                  <img src={selectedIncident.image} alt={selectedIncident.type} className="w-full h-48 object-cover rounded" />
                </div>
              ) : null}
              <p className="text-gray-700">{selectedIncident.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-xs text-gray-500">Latitude</p>
                  <p className="font-mono">{selectedIncident.lat}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-xs text-gray-500">Longitude</p>
                  <p className="font-mono">{selectedIncident.lng}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-6xl mb-4">🗺️</p>
            <p>Select a point on the map or upload an image to analyze.</p>
          </div>
        )}
      </div>
    </div>
  );
}