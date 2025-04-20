import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  confirmed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800'
};

interface Appointment {
  id: string | number;
  patient: string;
  test: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
  date?: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  return (
    <div className="overflow-hidden rounded-lg shadow">
      <ul className="divide-y divide-gray-200">
        <AnimatePresence>
          {appointments.map((appointment) => (
            <motion.li
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onClick={() => alert(`Appointment: ${appointment.patient} at ${appointment.time}`)}
              className="cursor-pointer px-6 py-4 bg-white hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">
                      {appointment.patient.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                    <div className="text-sm text-gray-500">{appointment.test}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 text-sm text-gray-500">{appointment.time}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[appointment.status]}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default AppointmentList;
