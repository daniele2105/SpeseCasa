import React from 'react';
import { DollarSign, FileText, Clock, CheckSquare, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Spese Totali', value: '€125,500', change: '+€2,500', icon: DollarSign, color: 'bg-green-600' },
    { title: 'Documenti', value: '8/12', change: 'Mancano 4', icon: FileText, color: 'bg-blue-600' },
    { title: 'Note', value: '15', change: '+3 oggi', icon: Clock, color: 'bg-purple-600' },
    { title: 'Checklist', value: '65%', change: '7/12 completati', icon: CheckSquare, color: 'bg-orange-600' },
  ];

  const recentActivities = [
    { title: 'Aggiunto documento - Certificato energetico', time: '2 ore fa', type: 'document' },
    { title: 'Spesa aggiunta - Notaio (€1,200)', time: '4 ore fa', type: 'expense' },
    { title: 'Nota aggiunta - Chiamata agenzia', time: '1 giorno fa', type: 'note' },
    { title: 'Checklist aggiornata - Mutuo approvato', time: '2 giorni fa', type: 'checklist' },
  ];

  const upcomingTasks = [
    { title: 'Firma preliminare', date: 'Domani', priority: 'high' },
    { title: 'Consegna documenti banca', date: '3 giorni', priority: 'medium' },
    { title: 'Perizia tecnica', date: '5 giorni', priority: 'low' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attività Recenti</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prossime Scadenze</h3>
          <div className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{task.title}</span>
                </div>
                <span className="text-xs text-gray-500">{task.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progresso Acquisto</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Completamento Generale</span>
            <span className="text-sm font-semibold text-gray-900">65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-sm text-gray-600">Documenti Pronti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">€125,500</div>
              <div className="text-sm text-gray-600">Budget Utilizzato</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-gray-600">Giorni Rimanenti</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;