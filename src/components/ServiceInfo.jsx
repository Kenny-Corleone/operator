import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { useServiceInfo, useServicesPrices } from '../hooks/firebase.hooks';
import { LoadingSpinner } from './loading';

const ServiceInfo = () => {
    const [selectedService, setSelectedService] = useState(null);
    const { data: serviceInfoData, loading: loadingInfo, error: errorInfo } = useServiceInfo();
    const { data: servicesPricesData, loading: loadingPrices, error: errorPrices } = useServicesPrices();

    const serviceRecommendationsData = [
        {"Service":"Dryer Vent Cleaning","Recommendation":"Neglecting the cleaning of your dryer vent can lead to serious consequences. Lint buildup can overheat and ignite, increasing the risk of a fire hazard. A clogged vent also affects your daily life, leading to increased energy usage and longer drying times."},
        {"Service":"Air Ducts Cleaning","Recommendation":"Dirty air ducts can spread dust, allergens, and other contaminants throughout your home, leading to poor indoor air quality. This can worsen allergy and asthma symptoms and cause respiratory irritation."},
        {"Service":"Chimney Sweep","Recommendation":"The buildup of creosote can ignite and cause a chimney fire, which can spread to the rest of the house. Also, a dirty chimney can release carbon monoxide into your home, which is a poisonous gas."}
    ];

    const combinedServiceData = useMemo(() => {
        if (!serviceInfoData || !servicesPricesData) return [];
        return serviceInfoData.map(info => {
            const priceInfo = servicesPricesData.find(p => p.Service.toLowerCase().includes(info.SERVICE.split(' ')[0].toLowerCase()));
            const recommendation = serviceRecommendationsData.find(r => r.Service.toLowerCase().includes(info.SERVICE.split(' ')[0].toLowerCase()));
            return {
                ...info,
                Price: priceInfo ? priceInfo.Price : 'N/A',
                Note: priceInfo ? priceInfo.Note : '',
                Recommendation: recommendation ? recommendation.Recommendation : 'Нет рекомендаций'
            };
        });
    }, [serviceInfoData, servicesPricesData]);

    if (loadingInfo || loadingPrices) return <LoadingSpinner />;
    if (errorInfo) console.error('Error loading service info:', errorInfo);
    if (errorPrices) console.error('Error loading services prices:', errorPrices);

    const ServiceModal = ({ service, onClose }) => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
            <div className="glass-card p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-premium-gold to-premium-gold-light flex items-center justify-center shadow-premium">
                            <span className="text-xl">🔧</span>
                        </div>
                        <h3 className="text-3xl font-bold text-premium-text font-display">{service.SERVICE}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-premium-text transition-all duration-200"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-premium-gold/20 to-premium-gold/10 rounded-xl border border-premium-gold/20">
                        <strong className="text-premium-text font-semibold text-lg">Price:</strong>
                        <span className="text-premium-text ml-2">{service.Price}</span>
                        {service.Note && <span className="text-premium-text-secondary ml-2">({service.Note})</span>}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <strong className="text-premium-text font-semibold text-lg block mb-2">When Needed:</strong>
                            <p className="text-premium-text-secondary whitespace-pre-wrap pl-4 leading-relaxed">{service["WHEN IT NEEDS"]}</p>
                        </div>
                        <div>
                            <strong className="text-premium-text font-semibold text-lg block mb-2">Frequency:</strong>
                            <p className="text-premium-text-secondary whitespace-pre-wrap pl-4 leading-relaxed">{service["SERVICE FREQUENCY"]}</p>
                        </div>
                        <div>
                            <strong className="text-premium-text font-semibold text-lg block mb-2">Methods:</strong>
                            <p className="text-premium-text-secondary whitespace-pre-wrap pl-4 leading-relaxed">{service["SERVICE METHODS"]}</p>
                        </div>
                        <div>
                            <strong className="text-premium-text font-semibold text-lg block mb-2">Stages:</strong>
                            <p className="text-premium-text-secondary whitespace-pre-wrap pl-4 leading-relaxed">{service["SERVICE STAGES"]}</p>
                        </div>
                        <div>
                            <strong className="text-premium-text font-semibold text-lg block mb-2">Duration:</strong>
                            <p className="text-premium-text-secondary pl-4">{service["SERVICE DURATION"]}</p>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                        <strong className="text-premium-text font-semibold text-lg block mb-2">Recommendations:</strong>
                        <p className="text-premium-text-secondary whitespace-pre-wrap pl-4 leading-relaxed">{service.Recommendation}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {combinedServiceData.map((service, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedService(service)}
                        className="premium-card p-6 hover:scale-105 transition-all duration-300 group cursor-pointer h-auto"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-premium-blue to-premium-purple flex items-center justify-center shadow-premium group-hover:animate-bounce-subtle">
                                <span className="text-lg">🔧</span>
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-premium-text font-display text-sm leading-tight">{service.SERVICE}</h4>
                                <p className="text-premium-gold font-semibold text-xs mt-1">{service.Price}</p>
                            </div>
                        </div>
                        <div className="w-full bg-gradient-to-r from-premium-gold/20 to-transparent h-1 rounded-full"></div>
                    </button>
                ))}
            </div>
            {selectedService && <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />}
        </div>
    );
};

export default ServiceInfo;