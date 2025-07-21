import React, { useState } from 'react';
import { Plus, FileText, Download, Upload, Check, X, Calendar } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'uploaded' | 'verified';
  dueDate?: string;
  uploadDate?: string;
  required: boolean;
}

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Documento di identità', category: 'Personali', status: 'verified', uploadDate: '2024-01-10', required: true },
    { id: '2', name: 'Codice fiscale', category: 'Personali', status: 'verified', uploadDate: '2024-01-10', required: true },
    { id: '3', name: 'Busta paga', category: 'Reddito', status: 'uploaded', uploadDate: '2024-01-12', required: true },
    { id: '4', name: 'Certificato di residenza', category: 'Personali', status: 'verified', uploadDate: '2024-01-15', required: true },
    { id: '5', name: 'Estratto conto bancario', category: 'Finanziario', status: 'uploaded', uploadDate: '2024-01-18', required: true },
    { id: '6', name: 'Certificato energetico', category: 'Immobile', status: 'pending', dueDate: '2024-02-15', required: true },
    { id: '7', name: 'Visura catastale', category: 'Immobile', status: 'pending', dueDate: '2024-02-10', required: true },
    { id: '8', name: 'Planimetria', category: 'Immobile', status: 'pending', dueDate: '2024-02-20', required: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');

  const categories = ['Tutti', 'Personali', 'Reddito', 'Finanziario', 'Immobile', 'Mutuo', 'Notaio'];

  const filteredDocuments = selectedCategory === 'Tutti' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <Check className="w-4 h-4" />;
      case 'uploaded': return <FileText className="w-4 h-4" />;
      case 'pending': return <Upload className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Verificato';
      case 'uploaded': return 'Caricato';
      case 'pending': return 'In Attesa';
      default: return status;
    }
  };

  const handleStatusChange = (id: string, newStatus: 'pending' | 'uploaded' | 'verified') => {
    setDocuments(documents.map(doc => 
      doc.id === id 
        ? { ...doc, status: newStatus, uploadDate: newStatus !== 'pending' ? new Date().toISOString().split('T')[0] : undefined }
        : doc
    ));
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const newDocument: Document = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      status: 'pending',
      dueDate: formData.get('dueDate') as string || undefined,
      required: formData.get('required') === 'on',
    };

    setDocuments([...documents, newDocument]);
    setShowForm(false);
    form.reset();
  };

  const completedCount = documents.filter(doc => doc.status === 'verified').length;
  const totalCount = documents.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progresso Documenti</h3>
          <span className="text-sm font-medium text-gray-600">{completedCount}/{totalCount} completati</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{documents.filter(doc => doc.status === 'verified').length}</div>
            <div className="text-sm text-gray-600">Verificati</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{documents.filter(doc => doc.status === 'uploaded').length}</div>
            <div className="text-sm text-gray-600">Caricati</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{documents.filter(doc => doc.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">In Attesa</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Documenti</h3>
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
          <span>Aggiungi Documento</span>
        </button>
      </div>

      {/* Add Document Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Nuovo Documento</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Documento</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scadenza (opzionale)</label>
              <input
                type="date"
                name="dueDate"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="required"
                id="required"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="required" className="text-sm font-medium text-gray-700">Documento obbligatorio</label>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aggiungi
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">{document.category}</span>
              </div>
              {document.required && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  Obbligatorio
                </span>
              )}
            </div>

            <h4 className="text-lg font-semibold text-gray-900 mb-3">{document.name}</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stato:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                  {getStatusIcon(document.status)}
                  <span className="ml-1">{getStatusLabel(document.status)}</span>
                </span>
              </div>

              {document.dueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scadenza:</span>
                  <span className="text-sm text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(document.dueDate).toLocaleDateString('it-IT')}
                  </span>
                </div>
              )}

              {document.uploadDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Caricato:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(document.uploadDate).toLocaleDateString('it-IT')}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              {document.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(document.id, 'uploaded')}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Carica
                </button>
              )}
              {document.status === 'uploaded' && (
                <button
                  onClick={() => handleStatusChange(document.id, 'verified')}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Verifica
                </button>
              )}
              {document.status !== 'pending' && (
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center">
                  <Download className="w-4 h-4 mr-1" />
                  Scarica
                </button>
              )}
              <button
                onClick={() => handleDelete(document.id)}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center"
              >
                <X className="w-4 h-4 mr-1" />
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;