import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Plus, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Wallet,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Home,
  Zap,
  Activity,
  Briefcase,
  Gift,
  MoreHorizontal,
  Pencil,
  PieChart as PieChartIcon,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentTransactions: [],
    monthlyData: [],
    categoryData: [],
    budgets: [] // Add budgets to state
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, budgetRes] = await Promise.all([
            api.get('/dashboard'),
            api.get('/budget')
        ]);
        
        // Check if user has no transactions - redirect to onboarding
        if (dashboardRes.data.recentTransactions.length === 0 && dashboardRes.data.totalIncome === 0 && dashboardRes.data.totalExpense === 0) {
           navigate('/onboarding');
           return;
        }

        setDashboardData({
            ...dashboardRes.data,
            budgets: budgetRes.data
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const getCurrencySymbol = (currency) => {
      switch(currency) {
          case 'USD': return '$';
          case 'EUR': return '€';
          case 'GBP': return '£';
          default: return '₹';
      }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Salary': return <Briefcase className="w-5 h-5" />;
      case 'Freelance': return <Briefcase className="w-5 h-5" />;
      case 'Investments': return <TrendingUp className="w-5 h-5" />;
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'Food': return <Utensils className="w-5 h-5" />;
      case 'Transport': return <Car className="w-5 h-5" />;
      case 'Housing': return <Home className="w-5 h-5" />;
      case 'Utilities': return <Zap className="w-5 h-5" />;
      case 'Entertainment': return <Coffee className="w-5 h-5" />; // Coffee/Leisure
      case 'Health': return <Activity className="w-5 h-5" />;
      case 'Shopping': return <ShoppingBag className="w-5 h-5" />;
      default: return <MoreHorizontal className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
     // Return tailwind classes for bg and text
     switch (category) {
      case 'Salary': 
      case 'Freelance': 
      case 'Investments': 
      case 'Gift': 
        return 'bg-emerald-100 text-emerald-600';
      default: 
        return 'bg-blue-100 text-blue-600';
    }
  }

  const getBudgetProgress = (category) => {
    const budget = dashboardData.budgets.find(b => b.category === category);
    if (!budget) return null;
    
    const spent = dashboardData.categoryData.find(c => c.name === category)?.value || 0;
    const percentage = Math.min((spent / budget.amount) * 100, 100);
    
    return {
        budget: budget.amount,
        spent,
        percentage
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                ExpenseTracker
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-slate-700">{user?.Username}</span>
                <span className="text-xs text-slate-500">{user?.Useremail}</span>
              </div>
              <button 
                onClick={logout} 
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500">Here's your financial overview.</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance Card - Hero */}
          <div className="md:col-span-3 lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <p className="text-indigo-100 font-medium mb-1">Total Balance</p>
              <div className="flex items-center text-4xl font-bold mb-4">
                <IndianRupee className="w-8 h-8 mr-1 opacity-80" />
                {dashboardData.balance.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center text-sm text-indigo-100 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                <span>Available Wallet</span>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Income
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Income</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                ₹{dashboardData.totalIncome.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-rose-100 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6 text-rose-600" />
              </div>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                Expense
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Spent</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                ₹{dashboardData.totalExpense.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Activity Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Activity</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.monthlyData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Expense Breakdown</h3>
            <div className="h-64 w-full flex items-center justify-center">
              {dashboardData.categoryData && dashboardData.categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400">
                  <div className="bg-slate-50 p-4 rounded-full inline-block mb-3">
                    <PieChartIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <p>No expense data yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
                View All
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {dashboardData.recentTransactions.length > 0 ? (
                dashboardData.recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150 group">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${getCategoryColor(transaction.category)} bg-opacity-50 group-hover:scale-110 transition-transform duration-200`}>
                        {getCategoryIcon(transaction.category)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{transaction.category}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          {transaction.description && (
                            <>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="truncate max-w-[150px]">{transaction.description}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold text-base ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{getCurrencySymbol(transaction.currency)}{transaction.amount.toLocaleString('en-IN')}
                      </span>
                      <Link 
                        to={`/edit-transaction/${transaction._id}`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Edit Transaction"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-slate-900 font-medium mb-1">No transactions yet</h3>
                  <p className="text-slate-500 text-sm">Start adding your expenses to track them here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Action</h3>
              <div className="space-y-3">
                <Link
                  to="/add-transaction"
                  className="group flex items-center justify-center w-full bg-slate-900 text-white font-semibold py-4 px-4 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="bg-white/20 p-1 rounded-md mr-3 group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="w-5 h-5" />
                  </div>
                  Add New Transaction
                </Link>
                <Link
                  to="/budget"
                  className="group flex items-center justify-center w-full bg-indigo-50 text-indigo-700 font-semibold py-4 px-4 rounded-xl hover:bg-indigo-100 transition-all duration-200 border border-indigo-100"
                >
                  <Target className="w-5 h-5 mr-3" />
                  Manage Budgets
                </Link>
              </div>
            </div>

            {/* Budget Status Widget */}
            {dashboardData.budgets.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Budget Status</h3>
                    <div className="space-y-4">
                        {dashboardData.budgets.slice(0, 3).map(budget => {
                            const progress = getBudgetProgress(budget.category);
                            if (!progress) return null;
                            const isOverBudget = progress.spent > progress.budget;
                            
                            return (
                                <div key={budget._id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{budget.category}</span>
                                        <span className={`font-medium ${isOverBudget ? 'text-rose-600' : 'text-slate-500'}`}>
                                            {Math.round(progress.percentage)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>₹{progress.spent.toLocaleString()}</span>
                                        <span>₹{budget.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Financial Tip Widget */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-amber-800/80 leading-relaxed">
                    Try to follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings/debts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
