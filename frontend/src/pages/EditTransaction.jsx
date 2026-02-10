import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Save, IndianRupee, Calendar, AlignLeft, Tag, Trash2 } from 'lucide-react';

const EditTransaction = () => {
  const { id } = useParams();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  const categories = type === 'income' 
    ? ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'] 
    : ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
       
        const response = await api.get(`/transaction/${id}`);
        const t = response.data;
        setType(t.type);
        setAmount(t.amount);
        setCategory(t.category);
        setDescription(t.description || '');
        setDate(t.date.split('T')[0]);
      } catch (err) {
        setError('Failed to fetch transaction details');
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/transaction/${id}`, {
        type,
        amount: Number(amount),
        category,
        description,
        date
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    setLoading(true);
    try {
        await api.delete(`/transaction/${id}`);
        navigate('/dashboard');
    } catch (err) {
        setError(err.response?.data?.msg || 'Failed to delete transaction');
        setLoading(false);
    }
  }

  if (initialLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-2xl mx-auto pt-8">
        <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 p-8 border border-slate-100">
          <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Edit Transaction</h2>
                <p className="text-slate-500 mt-1">Update transaction details</p>
            </div>
            <button 
                onClick={handleDelete}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Transaction"
            >
                <Trash2 className="w-5 h-5" />
            </button>
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
                <div className="relative group">
                  <span className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <IndianRupee className="w-5 h-5" />
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white font-medium"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="0.00"
                  />
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
              {loading ? 'Saving Changes...' : 'Update Transaction'}
              {!loading && <Save className="w-5 h-5 ml-2" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
