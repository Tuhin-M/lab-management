import { motion } from 'framer-motion';

const stats = [
  { name: 'Total Appointments', value: '1,234', change: '+12%', changeType: 'positive' },
  { name: 'Test Completion', value: '89%', change: '+5%', changeType: 'positive' },
  { name: 'Revenue', value: '$12,345', change: '-2%', changeType: 'negative' },
];

const LabStats = () => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((stat, statIdx) => (
        <motion.div
          key={stat.name}
          className="bg-white overflow-hidden shadow rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * statIdx }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className={`flex items-center text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.changeType === 'positive' ? (
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {stat.change}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LabStats;
