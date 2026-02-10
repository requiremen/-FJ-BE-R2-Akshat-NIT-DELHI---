import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Save, IndianRupee, Calendar, AlignLeft, Tag } from 'lucide-react';

const AddTransaction = () => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = type === 'income' 
    ? ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'] 
    : ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!category) {
        setError('Please select a category');
        return;
    }

    setLoading(true);
    try {
      console.log("Sending transaction:", { type, amount, category, description, date, currency });
      await api.post('/transaction', {
        type,
        amount: Number(amount),
        category,
        description,
        date,
        currency
      });
      navigate('/dashboard');
    } catch (err) {
      console.error("Add Transaction Error:", err);
      const errorMessage = err.response?.data?.msg || 'Failed to add transaction. Please check your connection.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-2xl mx-auto pt-8">
        <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8 border border-slate-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Add New Transaction</h2>
            <p className="text-slate-500 mt-1">Record your financial activity</p>
          </div>
          
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm flex items-center">
               <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selector */}
            <div className="bg-slate-100 p-1.5 rounded-xl flex">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  type === 'expense' 
                    ? 'bg-white text-rose-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => { setType('expense'); setCategory(''); }}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  type === 'income' 
                    ? 'bg-white text-emerald-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                onClick={() => { setType('income'); setCategory(''); }}
              >
                Income
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">Amount</label>
                <div className="flex gap-2">
                    <div className="relative w-1/3">
                         <select
                            className="w-full px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50 focus:bg-white appearance-none cursor-pointer font-medium text-sm"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                    <div className="relative group w-2/3">
                    <span className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors font-bold text-sm">
                        {currency}
                    </span>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white font-medium"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        placeholder="0.00"
                    />
                    </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">Category</label>
                <div className="relative group">
                  <span className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Tag className="w-5 h-5" />
                  </span>
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Date</label>
              <div className="relative group">
                <span className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <Calendar className="w-5 h-5" />
                </span>
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white font-medium"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Description (Optional)</label>
              <div className="relative group">
                <span className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <AlignLeft className="w-5 h-5" />
                </span>
                <textarea
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this for?"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-slate-900 text-white font-bold py-4 px-4 rounded-xl hover:bg-slate-800 transition duration-200 flex items-center justify-center shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Save Transaction'}
              {!loading && <Save className="w-5 h-5 ml-2" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
