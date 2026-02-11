import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  // Helper to highlight active page
  const isActive = (path) => router.pathname === path 
    ? "bg-black/40 font-bold shadow-md backdrop-blur-sm border border-white/20" 
    : "hover:bg-black/20 hover:backdrop-blur-sm transition";

  return (
    <nav className="relative text-white p-4 shadow-2xl sticky top-0 z-50">
      
      {/* --- 1. BACKGROUND IMAGE LAYER --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
         <div 
            className="absolute inset-0 w-full h-full"
            style={{ 
                backgroundImage: "url('/images/desert.jpg')", 
                backgroundSize: 'cover', 
                backgroundPosition: 'center 45%'
            }}
         ></div>
         <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-black/60"></div>
      </div>

      {/* --- 2. NAVIGATION CONTENT --- */}
      <div className="container mx-auto flex justify-between items-center relative z-10">
        
        {/* Clickable Logo -> Routes to Dashboard */}
        <Link href="/">
          <h1 className="text-xl font-bold tracking-wide border-l-4 border-green-400 pl-3 drop-shadow-lg cursor-pointer hover:opacity-90 transition">
            Abu Dhabi Smart City
          </h1>
        </Link>
        
        <div className="flex items-center space-x-6">

          <Link href="/" className={`px-4 py-2 rounded drop-shadow-md ${isActive('/')}`}>
            Dashboard
          </Link>
          
          <Link href="/preventive" className={`px-4 py-2 rounded drop-shadow-md ${isActive('/preventive')}`}>
            Preventive
          </Link>
          
          {/* --- MONITOR SECTION --- */}
          <div className="flex flex-col items-center justify-center drop-shadow-md">
            <span className="text-[10px] uppercase tracking-widest text-green-200 font-bold mb-1 opacity-90">
              Monitor
            </span>
            
            <div className="flex bg-black/30 rounded-md p-1 border border-white/20 backdrop-blur-md space-x-1">
              <Link href="/monitor" className={`px-3 py-1 text-sm rounded ${isActive('/monitor')}`}>
                Heatmap
              </Link>
              <Link href="/sitecontrol" className={`px-3 py-1 text-sm rounded ${isActive('/sitecontrol')}`}>
                Site Control
              </Link>
            </div>
          </div>

          <Link href="/operations" className={`px-4 py-2 rounded drop-shadow-md ${isActive('/operations')}`}>
            Operations
          </Link>
          
        </div>
      </div>
    </nav>
  );
}