function App() {
    const [transactions, setTransactions] = React.useState([
        { id: 1, date: '2026-07-01', account: 'ANZ Advantage', type: 'Income', category: 'International / GST-Free Income', vendor: 'USA Client - AI Services', amount: 15000, gst: 0 },
        { id: 2, date: '2026-07-02', account: 'Zep Money', type: 'Expense', category: 'GST Business Expenses (G2 - Claimable)', vendor: 'OpenAI', amount: 20, gst: 1.82 },
        { id: 3, date: '2026-07-10', account: 'Progress Saver', type: 'Income', category: 'Local Sales (G1 - GST Included)', vendor: 'Local Client', amount: 550, gst: 50 }
    ]);

    const [form, setForm] = React.useState({ date: '', account: 'ANZ Advantage', type: 'Income', category: 'Local Sales (G1 - GST Included)', vendor: '', amount: '', gst: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!form.vendor || !form.amount) return;
        setTransactions([...transactions, { id: Date.now(), ...form, amount: parseFloat(form.amount), gst: parseFloat(form.gst || 0) }]);
        setForm({ date: '', account: 'ANZ Advantage', type: 'Income', category: 'Local Sales (G1 - GST Included)', vendor: '', amount: '', gst: '' });
    };

    const totalG1 = transactions.filter(t => t.category.includes('Local Sales')).reduce((acc, t) => acc + t.amount, 0);
    const totalG2 = transactions.filter(t => t.category.includes('GST Business Expenses')).reduce((acc, t) => acc + t.amount, 0);

    return (
        <div className="max-w-6xl mx-auto p-6">
            <header className="mb-8 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold">Gajjan AI Business & Tax Dashboard</h1>
                <p className="mt-2 text-blue-100">Automated ATO & GST Tracking for Sole Traders</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 font-semibold">Total Local Sales (G1)</h3>
                    <p className="text-3xl font-bold text-green-600">${totalG1.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 font-semibold">Claimable Expenses (G2)</h3>
                    <p className="text-3xl font-bold text-blue-600">${totalG2.toFixed(2)}</p>
                </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border p-2 rounded" required />
                <input type="text" placeholder="Vendor / Client Name" value={form.vendor} onChange={e => setForm({...form, vendor: e.target.value})} className="border p-2 rounded" required />
                <input type="number" placeholder="Total Amount ($)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="border p-2 rounded" required />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">Add Entry Automatically</button>
            </form>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Account</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Vendor / Client</th>
                            <th className="p-4">Amount ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(t => (
                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{t.date}</td>
                                <td className="p-4">{t.account}</td>
                                <td className="p-4">{t.category}</td>
                                <td className="p-4">{t.vendor}</td>
                                <td className="p-4 font-semibold">${t.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
