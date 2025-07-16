import { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface Enquiry {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  service_taken: boolean;
}

// Supabase client
const supabaseUrl = 'https://xhlwrsllakhhriukzzhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobHdyc2xsYWtoaHJpdWt6emh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0OTI5ODMsImV4cCI6MjA2ODA2ODk4M30.GP8t6biX-RytCKc4yw27B8EARR1338KM9_hfo_R1sY4';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const DashboardEnquiries = () => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('enquiries')
        .select('id, created_at, name, phone, email, service, message, service_taken')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error.message);
        setError('Failed to load enquiries');
      } else if (data) {
        setEnquiries(data as Enquiry[]);
      }
      setLoading(false);
    };

    fetchEnquiries();
  }, []);

  const handleToggle = async (id: string, current: boolean) => {
    const newValue: boolean = !current;
    // optimistic UI update
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, service_taken: newValue } : e)));
    setUpdatingId(id);

    // Use Supabase REST API PATCH
    const res = await fetch(`${supabaseUrl}/rest/v1/enquiries?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ service_taken: newValue })
    });
    if (!res.ok) {
      console.error('Failed to update service_taken');
      // revert on error
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, service_taken: current } : e)));
    }
    setUpdatingId(null);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Enquiries Dashboard</h1>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 font-medium mb-4">{error}</p>
        )}

        {!loading && enquiries.length === 0 && (
          <p className="text-center text-gray-600">No enquiries yet.</p>
        )}

        {!loading && enquiries.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Taken</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enquiry.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.phone}</td>
                      <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-500">{enquiry.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enquiry.service}</td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500 max-w-xs truncate">{enquiry.message}</td>
                      <td className="px-6 py-4 hidden sm:table-cell text-sm text-gray-500">{formatDate(enquiry.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={enquiry.service_taken}
                            onChange={() => handleToggle(enquiry.id, enquiry.service_taken)}
                            disabled={updatingId === enquiry.id}
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-green-500 transition-colors duration-300"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardEnquiries;
