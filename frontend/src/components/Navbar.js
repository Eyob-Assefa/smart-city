import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path) => router.pathname === path ? "bg-green-800" : "";

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">♻️ Abu Dhabi Smart City</h1>
        
        <div className="space-x-4">
          <Link href="/preventive" className={`px-4 py-2 rounded hover:bg-green-600 transition ${isActive('/preventive')}`}>
            Preventive
          </Link>
          <Link href="/monitor" className={`px-4 py-2 rounded hover:bg-green-600 transition ${isActive('/monitor')}`}>
            Monitor (Heatmap)
          </Link>
          <Link href="/operations" className={`px-4 py-2 rounded hover:bg-green-600 transition ${isActive('/operations')}`}>
            Operations
          </Link>
        </div>
      </div>
    </nav>
  );
}