import { motion } from 'framer-motion';
import { useState } from 'react';

export const TestManager = () => {
  const [tests, setTests] = useState([
    { id: 1, name: 'Complete Blood Count', price: 500, duration: '1 day', active: true },
    { id: 2, name: 'Thyroid Profile', price: 1200, duration: '2 days', active: true },
    { id: 3, name: 'Lipid Profile', price: 900, duration: '1 day', active: false }
  ]);

  const toggleTest = (id) => {
    setTests(tests.map(test => 
      test.id === id ? { ...test, active: !test.active } : test
    ));
  };

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <motion.div 
          key={test.id}
          className={`p-4 rounded-lg border ${test.active ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'}`}
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium dark:text-white">{test.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ₹{test.price} • {test.duration}
              </p>
            </div>
            <button
              onClick={() => toggleTest(test.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium ${test.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
            >
              {test.active ? 'Active' : 'Inactive'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
