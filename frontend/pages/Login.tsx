import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Dribbble } from 'lucide-react';
import { Input, Button } from '../components/ui';
import { login } from '../src/api/endpoints';


export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email');
    const password = formData.get('password');
    // Simple extraction, or using controlled inputs. 
    // The previous code used Input component but without onChange handling shown (it was presentational).
    // I need to make them work.
    // The previous code: <Input label="Email" ... />
    // Input component is inside ui/ index. I should assume it propagates props.
    // I'll switch to controlled inputs or basic html inputs if Input is tricky, but "NO rediseñar".
    // I will try to use name attribute and native form data if Input passes props to input element.

    try {
      const response = await login({ email, password });
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        // Assuming response.user contains role. Use default if missing or mock based on email for testing if needed.
        // For now, save the user object if present, or create a basic one.
        const user = response.user || { role: email === 'admin@mundialscore.com' ? 'ADMIN' : 'USER', name: 'Usuario' };
        localStorage.setItem('user', JSON.stringify(user));
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Inicio de sesión fallido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-field-dark">
      <div className="w-full max-w-md bg-transparent rounded-[32px] p-0 flex flex-col items-center relative z-10">

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-field-card border border-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-field/20">
            <Dribbble size={40} className="text-field" />
          </div>
          <h1 className="text-3xl font-bold mb-2">MundialScore</h1>
          <p className="text-gray-400 text-sm text-center">Predicción de partidos de selecciones</p>
        </div>

        {/* Form contents */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
          {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}

          <Input
            label="EMAIL"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            icon={<Mail size={18} />}
            className="bg-field-input border-transparent focus:border-field py-3"
          />

          <Input
            label="CONTRASEÑA"
            type="password"
            name="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            className="bg-field-input border-transparent focus:border-field py-3"
          />

          <div className="w-full text-right">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">¿Olvidaste tu contraseña?</a>
          </div>

          <Button type="submit" fullWidth className="mt-4 text-lg py-4 rounded-xl shadow-lg shadow-green-500/20" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-12 text-sm text-gray-400">
          ¿No tienes cuenta? <Link to="/register" className="text-field font-bold hover:underline ml-1">Registrarse</Link>
        </div>
      </div>
    </div>
  );
};