import { motion } from 'framer-motion';
import { useState } from 'react';

interface Test {
  id: string;
  name: string;
  price: number;
  category?: string;
  isActive: boolean;
  description?: string;
}

interface Lab {
  id: string;
  name: string;
  tests: Test[];
}

interface TestManagerProps {
  lab?: Lab;
}

export const TestManager = ({ lab }: TestManagerProps) => {
  const [tests, setTests] = useState<Test[]>(lab?.tests || []);

  const toggleTest = (id: string) => {
    setTests(tests.map(test =>
      test.id === id ? { ...test, isActive: !test.isActive } : test
    ));
    // In a real app, this would also call an API to update the status
  };

  if (!lab) {
    return <div className="text-center py-10 text-gray-500 italic">Select a lab to manage tests.</div>;
  }

  return (
    <div className="space-y-4">
      {tests.length === 0 ? (
        <div className="text-center py-10 text-gray-400 italic">No tests available for this lab.</div>
      ) : (
        tests.map((test) => (
          <motion.div
            key={test.id}
            className={`p-4 rounded-lg border ${test.isActive ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 bg-gray-50 dark:bg-gray-800'}`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium dark:text-white">{test.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ₹{test.price} • {test.category || 'General'}
                </p>
                {test.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{test.description}</p>}
              </div>
              <button
                onClick={() => toggleTest(test.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${test.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
              >
                {test.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};
