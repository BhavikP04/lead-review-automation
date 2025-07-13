import { useState, useEffect } from 'react';

// Mock data type for leads
interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string;
  service: string;
  created_at: string;
  review_status: 'New' | 'In Progress' | 'Contacted' | 'Converted';
}

// Mock data for the dashboard
const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    message: 'Interested in website development services',
    service: 'Website Development',
    created_at: '2025-07-13T10:30:00',
    review_status: 'New'
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+1 (555) 987-6543',
    message: 'Need help with social media strategy',
    service: 'Social Media Management',
    created_at: '2025-07-12T15:45:00',
    review_status: 'In Progress'
  },
  {
    id: '3',
    name: 'Acme Corp',
    phone: '+1 (555) 456-7890',
    message: 'Looking for digital marketing consultation',
    service: 'Digital Marketing',
    created_at: '2025-07-11T09:15:00',
    review_status: 'Contacted'
  },
  {
    id: '4',
    name: 'Bob Johnson',
    phone: '+1 (555) 789-0123',
    message: 'Need a complete website redesign',
    service: 'Website Development',
    created_at: '2025-07-10T14:20:00',
    review_status: 'Converted'
  },
  {
    id: '5',
    name: 'Alice Williams',
    phone: '+1 (555) 234-5678',
    message: 'Interested in SEO services',
    service: 'Digital Marketing',
    created_at: '2025-07-09T11:10:00',
    review_status: 'In Progress'
  }
];

const DashboardPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch leads
    const fetchLeads = async () => {
      try {
        // In a real app, this would be an actual API call
        // const { data, error } = await supabase.from('leads').select('*');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setLeads(mockLeads);
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800';
      case 'Converted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{lead.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-500">{formatDate(lead.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(lead.review_status)}`}>
                          {lead.review_status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No leads found.
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
