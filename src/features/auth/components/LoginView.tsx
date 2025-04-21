/**
 * Login View Component
 *
 * Presentation component that renders the login form UI
 */
import React from "react";
import { Lock } from "lucide-react";

export interface LoginViewProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Lock className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Sistema de Calificaciones
        </h2>
        <h3 className="text-xl font-semibold mb-2 text-center">
          Procesos de Fabricación
        </h3>
        <h4 className="text-lg font-medium mb-4 text-center">UNEXPO</h4>
        <p className="text-sm mb-6 text-center">
          <strong>Información de Acceso</strong>
          <br />
          Estudiantes: Usar su correo electrónico y contraseña.
          <br />
          Primera vez: usar contraseña "student123"
        </p>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={onPasswordChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};
