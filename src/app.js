import React, { useState } from 'react';
import { Camera, PlusCircle, AlertTriangle, FileText } from 'lucide-react';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('both');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [receipt, setReceipt] = useState(null);

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalGst = expenses.reduce((sum, item) => {
    return item.category === 'both' ? sum + (Number(item.amount) / 11) : sum;
  }, 0);
  const totalTaxDeductible = expenses.reduce((sum, item) => {
    if (item.category === 'both') return sum + (Number(item.amount) - (Number(item.amount) / 11));
    if (item.category === 'tax_only') return sum + Number(item.amount);
    return sum;
  }, 0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-AU'),
      description,
      amount: parseFloat(amount),
      category,
      paymentMethod,
      receiptName: receipt ? receipt.name : 'no receipt'
    };

    setExpenses([newEntry, ...expenses]);
    setDescription('');
    setAmount('');
    setReceipt(null);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 p-4 font-sans text-slate-800">
      <header className="flex justify-between items-center mb-6 bg-blue-600 text-white p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-bold">Maasa Tax Tracker</h1>
          <p className="text-xs text-blue-100">Smart ATO Expense Assistant</p>
        </div>
        <FileText className="w-8 h-8 opacity-80" />
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Claimable GST (BAS)</p>
          <p className="text-lg font-bold text-green-600">${totalGst.toFixed(2)}</p>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Tax Deduction</p>
          <p className="text-lg font-bold text-blue-600">${totalTaxDeductible.toFixed(2)}</p>
        </div>
      </div>

      {totalSpent > 2000 && (
        <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Expense Alert:</strong> Total spending crossed $2,000 this month.
          </p>
        </div>
      )}

      <form onSubmit={handleAddExpense} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-3">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-blue-600" /> Add New Expense
        </h2>
        
        <input 
          type="text" 
          placeholder="Expense Name (e.g. Fuel, Toll)" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Amount ($)" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-1/2 p-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-1/2 p-2 text-sm border border-slate-300 rounded-lg bg-white"
          >
            <option value="card">Bank Card / Cash</option>
            <option value="zip">Zip / BNPL</option>
            <option value="wise">Wise Account</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">ATO Claim Category:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-slate-50 font-medium"
          >
            <option value="both">Both (GST + Income Tax) - Fuel, Repairs</option>
            <option value="tax_only">Income Tax Only - Tolls, Rego, Fees</option>
            <option value="personal">Personal / Non-Claimable</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <label className="flex-1 flex items-center justify-center gap-2 p-2 border border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 text-xs text-slate-600">
            <Camera className="w-4 h-4 text-slate-500" />
            {receipt ? receipt.name : 'Upload Receipt Photo'}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => setReceipt(e.target.files[0])} 
            />
          </label>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg text-sm transition shadow"
        >
          Save Expense
        </button>
      </form>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Recent Transactions</h2>
          <span className="text-xs text-slate-400">{expenses.length} Entries</span>
        </div>

        {expenses.length === 0 ? (
          <p className="text-xs text-center text-slate-400 py-6">No expenses added yet.</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {expenses.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{item.description}</p>
                  <p className="text-slate-400">{item.date} • {item.paymentMethod}</p>
                  <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    item.category === 'both' ? 'bg-green-100 text-green-700' :
                    item.category === 'tax_only' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {item.category === 'both' ? 'GST + Tax' : item.category === 'tax_only' ? 'Tax Only' : 'Personal'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-sm">${item.amount.toFixed(2)}</p>
                  {item.category === 'both' && (
                    <p className="text-[10px] text-green-600">GST: ${(item.amount / 11).toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
