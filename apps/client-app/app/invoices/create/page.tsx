'use client';

import { useState } from 'react';

export default function CreateInvoicePage() {
    const [items, setItems] = useState([
        { description: '', quantity: 1, unitPrice: 0, vatRate: 20 }
    ]);

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0, vatRate: 20 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => {
            const ht = item.quantity * item.unitPrice;
            const tva = ht * (item.vatRate / 100);
            return acc + ht + tva;
        }, 0);
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Nouvelle Facture</h1>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Client</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sélectionner un client</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                            <option>Choisir...</option>
                            {/* Clients will be loaded here */}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Articles</h2>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                    <thead>
                        <tr>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Qté</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Prix Unit.</th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">TVA %</th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="py-2">
                                    <input
                                        type="text"
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1 border"
                                        value={item.description}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].description = e.target.value;
                                            setItems(newItems);
                                        }}
                                    />
                                </td>
                                <td className="py-2">
                                    <input
                                        type="number"
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1 border"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].quantity = Number(e.target.value);
                                            setItems(newItems);
                                        }}
                                    />
                                </td>
                                <td className="py-2">
                                    <input
                                        type="number"
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1 border"
                                        value={item.unitPrice}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].unitPrice = Number(e.target.value);
                                            setItems(newItems);
                                        }}
                                    />
                                </td>
                                <td className="py-2">
                                    <input
                                        type="number"
                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1 border"
                                        value={item.vatRate}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].vatRate = Number(e.target.value);
                                            setItems(newItems);
                                        }}
                                    />
                                </td>
                                <td className="py-2">
                                    <button onClick={() => removeItem(index)} className="text-red-600 hover:text-red-900 font-bold">X</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={addItem} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">+ Ajouter une ligne</button>
            </div>

            <div className="flex justify-end bg-white shadow rounded-lg p-6">
                <div className="w-1/3">
                    <div className="flex justify-between py-2">
                        <span className="font-medium text-gray-500">Total TTC</span>
                        <span className="text-2xl font-bold">{calculateTotal().toFixed(2)} €</span>
                    </div>
                    <button className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Valider la Facture
                    </button>
                </div>
            </div>
        </div>
    );
}
