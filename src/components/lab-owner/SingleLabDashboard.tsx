import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { labOwnerAPI } from '../../services/api';
import { Loader, ErrorMessage, EmptyState } from '../../components/ui';
import { motion } from 'framer-motion';
import { Activity, Clipboard, Clock, DollarSign } from 'react-feather';
import { ResponsiveContainer, LineChart, PieChart, Pie, Cell, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface Lab {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  tests: Array<{
    id: number;
    name: string;
    price: number;
  }>;
  stats: {
    totalAppointments: number;
    totalTests: number;
    totalRevenue: number;
    pendingAppointments: number;
  };
  analytics: Array<{
    month: string;
    tests: number;
    revenue: number;
  }>;
}

interface LabResponse {
  data: Lab;
}

export default function SingleLabDashboard() {
  const { labId } = useParams();
  
  // Dummy data for the selected lab
  const { data: labResponse, isLoading, error } = useQuery<LabResponse>(['lab', labId], () => ({
    data: {
      _id: labId,
      name: 'Metropolis Lab',
      address: {
        street: '123 Medical Plaza',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400001'
      },
      tests: [
        { id: 1, name: 'Complete Blood Count', price: 500 },
        { id: 2, name: 'Lipid Profile', price: 800 },
        { id: 3, name: 'Thyroid Test', price: 1200 }
      ],
      stats: {
        totalAppointments: 42,
        totalTests: 86,
        totalRevenue: 68400,
        pendingAppointments: 5
      },
      analytics: [
        { month: 'Jan', tests: 12, revenue: 9600 },
        { month: 'Feb', tests: 15, revenue: 12000 },
        { month: 'Mar', tests: 18, revenue: 14400 },
        { month: 'Apr', tests: 20, revenue: 16000 },
        { month: 'May', tests: 21, revenue: 16800 }
      ]
    }
  }));

  const lab = labResponse?.data;
  if (isLoading) return <Loader />;
  if (error || !lab) return <ErrorMessage message="Failed to load lab data" />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{lab?.name}</h1>
          <p className="text-gray-600">
            {lab?.address?.street || '-'}, {lab?.address?.city || '-'}, {lab?.address?.state || '-'}{lab?.address?.zip ? ` - ${lab?.address.zip}` : ''}
          </p>
        </div>
        <button 
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Back to All Labs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl shadow cursor-pointer">
          <h3 className="text-sm font-medium text-gray-500">Appointments</h3>
          <p className="mt-1 text-2xl font-semibold">{lab.stats.totalAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow cursor-pointer">
          <h3 className="text-sm font-medium text-gray-500">Tests Conducted</h3>
          <p className="mt-1 text-2xl font-semibold">{lab.stats.totalTests}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow cursor-pointer">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="mt-1 text-2xl font-semibold">₹{lab.stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow cursor-pointer">
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="mt-1 text-2xl font-semibold">{lab.stats.pendingAppointments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Tests & Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lab.analytics}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tests" stroke="#8884d8" />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-medium mb-4">Available Tests</h3>
          <div className="space-y-2">
            {lab.tests.map(test => (
              <div key={test.id} className="flex justify-between p-3 border rounded">
                <span>{test.name}</span>
                <span className="font-medium">₹{test.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-medium mb-4">Recent Appointments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 1, patient: 'Rahul Sharma', test: 'Complete Blood Count', date: '20 Apr 2025', status: 'Completed' },
                { id: 2, patient: 'Priya Patel', test: 'Lipid Profile', date: '19 Apr 2025', status: 'Completed' },
                { id: 3, patient: 'Amit Kumar', test: 'Thyroid Test', date: '18 Apr 2025', status: 'Pending' },
                { id: 4, patient: 'Neha Gupta', test: 'Complete Blood Count', date: '17 Apr 2025', status: 'Completed' },
              ].map(appointment => (
                <tr key={appointment.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.test}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
