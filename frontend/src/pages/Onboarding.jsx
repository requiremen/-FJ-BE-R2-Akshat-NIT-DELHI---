import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { IndianRupee, ArrowRight, Wallet } from 'lucide-react';

const Onboarding = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);

    try {
      // Create initial balance transaction
      await api.post('/transaction', {
        type: 'income',
        amount: Number(amount),
        currency,
        category: 'Salary', // Default category for initial income
        description: 'Initial Balance',
        date: new Date().toISOString().split('T')[0]
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to set initial balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200 w-full max-w-md border border-slate-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-indigo-50 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-emerald-50 rounded-full"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Wallet className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome!</h1>
            <p className="text-slate-500">Let's set up your initial balance to get started.</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm flex items-center">
               <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                What is your preferred currency?
              </label>
               <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white appearance-none cursor-pointer font-medium mb-4"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
              >
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
              </select>

              <label className="block text-slate-700 text-sm font-semibold mb-2">
                What is your current balance?
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors font-bold">
                  {currency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full pl-16 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-semibold text-slate-800 transition-all duration-200 bg-slate-50 focus:bg-white"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 px-4 rounded-xl hover:bg-slate-800 transition duration-200 flex items-center justify-center shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? 'Setting up...' : 'Start Tracking'}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
