import React from 'react';
import { motion } from 'framer-motion';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center p-4 rounded-lg shadow-md"
    style={{ backgroundColor: color }}
  >
    <div className="p-3 rounded-full bg-white/30 mr-4">
      <Icon size={24} className="text-white" />
    </div>
    <div className="text-white">
      <p className="text-sm uppercase font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

export default MetricsCard;
