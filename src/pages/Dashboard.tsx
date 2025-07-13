import { useState } from 'react';

const Dashboard = () => {
  const [stats] = useState({
    totalLeads: 1245,
    converted: 845,
    pending: 400,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Leads</h3>
          <p className="text-3xl font-bold">{stats.totalLeads.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-green-500 text-sm font-medium">Converted</h3>
          <p className="text-3xl font-bold">{stats.converted.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-yellow-500 text-sm font-medium">Pending</h3>
          <p className="text-3xl font-bold">{stats.pending.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">Your dashboard is ready! Start adding and managing your leads to see activity here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
