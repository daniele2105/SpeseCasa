import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  order: number;
}

const Checklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', title: 'Ricerca immobile', description: 'Trovare la casa perfetta', completed: true, category: 'Ricerca', priority: 'high', order: 1 },
    { id: '2', title: 'Valutazione immobile', description: 'Perizia tecnica e valutazione di mercato', completed: true, category: 'Valutazione', priority: 'high', order: 2 },
    { id: '3', title: 'Trattativa prezzo', description: 'Negoziare il prezzo finale con il venditore', completed: true, category: 'Trattative', priority: 'high', order: 3 },
    { id: '4', title: 'Richiesta mutuo', description: 'Inoltrare domanda di mutuo alla banca', completed: true, category: 'Finanziario', priority: 'high', order: 4 },
    { id: '5', title: 'Approvazione mutuo', description: 'Attendere approvazione della banca', completed: true, category: 'Finanziario', priority: 'high', order: 5 },
    { id: '6', title: 'Raccolta documenti', description: 'Preparare tutta la documentazione necessaria', completed: false, category: 'Documenti', priority: 'medium', order: 6, dueDate: '2024-02-10' },
    { id: '7', title: 'Contratto preliminare', description: 'Firma del compromesso con versamento caparra', completed: false, category: 'Legale', priority: 'high', order: 7, dueDate: '2024-02-15' },
    { id: '8', title: 'Controlli finali', description: 'Verifiche tecniche e amministrative finali', completed: false, category: 'Verifiche', priority: 'medium', order: 8, dueDate: '2024-02-20' },
    { id: '9', title: 'Rogito notarile', description: 'Firma definitiva dal notaio', completed: false, category: 'Legale', priority: 'high', order: 9, dueDate: '2024-02-25' },
    { id: '10', title: 'Trasferimento proprietà', description: 'Registrazione atto e trasferimento chiavi', completed: false, category: 'Finale', priority: 'high', order: 10, dueDate: '2024-02-25' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');

  const categories = ['Tutti', 'Ricerca', 'Valutazione', 'Trattative', 'Finanziario', 'Documenti', 'Legale', 'Verifiche', 'Finale'];

  const filteredItems = selectedCategory === 'Tutti' 
    ? items.sort((a, b) => a.order - b.order)
    : items.filter(item => item.category === selectedCategory).sort((a, b) => a.order - b.order);

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleToggle = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const maxOrder = Math.max(...items.map(item => item.order), 0);
    const newItem: ChecklistItem = {
      id: editingItem?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      completed: editingItem?.completed || false,
      category: formData.get('category') as string,
      dueDate: formData.get('dueDate') as string || undefined,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      order: editingItem?.order || maxOrder + 1,
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setItems([...items, newItem]);
    }

    setShowForm(false);
    setEditingItem(null);
    form.reset();
  };

  const handleEdit = (item: ChecklistItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progresso Generale</h3>
          <span className="text-sm font-medium text-gray-600">{completedCount}/{totalCount} completati</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{completionPercentage}%</div>
          <div className="text-sm text-gray-600">Completato</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Checklist Acquisto</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Aggiungi Elemento</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingItem ? 'Modifica Elemento' : 'Nuovo Elemento'}
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
              <input
                type="text"
                name="title"
                defaultValue={editingItem?.title}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="category"
                defaultValue={editingItem?.category}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={editingItem?.description}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
              <select
                name="priority"
                defaultValue={editingItem?.priority}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="low">Bassa</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza (opzionale)</label>
              <input
                type="date"
                name="dueDate"
                defaultValue={editingItem?.dueDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingItem ? 'Aggiorna' : 'Aggiungi'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div key={item.id} className={`bg-white rounded-lg shadow-sm p-6 border-l-4 hover:shadow-md transition-shadow ${
            item.completed ? 'border-green-500 bg-green-50' : 
            isOverdue(item.dueDate) ? 'border-red-500 bg-red-50' : 'border-blue-500'
          }`}>
            <div className="flex items-start space-x-4">
              <button
                onClick={() => handleToggle(item.id)}
                className={`mt-1 transition-colors ${
                  item.completed ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.completed ? (
                  <CheckSquare className="w-6 h-6" />
                ) : (
                  <Square className="w-6 h-6" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-lg font-semibold ${
                    item.completed ? 'text-green-800 line-through' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {item.dueDate && (
                      <div className={`flex items-center space-x-1 text-sm ${
                        isOverdue(item.dueDate) ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.dueDate).toLocaleDateString('it-IT')}</span>
                        {isOverdue(item.dueDate) && <AlertCircle className="w-4 h-4" />}
                      </div>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      item.priority === 'high' ? 'bg-red-500' :
                      item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className={`text-sm ${
                  item.completed ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun elemento trovato</h3>
          <p className="text-gray-500">Inizia aggiungendo elementi alla tua checklist o cambia la categoria.</p>
        </div>
      )}
    </div>
  );
};

export default Checklist;