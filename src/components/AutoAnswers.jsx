import React, { useState } from 'react';
import { ClipboardCopy } from 'lucide-react';
import { useAutoAnswers } from '../hooks/firebase.hooks';
import { LoadingSpinner } from './loading';

const AutoAnswers = () => {
    const { data: autoAnswersData, loading, error } = useAutoAnswers();
    const operators = ["Thomas", "David", "Emma", "Eric", "Nora", "Trinity", "Kenny"];
    const [selectedOperator, setSelectedOperator] = useState("Thomas");

    if (loading) return <LoadingSpinner />;
    if (error) console.error('Error loading auto answers:', error);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => alert('Текст скопирован!'));
    };

    return (
        <div className="fade-in">
            <div className="mb-8">
                <label htmlFor="operator-select" className="block text-lg font-semibold text-premium-text mb-4 font-display">
                    Select Operator for Template
                </label>
                <select
                    id="operator-select"
                    value={selectedOperator}
                    onChange={e => setSelectedOperator(e.target.value)}
                    className="premium-input max-w-xs"
                >
                    {operators.map(op => <option key={op} value={op}>{op}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {autoAnswersData.map((answer, index) => {
                    const message = answer.Message.replace(/{operatorName}/g, selectedOperator);
                    return (
                        <div key={index} className="premium-card p-6 flex flex-col slide-up">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-premium-gold to-premium-gold-light flex items-center justify-center shadow-premium">
                                    <span className="text-lg">💬</span>
                                </div>
                                <h4 className="font-bold text-premium-text font-display text-lg">{answer['Service type']}</h4>
                            </div>
                            <textarea
                                readOnly
                                value={message}
                                className="premium-input text-sm flex-grow resize-none h-64 mb-4"
                            />
                            <button
                                onClick={() => copyToClipboard(message)}
                                className="premium-button flex items-center justify-center gap-3 w-full text-sm"
                            >
                                <ClipboardCopy size={18} />
                                <span>Copy Message</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AutoAnswers;