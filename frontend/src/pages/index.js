import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Head from 'next/head';

const MapWithNoSSR = dynamic(() => import('../components/MapComponent'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-500">Loading Map...</div>
});

export default function LandingPage() {
    const [stats, setStats] = useState({
        sites_monitored: 0,
        accuracy: 94.2,
        pending_contractors: 0,
        active_alerts: 0
    });
    
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const incRes = await axios.get('http://127.0.0.1:8000/api/incidents');
                const userRes = await axios.get('http://127.0.0.1:8000/api/users');
                
                setIncidents(incRes.data);

                const active = incRes.data.filter(i => i.status !== 'Resolved').length;
                const pending = userRes.data.filter(u => u.status === 'Warning').length;

                setStats({
                    sites_monitored: 124, 
                    accuracy: 94.2,
                    pending_contractors: pending,
                    active_alerts: active
                });
            } catch (error) {
                console.error("Dashboard data fetch failed", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden flex">
            <Head>
                <title>EcoGuard AD | Command Center</title>
            </Head>

            {/* --- 1. LEFT PANEL: REPORTING (50% WIDTH) --- */}
            {/* - Added 'bg-cover bg-center' and the backgroundImage style directly here.
               - Removed 'backdrop-blur' and global dark bg to make image clear.
               - Added a subtle gradient overlay inside to ensure top text readability.
            */}
            <aside 
                className="relative w-1/2 h-full flex flex-col border-r border-white/20 shadow-2xl text-white p-10 bg-cover bg-center"
                style={{ 
                    backgroundImage: "url('/images/smart-city.jpg')",
                }}
            >
                {/* Subtle gradient overlay for better text contrast at the top */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40 z-0"></div>
                
                {/* Content Container (z-10 to sit on top of overlay) */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-5xl font-light tracking-wide mb-2 drop-shadow-lg">Command Center</h1>
                        <p className="text-sm text-green-300 font-mono tracking-widest uppercase drop-shadow-md">System Online • Live Metrics</p>
                    </div>

                    {/* 2x2 Grid */}
                    {/* Kept bg-black/40 on these specific boxes so they pop out from the clear background */}
                    <div className="grid grid-cols-2 gap-8 mb-auto">
                        
                        {/* Metric 1 */}
                        <div className="p-4 border-l-4 border-green-500 bg-black/40 rounded backdrop-blur-md shadow-lg">
                            <span className="text-xs text-gray-200 uppercase tracking-wider block mb-1">AI Accuracy</span>
                            <span className="text-5xl font-bold">{stats.accuracy}%</span>
                            <div className="text-green-400 text-xs font-mono mt-2">OPTIMAL</div>
                        </div>

                        {/* Metric 2 */}
                        <div className="p-4 border-l-4 border-blue-500 bg-black/40 rounded backdrop-blur-md shadow-lg">
                            <span className="text-xs text-gray-200 uppercase tracking-wider block mb-1">Active Sensors</span>
                            <span className="text-5xl font-bold">{stats.sites_monitored}</span>
                            <div className="text-blue-300 text-xs font-mono mt-2">COVERAGE</div>
                        </div>

                        {/* Metric 3 */}
                        <div className="p-4 border-l-4 border-yellow-500 bg-black/40 rounded backdrop-blur-md shadow-lg">
                            <span className="text-xs text-gray-200 uppercase tracking-wider block mb-1">Pending Review</span>
                            <span className="text-5xl font-bold text-yellow-400">{stats.pending_contractors}</span>
                            <div className="text-yellow-200 text-xs font-mono mt-2">ALERTS</div>
                        </div>

                        {/* Metric 4 */}
                        <div className="p-4 border-l-4 border-red-500 bg-black/40 rounded backdrop-blur-md shadow-lg">
                            <span className="text-xs text-gray-200 uppercase tracking-wider block mb-1">Active Incidents</span>
                            <span className="text-5xl font-bold text-red-400">{stats.active_alerts}</span>
                            <div className="text-red-300 text-xs font-mono mt-2">URGENT</div>
                        </div>

                    </div>

                    {/* Simple Footer */}
                    <div className="mt-8 border-t border-white/20 pt-4">
                         <p className="text-sm text-white drop-shadow-md italic">
                            "Real-time monitoring enabled. Data is refreshed every 30 seconds."
                        </p>
                    </div>
                </div>
            </aside>

            {/* --- 2. RIGHT PANEL: MAP (50% WIDTH) --- */}
            <main className="relative z-10 w-1/2 h-full shadow-2xl bg-gray-100">
                <MapWithNoSSR incidents={incidents} />
            </main>
        </div>
    );
}