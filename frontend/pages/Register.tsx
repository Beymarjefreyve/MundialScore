import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft, Dribbble } from 'lucide-react';
import { Input, Button } from '../components/ui';
import { register } from '../src/api/endpoints';


export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Need to set form onSubmit (it was just div/button before?)
    // The original code had form, but button had onClick navigate.
    // I should change Button type to submit and remove onClick, or handle onClick.
    // And gather data.
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    try {
      await register(data);
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Error en registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6 relative bg-field-dark items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center relative z-10">

        {/* Header/Nav */}
        <div className="w-full flex items-center justify-between mb-2">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-lg">Crear Cuenta</span>
          <div className="w-8" />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-field-card border border-white/5 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-field/10">
            <Dribbble size={32} className="text-field" />
          </div>
          <h1 className="text-2xl font-bold mb-1 text-center">MundialScore</h1>
          <p className="text-gray-400 text-center text-xs px-4">
            Regístrate y pronostica los partidos de tu selección nacional favorita.
          </p>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handleRegister}>
          <Input
            label="NOMBRE COMPLETO"
            name="name"
            placeholder="Ej. Juan Pérez"
            className="bg-field-input border-transparent focus:border-field py-3"
          />
          <Input
            label="CORREO ELECTRÓNICO"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            className="bg-field-input border-transparent focus:border-field py-3"
          />
          <Input
            label="CONTRASEÑA"
            type="password"
            name="password"
            placeholder="••••••••"
            className="bg-field-input border-transparent focus:border-field py-3"
          />

          <div className="flex items-center gap-3 mt-1">
            <input type="checkbox" id="terms" className="w-5 h-5 rounded border-gray-600 bg-field-input checked:bg-field text-field focus:ring-field" />
            <label htmlFor="terms" className="text-xs text-gray-400">
              Acepto los <a href="#" className="text-field hover:underline font-bold">Términos y Condiciones</a>
            </label>
          </div>

          <Button type="submit" fullWidth className="mt-4 uppercase tracking-wide text-sm py-4 rounded-xl shadow-lg shadow-green-500/20" disabled={loading}>
            {loading ? 'Registrando...' : 'REGISTRARSE'}
          </Button>
        </form>

        <div className="mt-8 mb-6 flex items-center gap-4 w-full">
          <div className="h-[1px] bg-white/10 flex-1"></div>
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">O regístrate con</span>
          <div className="h-[1px] bg-white/10 flex-1"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button className="bg-field-card hover:bg-white/5 border border-white/10 rounded-xl py-3 flex items-center justify-center transition-colors">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">G</span>
            </div>
          </button>
          <button className="bg-field-card hover:bg-white/5 border border-white/10 rounded-xl py-3 flex items-center justify-center transition-colors">
            <span className="font-bold text-sm">iOS</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400 pb-4">
          ¿Ya tienes cuenta? <Link to="/login" className="text-field font-bold hover:underline ml-1">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
};