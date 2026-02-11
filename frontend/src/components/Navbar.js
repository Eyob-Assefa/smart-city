import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  // Helper to highlight active page
  const isActive = (path) => router.pathname === path ? "bg-green-600 font-bold shadow-sm" : "hover:bg-green-600";

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">♻️ Abu Dhabi Smart City</h1>
        
        {/* Changed to items-center so the taller Monitor section aligns nicely with standard buttons */}
        <div className="flex items-center space-x-6">
          
          <Link href="/preventive" className={`px-4 py-2 rounded transition ${isActive('/preventive')}`}>
            Preventive
          </Link>
          
          {/* --- FIXED MONITOR SECTION --- */}
          <div className="flex flex-col items-center justify-center">
            {/* The Parent Label */}
            <span className="text-xs uppercase tracking-widest text-green-300 font-bold mb-1">
              Monitor
            </span>
            
            {/* The two sub-links side-by-side in a grouped container */}
            <div className="flex bg-green-800 rounded-md p-1 shadow-inner space-x-1">
              <Link href="/monitor" className={`px-3 py-1 text-sm rounded transition ${isActive('/monitor')}`}>
                🗺️ Heatmap
              </Link>
              <Link href="/sitecontrol" className={`px-3 py-1 text-sm rounded transition ${isActive('/sitecontrol')}`}>
                📸 Site Control
              </Link>
            </div>
          </div>
          {/* --- END OF MONITOR SECTION --- */}

          <Link href="/operations" className={`px-4 py-2 rounded transition ${isActive('/operations')}`}>
            Operations
          </Link>
          
        </div>
      </div>
    </nav>
  );
}