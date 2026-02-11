import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PreventivePage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Preventive Compliance Tracking</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contractor / User
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                License Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Waste Usage (kg)
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status / Tags
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="font-bold text-gray-900">{user.name}</div>
                  <div className="text-gray-500">ID: {user.id}</div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
                    <span aria-hidden="true" className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
                    <span className="relative">{user.license_type}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${user.current_waste > user.waste_limit * 0.8 ? 'bg-red-600' : 'bg-green-600'}`} 
                      style={{ width: `${(user.current_waste / user.waste_limit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">{user.current_waste} / {user.waste_limit} kg</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="flex flex-wrap gap-1">
                    {user.tags.map(tag => (
                      <span key={tag} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tag.includes('Risk') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}