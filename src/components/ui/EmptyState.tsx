import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon }: EmptyStateProps) => (
  <div className="text-center p-8">
    {icon && <div className="mx-auto w-12 h-12 mb-4">{icon}</div>}
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-gray-500 mt-1">{description}</p>
  </div>
);
