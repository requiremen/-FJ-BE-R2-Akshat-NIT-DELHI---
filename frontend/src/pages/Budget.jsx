import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Save, IndianRupee, Tag, Trash2, Plus } from 'lucide-react';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budget');
      setBudgets(response.data);
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budget', {
        category,
        amount: Number(amount)
      });
      setCategory('');
      setAmount('');
      fetchBudgets();
    } catch (err) {
      setError('Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/budget/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error("Failed to delete budget", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-4xl mx-auto pt-8">
        <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Budget Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Set Budget</h2>
              
              {error && <div className="text-rose-600 text-sm mb-4">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">Category</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">
                      <Tag className="w-4 h-4" />
                    </span>
                    <select
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
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

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">Monthly Limit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-400">
                      <IndianRupee className="w-4 h-4" />
                    </span>
                    <input
                      type="number"
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-indigo-700 transition duration-200 flex items-center justify-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Set Budget
                </button>
              </form>
            </div>
          </div>

          {/* Budget List */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Your Budgets</h2>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading budgets...</div>
            ) : budgets.length > 0 ? (
              <div className="grid gap-4">
                {budgets.map((budget) => (
                  <div key={budget._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{budget.category}</h3>
                        <p className="text-slate-500 text-sm">Monthly Limit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-800 block">₹{budget.amount.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(budget._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Tag className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-slate-900 font-medium">No budgets set</h3>
                <p className="text-slate-500 text-sm mt-1">Set a budget to track your spending limits.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
