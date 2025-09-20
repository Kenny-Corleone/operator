import React, { useState } from 'react';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import Dashboard from './components/Dashboard';
import AutoAnswers from './components/AutoAnswers';
import ServiceInfo from './components/ServiceInfo';
import PropertyManagement from './components/PropertyManagement';
import OutstandingPayments from './components/OutstandingPayments';
import AdminFiles from './components/AdminFiles';
import Browser from './components/Browser';
import AppLayout from './components/AppLayout';

// --- ОСНОВНЫЕ КОМПОНЕНТЫ СТРАНИЦ ---

const OperatorPage = ({ onSwitchRole }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const tabs = {
        dashboard: <Dashboard />,
        answers: <AutoAnswers />,
        service_info: <ServiceInfo />,
        pm_list: <PropertyManagement />,
        browser: <Browser />
    };
    return (
        <AppLayout role="Оператор" onSwitchRole={onSwitchRole} activeTab={activeTab} setActiveTab={setActiveTab} tabs={
            {'dashboard': 'Dashboard', 'answers': 'Automatic Answers', 'service_info': 'Service Info & Prices', 'pm_list': 'Property Management', 'browser': 'Browser'}
        }>
            {tabs[activeTab]}
        </AppLayout>
    );
};

const ManagementPage = ({ onSwitchRole }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const tabs = {
        dashboard: <Dashboard />,
        pm_list: <PropertyManagement />,
        payments: <OutstandingPayments />,
        files: <AdminFiles />,
        browser: <Browser />
    };
    return (
        <AppLayout role="Менеджер" onSwitchRole={onSwitchRole} activeTab={activeTab} setActiveTab={setActiveTab} tabs={
              {'dashboard': 'Dashboard', 'pm_list': 'Property Management', 'payments': 'Outstanding Payments', 'files': 'Administrative Files', 'browser': 'Browser'}
        }>
            {tabs[activeTab]}
        </AppLayout>
    );
};


export default function App() {
    const [role, setRole] = useState(null);

    if (!role) {
        return <RoleSelectionScreen onSelectRole={setRole} />;
    }

    return (
        <div className="min-h-screen premium-bg p-4 md:p-8 fade-in">
            {role === 'operator' && <OperatorPage onSwitchRole={setRole} />}
            {role === 'management' && <ManagementPage onSwitchRole={setRole} />}
        </div>
    );
}