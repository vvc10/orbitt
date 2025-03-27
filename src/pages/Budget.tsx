import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';

const Budget = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BudgetCard
          title="Total Budget"
          amount="$50,000"
          spent="$32,450"
          trend={8.2}
          positive
        />
        <BudgetCard
          title="Monthly Spend"
          amount="$12,450"
          spent="$8,230"
          trend={-2.4}
          positive={false}
        />
        <BudgetCard
          title="Available"
          amount="$17,550"
          spent="35%"
          trend={0}
          neutral
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Campaign Budgets</h2>
          <div className="space-y-4">
            {[
              { name: 'Summer Collection', allocated: 15000, spent: 12000 },
              { name: 'Holiday Special', allocated: 20000, spent: 8000 },
              { name: 'Brand Awareness', allocated: 10000, spent: 9500 }
            ].map((campaign) => (
              <CampaignBudget key={campaign.name} {...campaign} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Budget Alerts</h2>
          <div className="space-y-4">
            <Alert
              message="Summer Collection campaign is nearing budget limit"
              type="warning"
            />
            <Alert
              message="Holiday Special campaign under budget by 60%"
              type="info"
            />
            <Alert
              message="Brand Awareness campaign exceeded daily spend limit"
              type="error"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetCard = ({ 
  title, 
  amount, 
  spent, 
  trend, 
  positive,
  neutral 
}: { 
  title: string;
  amount: string;
  spent: string;
  trend: number;
  positive?: boolean;
  neutral?: boolean;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500">{title}</h3>
        <DollarSign className="text-gray-400" size={20} />
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">{amount}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Spent: {spent}</span>
        {!neutral && (
          <div className={`flex items-center ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
            {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1 text-sm">{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CampaignBudget = ({ 
  name, 
  allocated, 
  spent 
}: {
  name: string;
  allocated: number;
  spent: number;
}) => {
  const percentage = (spent / allocated) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">{name}</span>
        <span className="text-sm text-gray-500">
          ${spent.toLocaleString()} / ${allocated.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div 
          className={`h-2 rounded-full ${
            percentage > 90 ? 'bg-red-500' : 
            percentage > 70 ? 'bg-yellow-500' : 
            'bg-emerald-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const Alert = ({ 
  message, 
  type 
}: {
  message: string;
  type: 'warning' | 'error' | 'info';
}) => {
  const colors = {
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  };

  return (
    <div className={`flex items-center p-4 border rounded-lg ${colors[type]}`}>
      <AlertCircle className="mr-3" size={20} />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Budget;