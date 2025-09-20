import React, { useState, useMemo } from 'react';
import { useOutstandingPayments } from '../hooks/firebase.hooks';
import { LoadingSpinner } from './loading';

const OutstandingPayments = () => {
    const { data: payments, loading, error, toggleStatus } = useOutstandingPayments();
    const [showArchived, setShowArchived] = useState(false);

    if (loading) return <LoadingSpinner />;
    if (error) console.error('Error loading payments:', error);

    const totalDue = useMemo(() => {
        if (!payments) return 0;
        return payments
            .filter(p => p.status === 'OUTSTANDING')
            .reduce((sum, p) => sum + parseFloat(p['Amount due']), 0)
            .toFixed(2);
    }, [payments]);

    const filteredPayments = showArchived ? payments : payments.filter(p => p.status !== 'PAID');

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setShowArchived(!showArchived)} className="bg-gray-200 px-4 py-2 rounded-md">
                    {showArchived ? 'Скрыть оплаченные' : 'Показать все (включая оплаченные)'}
                </button>
                <div className="text-xl font-bold text-red-600">К оплате: ${totalDue}</div>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full table-auto text-sm">
                    <thead><tr className="bg-gray-200">
                        <th className="p-3">Customer</th><th className="p-3">Amount</th><th className="p-3">Date</th><th className="p-3">Status</th>
                    </tr></thead>
                    <tbody>
                        {filteredPayments && filteredPayments.map(p => (
                            <tr key={p.id}>
                                <td className="p-3">{p['Customer name']}</td>
                                <td className="p-3">${p['Amount due']}</td>
                                <td className="p-3">{p['Invoice date']}</td>
                                <td className="p-3">
                                    <button onClick={() => toggleStatus(p.id)}
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.status}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OutstandingPayments;