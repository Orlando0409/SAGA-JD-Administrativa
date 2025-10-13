import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { generateBreadcrumbs } from '../utils/breadcrumbConfig';

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className = '' }) => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  // Si no hay breadcrumbs (estamos en Home), no mostrar nada
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center gap-3 text-base ${className}`}
    >
      <ol className="flex items-center gap-3 flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const Icon = crumb.icon;

          return (
            <li key={crumb.path} className="flex items-center gap-3">
              {index > 0 && (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
              
              {isLast ? (
                <span className="flex items-center bg-blue-50 border border-blue-200 p-2 rounded-lg px-3 py-2 text-blue-900 gap-2 font-semibold">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{crumb.label}</span>
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  className="flex items-center gap-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors font-medium"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{crumb.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
