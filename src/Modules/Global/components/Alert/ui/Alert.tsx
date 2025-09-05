import React from 'react';
import { FiXCircle } from "react-icons/fi";
import { alertConfig, type AlertProps } from '../../../types/Alert';



export const Alert: React.FC<AlertProps> = ({ 
  type, 
  title, 
  description, 
  onClose, 
  className = '' 
}) => {
  const config = alertConfig[type];
  const IconComponent = config.icon;

  return (
    <div className={`
      ${config.bgColor} 
      ${config.borderColor} 
      border-l-4 p-4 rounded-r-lg shadow-lg backdrop-blur-sm
      ${className}
    `}>
      <div className="flex items-start">
        <IconComponent className={`h-5 w-5 ${config.titleColor} mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${config.titleColor}`}>
            {title}
          </h3>
          {description && (
            <p className={`mt-1 text-sm ${config.textColor}`}>
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-3 ${config.textColor} hover:${config.titleColor} transition-colors`}
          >
            <FiXCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};