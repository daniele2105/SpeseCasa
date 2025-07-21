import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, Search, Filter } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  time: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: '1', 
      title: 'Chiamata agenzia immobiliare', 
      content: 'Discusso prezzo finale e condizioni di vendita. Possibile sconto di €5000 se chiudiamo entro fine mese.',
      category: 'Trattative',
      priority: 'high',
      date: '2024-01-15',
      time: '14:30'
    },
    { 
      id: '2', 
      title: 'Incontro con notaio', 
      content: 'Revisione del contratto preliminare. Tutto ok, firma prevista per venerdì prossimo.',
      category: 'Legale',
      priority: 'medium',
      date: '2024-01-18',
      time: '10:00'
    },
    { 
      id: '3', 
      title: 'Perizia tecnica', 
      content: 'Perito ha confermato buone condizioni dell\'immobile. Piccoli lavori di manutenzione da preventivare.',
      category: 'Tecnico',
      priority: 'low',
      date: '2024-01-20',
      time: '16:15'
    },
    { 
      id: '4', 
      title: 'Appuntamento banca', 
      content: 'Mutuo pre-approvato. Tasso fisso 3.2% per 25 anni. Servono ulteriori documenti per finalizzare.',
      category: 'Finanziario',
      priority: 'high',
      date: '2024-01-22',
      time: '09:30'
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [selectedPriority, setSelectedPriority] = useState('Tutti');

  const categories = ['Tutti', 'Trattative', 'Legale', 'Tecnico', 'Finanziario', 'Personale', 'Altro'];
  const priorities = ['Tutti', 'low', 'medium', 'high'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tutti' || note.category === selectedCategory;
    const matchesPriority = selectedPriority === 'Tutti' || note.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Bassa';
      default: return priority;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const now = new Date();
    const newNote: Note = {
      id: editingNote?.id || Date.now().toString(),
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    };

    if (editingNote) {
      setNotes(notes.map(note => note.id === editingNote.id ? newNote : note));
    } else {
      setNotes([newNote, ...notes]);
    }

    setShowForm(false);
    setEditingNote(null);
    form.reset();
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca nelle note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Tutti">Tutte le priorità</option>
            {priorities.slice(1).map(priority => (
              <option key={priority} value={priority}>{getPriorityLabel(priority)}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuova Nota</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Note Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingNote ? 'Modifica Nota' : 'Nuova Nota'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titolo</label>
              <input
                type="text"
                name="title"
                defaultValue={editingNote?.title}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenuto</label>
              <textarea
                name="content"
                rows={4}
                defaultValue={editingNote?.content}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  name="category"
                  defaultValue={editingNote?.category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorità</label>
                <select
                  name="priority"
                  defaultValue={editingNote?.priority}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="low">Bassa</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingNote ? 'Aggiorna' : 'Aggiungi'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingNote(null);
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {note.category}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(note.priority)}`}>
                  {getPriorityLabel(note.priority)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(note.date).toLocaleDateString('it-IT')} - {note.time}</span>
                </div>
                <button
                  onClick={() => handleEdit(note)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{note.content}</p>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessuna nota trovata</h3>
          <p className="text-gray-500">Inizia creando la tua prima nota o modifica i filtri di ricerca.</p>
        </div>
      )}
    </div>
  );
};

export default Notes;