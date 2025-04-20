import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { labOwnerAPI } from '../../services/api';
import { Loader, ErrorMessage, EmptyState } from '../../components/ui';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import AppointmentList from './AppointmentList';
import { AppointmentCalendar } from './AppointmentCalendar';
import { TestManager } from './TestManager';
import MetricsCard from './MetricsCard';
import { motion } from 'framer-motion';
import { Activity, Clipboard, Clock, DollarSign, MapPin } from 'react-feather';
import { TestTube2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const LabOwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'tests' | 'labs'>('overview');
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const { data: statsRes, isLoading, error } = useQuery(['labStats'], () =>
    labOwnerAPI.getLabStats().then(res => res.data)
  );
  const navigate = useNavigate();
  const { data: labs, isLoading: labsLoading } = useQuery(['ownedLabs'], () =>
    labOwnerAPI.getOwnedLabs().then(res => res.data)
  );

  if (isLoading) return <Loader />;
  if (error || !statsRes) return <ErrorMessage message="Failed to load data" />;

  const { totalLabs, totalAppointments, totalTests, totalRevenue, pendingAppointments, recentAppointments = [], analytics = [] } = statsRes;

  const appointmentStatusData = [
    { name: 'Pending', value: recentAppointments.filter(a => a.status === 'pending').length },
    { name: 'Confirmed', value: recentAppointments.filter(a => a.status === 'confirmed').length },
    { name: 'Completed', value: recentAppointments.filter(a => a.status === 'completed').length },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Lab Dashboard</h1>
        <div className="space-x-2">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`px-4 py-2 rounded ${activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            Appointments
          </button>
          <button onClick={() => setActiveTab('tests')} className={`px-4 py-2 rounded ${activeTab === 'tests' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            Tests
          </button>
          <button onClick={() => setActiveTab('labs')} className={`px-4 py-2 rounded ${activeTab === 'labs' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            Labs
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="cursor-pointer" onClick={() => setActiveTab('labs')}>
              <MetricsCard title="Total Labs" value={totalLabs} icon={Activity} color="#4F46E5" />
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab('appointments')}>
              <MetricsCard title="Appointments" value={totalAppointments} icon={Clipboard} color="#059669" />
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab('tests')}>
              <MetricsCard title="Tests Conducted" value={totalTests} icon={Clock} color="#D97706" />
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab('labs')}>
              <MetricsCard title="Revenue" value={`₹${totalRevenue}`} icon={DollarSign} color="#B91C1C" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer" onClick={() => alert('Tests & Revenue chart clicked')}>
              <h3 className="text-lg font-medium mb-4">Tests & Revenue Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="testsConducted" stroke="#059669" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#B91C1C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow cursor-pointer" onClick={() => alert('Appointment Status chart clicked')}>
              <h3 className="text-lg font-medium mb-4">Appointment Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={appointmentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-4">Upcoming Appointments</h3>
            {recentAppointments.length > 0 ? (
              <AppointmentList appointments={recentAppointments} />
            ) : (
              <EmptyState title="No Appointments" description="You have no upcoming appointments" />
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-4">Calendar View</h3>
            <AppointmentCalendar />
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h3 className="text-lg font-medium mb-4">Manage Tests</h3>
            <TestManager />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Labs</h3>
              <button
                onClick={() => navigate('/lab-owner/add-lab')}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Add Lab
              </button>
            </div>
            {labsLoading ? (
              <Loader />
            ) : labs && labs.length > 0 ? (
              labs.map((lab) => (
                <div key={lab._id} className="border p-4 mb-4 rounded cursor-pointer" onClick={() => alert(`Lab: ${lab.name}`)}>
                  <h4 className="font-semibold">{lab.name}</h4>
                  <p className="text-sm text-gray-500">{lab.address.city}, {lab.address.state}</p>
                  <p className="mt-2 text-sm font-medium">Available Tests:</p>
                  <ul className="list-disc list-inside ml-4">
                    {lab.tests && lab.tests.length > 0 ? (
                      lab.tests.map((test: any) => (
                        <li key={test._id || test.id}>{test.name}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">No tests available</li>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <EmptyState title="No Labs" description="You haven't added any labs yet." />
            )}
          </div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Labs</h2>
            <button
              onClick={() => navigate('/lab-owner/add-lab')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add New Lab
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labsLoading ? (
              <Loader />
            ) : labs && labs.length > 0 ? (
              labs.map((lab) => (
                <div 
                  key={lab._id} 
                  className={`border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${selectedLab === lab._id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedLab(lab._id === selectedLab ? null : lab._id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{lab.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{lab.address.street}</p>
                      <p className="text-sm text-gray-600">{lab.address.city}, {lab.address.state}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {lab.tests?.length || 0} tests
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Appointment</span>
                      <span className="font-medium">2 days ago</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No Labs" description="You haven't added any labs yet." />
            )}
          </div>

          {selectedLab && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Manage {labs.find(l => l._id === selectedLab)?.name}</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => navigate(`/lab-owner/labs/${selectedLab}`)}
                  variant="outline"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={() => navigate(`/lab-owner/labs/${selectedLab}/appointments`)}
                  variant="outline"
                >
                  Appointments
                </Button>
                <Button 
                  onClick={() => navigate(`/lab-owner/labs/${selectedLab}/tests`)}
                  variant="outline"
                >
                  Tests
                </Button>
                <Button 
                  onClick={() => navigate(`/lab-owner/labs/${selectedLab}/staff`)}
                  variant="outline"
                >
                  Staff
                </Button>
                <Button 
                  onClick={() => navigate(`/lab-owner/labs/${selectedLab}/analytics`)}
                  variant="outline"
                >
                  Analytics
                </Button>
                <Button 
                  onClick={() => navigate(`/lab-owner/edit-lab/${selectedLab}`)}
                  variant="outline"
                >
                  Edit Lab
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default LabOwnerDashboard;
