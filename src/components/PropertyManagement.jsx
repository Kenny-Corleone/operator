import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { usePropertyManagement } from '../hooks/firebase.hooks';
import { LoadingSpinner } from './loading';

const PropertyManagement = () => {
    const { data: list, loading, error, addCompany, updateCompany, deleteCompany } = usePropertyManagement();
    const [showModal, setShowModal] = useState(false);

    if (loading) return <LoadingSpinner />;
    if (error) console.error('Error loading property management:', error);

    const handleAddCompany = async (company) => {
        try {
            await addCompany(company);
            setShowModal(false);
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    const handleUpdateCompany = async (id, updates) => {
        try {
            await updateCompany(id, updates);
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };

    const handleDeleteCompany = async (id) => {
        try {
            await deleteCompany(id);
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const AddModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Добавить новую компанию</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const company = Object.fromEntries(formData);
                    handleAddCompany(company);
                }}>
                    <input name="Company" placeholder="Company" className="w-full p-2 mb-2 border rounded" required />
                    <input name="Phone" placeholder="Phone" className="w-full p-2 mb-2 border rounded" required />
                    <input name="Invoicing Email" placeholder="Invoicing Email" className="w-full p-2 mb-2 border rounded" />
                    <input name="Representative" placeholder="Representative" className="w-full p-2 mb-2 border rounded" />
                    <input name="Email" placeholder="Email" className="w-full p-2 mb-2 border rounded" />
                    <input name="Phone 2" placeholder="Phone 2" className="w-full p-2 mb-2 border rounded" />
                    <input name="Discount" placeholder="Discount" className="w-full p-2 mb-2 border rounded" />
                    <input name="Note" placeholder="Note" className="w-full p-2 mb-4 border rounded" />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Добавить</button>
                    <button type="button" onClick={() => setShowModal(false)} className="text-gray-600">Отмена</button>
                </form>
            </div>
        </div>
    );

    return (
        <div>
            <button onClick={() => setShowModal(true)} className="bg-green-500 text-white px-4 py-2 rounded-md mb-4 flex items-center gap-2">
                <PlusCircle size={18} /> Добавить
            </button>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full table-auto text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            {list && list.length > 0 && Object.keys(list[0]).filter(key => key !== 'id').map(h => <th key={h} className="p-3 font-semibold text-left">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {list && list.map((item) => (
                            <tr key={item.id}>
                                {Object.entries(item).filter(([key]) => key !== 'id').map(([key, val]) => (
                                    <td key={key} className="p-3" contentEditable
                                        onBlur={(e) => handleUpdateCompany(item.id, { [key]: e.currentTarget.textContent })}
                                        suppressContentEditableWarning={true}>
                                        {val}
                                    </td>
                                ))}
                                <td className="p-3">
                                    <button onClick={() => handleDeleteCompany(item.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && <AddModal />}
        </div>
    );
};

export default PropertyManagement;