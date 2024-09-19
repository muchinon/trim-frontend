'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser, shortenURL } from '../../utils/api';

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin: initialIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = isLogin
        ? await loginUser(email, password)
        : await registerUser(email, password);

      console.log('Authentication response:', response);

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        
        // Handle pending URL
        const pendingUrl = localStorage.getItem('pendingUrl');
        if (pendingUrl) {
          try {
            await shortenURL(pendingUrl);
          } catch (error) {
            console.error('Error shortening pending URL:', error);
          } finally {
            localStorage.removeItem('pendingUrl');
          }
        }
        
        router.push('/dashboard');
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-blue">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-navy-blue">
          {isLogin ? 'Welcome Back!' : 'Create an Account'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-gray-900"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-orange-500 hover:text-orange-600 focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;