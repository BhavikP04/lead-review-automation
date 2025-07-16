import { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Data model for enquiry records
interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  created_at: string;
  service_taken?: boolean;
}

// Initialize Supabase client (consider moving to a separate util in future)
const supabaseUrl = 'https://xhlwrsllakhhriukzzhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobHdyc2xsYWtoaHJpdWt6emh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0OTI5ODMsImV4cCI6MjA2ODA2ODk4M30.GP8t6biX-RytCKc4yw27B8EARR1338KM9_hfo_R1sY4';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Sample data (fallback in case API fails)
const sampleEnquiries: Enquiry[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john@example.com',
    message: 'Interested in website development services',
    service: 'Website Development',
    created_at: '2025-07-13T10:30:00',
    service_taken: false
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+1 (555) 987-6543',
    email: 'jane@example.com',
    message: 'Need help with social media strategy',
    service: 'Social Media Management',
    created_at: '2025-07-12T15:45:00',
    service_taken: false
  },
  {
    id: '3',
    name: 'Acme Corp',
    phone: '+1 (555) 456-7890',
    email: 'contact@acmecorp.com',
    message: 'Looking for digital marketing consultation',
    service: 'Digital Marketing',
    created_at: '2025-07-11T09:15:00',
    service_taken: false
  },
  {
    id: '4',
    name: 'Bob Johnson',
    phone: '+1 (555) 789-0123',
    email: 'bob@example.com',
    message: 'Need a complete website redesign',
    service: 'Website Development',
    created_at: '2025-07-10T14:20:00',
    service_taken: false
  },
  {
    id: '5',
    name: 'Alice Williams',
    phone: '+1 (555) 234-5678',
    email: 'alice@example.com',
    message: 'Interested in SEO services',
    service: 'Digital Marketing',
    created_at: '2025-07-09T11:10:00',
    service_taken: false
  }
];

const DashboardPage = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('enquiries')
        .select('id, created_at, name, phone, email, service, message')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching enquiries:', error.message);
        setError('Failed to load enquiries. Using sample data instead.');
        setEnquiries(sampleEnquiries);
      } else if (data) {
        setEnquiries(data as Enquiry[]);
      }

      setIsLoading(false);
    };

    fetchEnquiries();
  }, []);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Leads Dashboard</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Leads Dashboard</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.length > 0 ? (
                  enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enquiry.phone}</div>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{enquiry.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enquiry.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-500">{enquiry.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(enquiry.created_at)}</div>
                      </td>
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No enquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
