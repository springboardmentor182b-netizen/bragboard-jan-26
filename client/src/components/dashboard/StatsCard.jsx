import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, trend, trendValue, icon: Icon, color }) => {
    const isPositive = trend === 'up';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-secondary-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-secondary-900 mb-2">{value}</h3>

                {trendValue && (
                    <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'} inline-flex px-2 py-1 rounded-full`}>
                        {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                        {trendValue}
                    </div>
                )}
            </div>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color || 'bg-primary-50 text-primary-600'}`}>
                {Icon && <Icon size={24} />}
            </div>
        </div>
    );
};

export default StatsCard;
