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
                // Último elemento (actual) - no es link
                <span className="flex items-center gap-2 text-gray-900 font-semibold">
                  {Icon && <Icon className="w-5 h-5" />}
                  <span>{crumb.label}</span>
                </span>
              ) : (
                // Elementos anteriores - son links
                <Link
                  to={crumb.path}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
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
