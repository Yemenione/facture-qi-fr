'use client';

export default function ProductsPage() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Produits & Services</h1>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    + Nouveau Produit
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {/* Placeholder for Product List */}
                    <li className="px-6 py-4 text-center text-gray-500">
                        Aucun produit enregistré.
                    </li>
                </ul>
            </div>
        </div>
    );
}
