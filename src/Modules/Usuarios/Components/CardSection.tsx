import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
  gradient?: boolean;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  children, 
  gradient = false, 
  className = '' 
}) => (
  <div className={`p-6 ${gradient ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'border-b'} ${className}`}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

interface CardSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const CardSection: React.FC<CardSectionProps> = ({ 
  title, 
  icon, 
  children, 
  className = '' 
}) => (
  <div className={`space-y-4 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);