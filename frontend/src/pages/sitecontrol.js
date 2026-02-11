import { useState } from 'react';
import axios from 'axios';

export default function SiteControl() {
  const [selectedTruck, setSelectedTruck] = useState(null); 
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const truckImages = [
    { id: 'cw1', src: '/images/cw1.png', label: 'Truck 1 (Heavy Load)', contractor: 'Al-Futtaim Construction' },
    { id: 'cw2', src: '/images/cw2.png', label: 'Truck 2 (Medium Load)', contractor: 'Green Home Renovations' },
    { id: 'cw3', src: '/images/cw3.png', label: 'Truck 3 (Heavy Load)', contractor: 'Arabtec Construction' },
    { id: 'cw4', src: '/images/cw4.png', label: 'Truck 4 (Medium Load)', contractor: 'Emirates Contracting LLC' },
  ];

  const handleAnalyze = async (truckObj) => {
    setAnalyzing(true);
    setResult(null);
    setSelectedTruck(truckObj); 

    try {

      const response = await fetch(truckObj.src);
      const blob = await response.blob();
      const file = new File([blob], "truck.jpg", { type: "image/jpeg" });


      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/analyze-truck', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(res.data);
    } catch (err) {
      console.error("Analysis failed", err);
      alert("Error analyzing image. Make sure the Python backend is running!");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800"> Site Control: AI Volume Estimation</h1>
        <p className="text-gray-500">Select a camera feed to analyze incoming truck loads and verify contractor compliance.</p>
      </div>

      <div className="flex gap-8 flex-1 overflow-hidden">
        
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md overflow-y-auto border border-gray-200">
          <h2 className="font-bold text-lg mb-4 text-gray-700">Live Checkpoint Feeds</h2>
          <div className="space-y-4">
            {truckImages.map((truck) => (
              <div 
                key={truck.id} 
                className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${selectedTruck?.id === truck.id ? 'border-green-500 bg-green-50' : 'border-transparent hover:border-gray-300 bg-gray-50'}`}
                onClick={() => handleAnalyze(truck)}
              >
                <img src={truck.src} alt={truck.label} className="w-full h-40 object-cover rounded shadow-sm" />
                <div className="mt-2 text-center">
                  <p className="font-semibold text-gray-800">{truck.label}</p>
                  <p className="text-xs text-gray-500">{truck.contractor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3 bg-gray-900 rounded-lg shadow-2xl p-6 flex flex-col relative text-white">
          <h2 className="font-bold text-xl mb-4 text-green-400">Terminal Output</h2>
          
          {analyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-green-500 font-mono animate-pulse">Running YOLOv8 & Area Estimation Algorithms...</p>
            </div>
          ) : result && selectedTruck ? (
            <div className="flex gap-6 h-full">
              <div className="flex-1 bg-black rounded border border-gray-700 overflow-hidden relative">
                <img 
                  src={result.processed_image_base64} 
                  alt="AI Processed" 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="w-1/3 flex flex-col gap-4">
                
                <div className="bg-gray-800 p-4 rounded border border-gray-700 border-l-4 border-l-blue-500">
                  <p className="text-gray-400 text-xs font-mono mb-1">ASSOCIATED CONTRACTOR</p>
                  <p className="text-lg font-bold text-blue-400 leading-tight">
                    {selectedTruck.contractor}
                  </p>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <p className="text-gray-400 text-xs font-mono mb-1">FILL LEVEL</p>
                  <p className={`text-4xl font-black ${result.stats.fill_percentage > 80 ? 'text-red-500' : 'text-green-500'}`}>
                    {result.stats.fill_percentage}%
                  </p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <p className="text-gray-400 text-xs font-mono mb-1">ESTIMATED VOLUME</p>
                  <p className="text-2xl font-bold">{result.stats.estimated_volume_m3} <span className="text-sm">m³</span></p>
                </div>

                <div className="bg-gray-800 p-4 rounded border border-gray-700">
                  <p className="text-gray-400 text-xs font-mono mb-1">ESTIMATED WEIGHT</p>
                  <p className="text-2xl font-bold">{result.stats.estimated_weight_tons} <span className="text-sm">Tons</span></p>
                </div>
                

              </div>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center opacity-50">
                <span className="text-6xl mb-4">🖥️</span>
                <p className="font-mono text-center max-w-md">SYSTEM IDLE.<br/>Select a camera feed from the left panel to initialize Site Control analysis.</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}