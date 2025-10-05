import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'refund' | 'reward';
  amount: number;
  description: string;
  orderId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export const WalletPage: React.FC = () => {
  const [balance] = useState(2500);
  const [activeTab, setActiveTab] = useState<'transactions' | 'topup'>('transactions');
  const [topupAmount, setTopupAmount] = useState('');

  const transactions: Transaction[] = [
    {
      id: 'txn-1',
      type: 'credit',
      amount: 1500,
      description: 'Payment from order #ORD-123',
      orderId: 'order-123',
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn-2',
      type: 'reward',
      amount: 100,
      description: 'Achievement reward: First Sale',
      status: 'completed',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn-3',
      type: 'debit',
      amount: 50,
      description: 'Platform fee deduction',
      status: 'completed',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn-4',
      type: 'credit',
      amount: 2200,
      description: 'Payment from order #ORD-089',
      orderId: 'order-089',
      status: 'completed',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const totalCredits = transactions
    .filter(t => t.type === 'credit' || t.type === 'reward')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleTopup = () => {
    const amount = parseFloat(topupAmount);
    if (amount > 0) {
      alert(`Top-up of ₹${amount} initiated!\nIn production, this would connect to a payment gateway.`);
      setTopupAmount('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Wallet size={32} />
          KalaMitra Wallet
        </h1>
        <p className="text-green-50">Manage your earnings and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-deepblue-600 to-terracotta-500 text-white rounded-lg p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Available Balance</p>
            <h2 className="text-5xl font-bold">₹{balance.toLocaleString('en-IN')}</h2>
          </div>
          <Wallet size={64} className="opacity-30" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white border-opacity-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} />
              <span className="text-sm text-blue-100">Total Credits</span>
            </div>
            <p className="text-2xl font-bold">₹{totalCredits.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={16} />
              <span className="text-sm text-blue-100">Total Debits</span>
            </div>
            <p className="text-2xl font-bold">₹{totalDebits.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button className="px-4 py-3 bg-white text-deepblue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <ArrowUpRight size={18} />
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab('topup')}
            className="px-4 py-3 bg-white bg-opacity-20 text-white rounded-lg font-semibold hover:bg-opacity-30 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Top Up
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign size={20} />
            <span className="text-sm font-semibold">This Month</span>
          </div>
          <p className="text-2xl font-bold text-deepblue-800">₹{totalCredits.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <TrendingUp size={20} />
            <span className="text-sm font-semibold">Pending</span>
          </div>
          <p className="text-2xl font-bold text-deepblue-800">₹0</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Wallet size={20} />
            <span className="text-sm font-semibold">Lifetime</span>
          </div>
          <p className="text-2xl font-bold text-deepblue-800">₹{totalCredits.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'transactions'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('topup')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'topup'
              ? 'text-terracotta-600 border-b-2 border-terracotta-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Top Up
        </button>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' || transaction.type === 'reward'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' || transaction.type === 'reward' ? (
                      <ArrowDownLeft size={24} />
                    ) : (
                      <ArrowUpRight size={24} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-deepblue-800">{transaction.description}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-semibold ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      transaction.type === 'credit' || transaction.type === 'reward'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' || transaction.type === 'reward' ? '+' : '-'}₹
                    {transaction.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                </div>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Wallet size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-700 mb-2">No transactions yet</p>
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Top Up Tab */}
      {activeTab === 'topup' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-deepblue-800 mb-4">Add Money to Wallet</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={topupAmount}
                onChange={(e) => setTopupAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-terracotta-400 outline-none text-lg"
                min="1"
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[500, 1000, 2000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopupAmount(amount.toString())}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-terracotta-400 hover:bg-saffron-50 transition-colors font-semibold"
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Funds will be added instantly after successful payment. Minimum top-up amount is ₹100.
              </p>
            </div>

            <button
              onClick={handleTopup}
              disabled={!topupAmount || parseFloat(topupAmount) < 100}
              className={`w-full px-6 py-4 rounded-lg font-semibold text-lg transition-colors ${
                topupAmount && parseFloat(topupAmount) >= 100
                  ? 'bg-terracotta-500 text-white hover:bg-terracotta-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add ₹{topupAmount || '0'} to Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
