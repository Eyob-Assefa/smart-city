import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Dynamically import the Map to avoid "window is not defined" error
const MapWithNoSSR = dynamic(() => import('../components/MapComponent'), {
    ssr: false,
    loading: () => <p>Loading Map...</p>
});

export default function Home() {
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState({ total_incidents: 0, pending_cases: 0 });

    // Fetch data from Python Backend on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get Incidents
                const incidentRes = await axios.get('http://127.0.0.1:8000/api/incidents');
                setIncidents(incidentRes.data);

                // 2. Get Stats
                const statsRes = await axios.get('http://127.0.0.1:8000/api/stats');
                setStats(statsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <header className="bg-green-700 text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">Abu Dhabi Smart Waste Monitor</h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Stats */}
                <aside className="w-1/4 bg-white p-6 shadow-xl z-10 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-700">Live Overview</h2>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="text-sm text-gray-500">Total Incidents</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.total_incidents}</p>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <h3 className="text-sm text-gray-500">Pending Action</h3>
                        <p className="text-3xl font-bold text-red-600">{stats.pending_cases}</p>
                    </div>

                    <button className="mt-auto bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                        Report New Incident
                    </button>
                </aside>

                {/* Main Map Area */}
                <main className="flex-1 relative">
                    <MapWithNoSSR incidents={incidents} />
                </main>
            </div>
        </div>
    );
}