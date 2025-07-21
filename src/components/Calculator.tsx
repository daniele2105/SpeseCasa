import React, { useState } from 'react';
import { Calculator as CalculatorIcon, DollarSign, TrendingUp, PieChart } from 'lucide-react';

const Calculator: React.FC = () => {
  const [housePrice, setHousePrice] = useState(250000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(3.2);
  const [loanTerm, setLoanTerm] = useState(25);
  const [notaryFees, setNotaryFees] = useState(2000);
  const [registrationTax, setRegistrationTax] = useState(2500);
  const [agencyFees, setAgencyFees] = useState(5000);
  const [otherCosts, setOtherCosts] = useState(3000);

  const loanAmount = housePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  
  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;
  const totalCosts = notaryFees + registrationTax + agencyFees + otherCosts;
  const totalInvestment = downPayment + totalCosts;

  const calculations = [
    {
      title: 'Calcolo Mutuo',
      icon: CalculatorIcon,
      color: 'bg-blue-600',
      items: [
        { label: 'Importo Mutuo', value: `€${loanAmount.toLocaleString()}`, description: 'Prezzo casa - Acconto' },
        { label: 'Rata Mensile', value: `€${monthlyPayment.toLocaleString()}`, description: 'Rata fissa mensile' },
        { label: 'Totale Interessi', value: `€${totalInterest.toLocaleString()}`, description: 'Interessi per tutta la durata' },
        { label: 'Totale da Restituire', value: `€${totalPayment.toLocaleString()}`, description: 'Capitale + Interessi' },
      ]
    },
    {
      title: 'Spese Aggiuntive',
      icon: DollarSign,
      color: 'bg-green-600',
      items: [
        { label: 'Spese Notarili', value: `€${notaryFees.toLocaleString()}`, description: 'Onorari notaio e diritti' },
        { label: 'Imposte di Registro', value: `€${registrationTax.toLocaleString()}`, description: 'Tasse sulla compravendita' },
        { label: 'Provvigioni Agenzia', value: `€${agencyFees.toLocaleString()}`, description: 'Commissioni agenzia' },
        { label: 'Altre Spese', value: `€${otherCosts.toLocaleString()}`, description: 'Perizie, assicurazioni, etc.' },
      ]
    },
    {
      title: 'Riepilogo Investimento',
      icon: TrendingUp,
      color: 'bg-purple-600',
      items: [
        { label: 'Acconto Iniziale', value: `€${downPayment.toLocaleString()}`, description: 'Capitale proprio' },
        { label: 'Spese Totali', value: `€${totalCosts.toLocaleString()}`, description: 'Somma spese aggiuntive' },
        { label: 'Investimento Totale', value: `€${totalInvestment.toLocaleString()}`, description: 'Liquido necessario' },
        { label: 'Costo Totale Casa', value: `€${(housePrice + totalCosts + totalInterest).toLocaleString()}`, description: 'Costo finale comprensivo' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Input Parameters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Parametri di Calcolo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Casa</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">€</span>
              <input
                type="number"
                value={housePrice}
                onChange={(e) => setHousePrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acconto</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">€</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasso Interesse</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-3 text-gray-500">%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durata Mutuo</label>
            <div className="relative">
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-3 text-gray-500">anni</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Spese Notarili</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">€</span>
              <input
                type="number"
                value={notaryFees}
                onChange={(e) => setNotaryFees(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imposte Registro</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">€</span>
              <input
                type="number"
                value={registrationTax}
                onChange={(e) => setRegistrationTax(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Provvigioni Agenzia</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">€</span>
              <input
                type="number"
                value={agencyFees}
                onChange={(e) => setAgencyFees(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Altre Spese</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">€</span>
              <input
                type="number"
                value={otherCosts}
                onChange={(e) => setOtherCosts(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Calculation Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {calculations.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`${section.color} p-3 rounded-lg`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  </div>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Riepilogo Visivo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">Composizione Costi</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Prezzo Casa</span>
                </div>
                <span className="text-sm font-medium">{((housePrice / (housePrice + totalCosts + totalInterest)) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Spese Aggiuntive</span>
                </div>
                <span className="text-sm font-medium">{((totalCosts / (housePrice + totalCosts + totalInterest)) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-sm text-gray-600">Interessi Mutuo</span>
                </div>
                <span className="text-sm font-medium">{((totalInterest / (housePrice + totalCosts + totalInterest)) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-4">Confronto Pagamenti</h4>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-800 font-medium">Rata Mensile</div>
                <div className="text-2xl font-bold text-blue-900">€{monthlyPayment.toLocaleString()}</div>
                <div className="text-xs text-blue-600">per {loanTerm} anni</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-800 font-medium">Capitale Proprio</div>
                <div className="text-2xl font-bold text-green-900">€{totalInvestment.toLocaleString()}</div>
                <div className="text-xs text-green-600">acconto + spese</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;