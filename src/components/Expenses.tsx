import React, { useState } from 'react';
import { Plus, Edit2, Trash2, DollarSign, Calendar, Tag } from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paid: boolean;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', description: 'Acconto agenzia immobiliare', amount: 3000, category: 'Agenzia', date: '2024-01-15', paid: true },
    { id: '2', description: 'Spese notarili', amount: 1200, category: 'Notaio', date: '2024-01-20', paid: true },
    { id: '3', description: 'Perizia tecnica', amount: 400, category: 'Perizia', date: '2024-01-25', paid: false },
    { id: '4', description: 'Spese istruttoria mutuo', amount: 500, category: 'Mutuo', date: '2024-02-01', paid: false },
    { id: '5', description: 'Assicurazione casa', amount: 800, category: 'Assicurazione', date: '2024-02-05', paid: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const categories = ['Agenzia', 'Notaio', 'Mutuo', 'Perizia', 'Assicurazione', 'Ristrutturazione', 'Altro'];

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const paidExpenses = expenses.filter(expense => expense.paid).reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = totalExpenses - paidExpenses;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newExpense: Expense = {
      id: editingExpense?.id || Date.now().toString(),
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category') as string,
      date: formData.get('date') as string,
      paid: formData.get('paid') === 'on',
    };

    if (editingExpense) {
      setExpenses(expenses.map(exp => exp.id === editingExpense.id ? newExpense : exp));
    } else {
      setExpenses([...expenses, newExpense]);
    }

    setShowForm(false);
    setEditingExpense(null);
    form.reset();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Spese</p>
              <p className="text-2xl font-bold text-gray-900">€{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Già Pagate</p>
              <p className="text-2xl font-bold text-green-600">€{paidExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Da Pagare</p>
              <p className="text-2xl font-bold text-orange-600">€{pendingExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-orange-600 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Lista Spese</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Aggiungi Spesa</span>
        </button>
      </div>

      {/* Expense Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingExpense ? 'Modifica Spesa' : 'Nuova Spesa'}
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
              <input
                type="text"
                name="description"
                defaultValue={editingExpense?.description}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Importo (€)</label>
              <input
                type="number"
                name="amount"
                defaultValue={editingExpense?.amount}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="category"
                defaultValue={editingExpense?.category}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                name="date"
                defaultValue={editingExpense?.date}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="paid"
                id="paid"
                defaultChecked={editingExpense?.paid}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="paid" className="text-sm font-medium text-gray-700">Già pagata</label>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingExpense ? 'Aggiorna' : 'Aggiungi'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrizione</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.paid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {expense.paid ? 'Pagata' : 'Da Pagare'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;