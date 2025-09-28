import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    const result = await register(formData.username, formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#134E5E] to-[#71B280] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:scale-[1.02] animate-fadeIn">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6 animate-slideDown">
          Create your account ✨
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 animate-pulse">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:ring-2 focus:ring-[#21808D] focus:outline-none transition duration-300"
          />

          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:ring-2 focus:ring-[#21808D] focus:outline-none transition duration-300"
          />

          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:ring-2 focus:ring-[#21808D] focus:outline-none transition duration-300"
          />

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 focus:ring-2 focus:ring-[#21808D] focus:outline-none transition duration-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold bg-[#21808D] shadow-md hover:shadow-lg hover:bg-[#18606a] focus:ring-4 focus:ring-[#21808D]/50 transform transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm font-medium text-[#21808D] hover:text-[#18606a] transition duration-300"
            >
              Already have an account? <span className="underline">Sign in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
