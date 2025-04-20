import React from 'react';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => (
  message ? (
    <div className={`text-red-600 text-sm ${className}`}>
      {message}
    </div>
  ) : null
);
