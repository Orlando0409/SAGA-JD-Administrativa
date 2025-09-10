import React from 'react';
import { LuMail, LuUser, LuShield } from "react-icons/lu";
import type { Usuario } from '../Models/Usuario';
import { Card, CardHeader, CardBody ,CardSection } from './CardSection';


interface UserInfoCardProps {
  user: Usuario;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
    <Card className="mb-6">
      <CardHeader gradient className="text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <LuUser className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.Nombre_Usuario}</h2>
            <p className="text-blue-100">{user.Correo_Electronico}</p>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <CardSection title="Información Básica" icon={<LuUser className="w-5 h-5" />}>
            <div className="space-y-3">
              <InfoField label="Nombre de Usuario" value={user.Nombre_Usuario} />
              <InfoField 
                label="Correo Electrónico" 
                value={user.Correo_Electronico}
                icon={<LuMail className="w-4 h-4 text-gray-400" />}
              />
            </div>
          </CardSection>

          {/* Role Info */}
          <CardSection title="Rol y Permisos" icon={<LuShield className="w-5 h-5" />}>
            <div className="space-y-3">
              <div>
                <label htmlFor="user-role" className="block text-sm font-medium text-gray-500">Rol</label>
                <RoleBadge roleName={user.rol?.Nombre_Rol} id="user-role" />
              </div>
            </div>
          </CardSection>
        </div>

        {/* Permissions */}
        <PermissionsSection permisos={user.rol?.permisos} />
      </CardBody>
    </Card>
  );
};

// Componentes auxiliares
interface InfoFieldProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon }) => (
  <div className={icon ? 'flex items-center gap-2' : ''}>
    {icon}
    <div>
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

interface RoleBadgeProps {
  roleName?: string;
  id?: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ roleName, id }) => (
  <span id={id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
    {roleName || 'Sin rol'}
  </span>
);

interface PermissionsSectionProps {
  permisos?: any[];
}

const PermissionsSection: React.FC<PermissionsSectionProps> = ({ permisos }) => {
  if (!permisos || permisos.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {permisos.map((permiso) => (
          <PermissionCard key={permiso.id} permiso={permiso} />
        ))}
      </div>
    </div>
  );
};

interface PermissionCardProps {
  permiso: any;
}

const PermissionCard: React.FC<PermissionCardProps> = ({ permiso }) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <p className="font-medium text-gray-900">{permiso.modulo}</p>
    <div className="flex gap-2 mt-1">
      <PermissionBadge allowed={permiso.Ver} label="Ver" />
      <PermissionBadge allowed={permiso.Editar} label="Editar" />
    </div>
  </div>
);

interface PermissionBadgeProps {
  allowed: boolean;
  label: string;
}

const PermissionBadge: React.FC<PermissionBadgeProps> = ({ allowed, label }) => (
  <span className={`text-xs px-2 py-1 rounded ${
    allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {label}: {allowed ? 'Sí' : 'No'}
  </span>
);

export default UserInfoCard;