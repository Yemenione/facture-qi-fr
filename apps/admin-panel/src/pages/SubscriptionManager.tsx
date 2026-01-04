import { Link } from "react-router-dom";

export default function SubscriptionManager() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Gestion des Abonnements</h1>
            <p className="text-gray-500 mb-4">Fonctionnalité à venir...</p>
            <Link to="/" className="text-blue-600 hover:underline">Retour au Dashboard</Link>
        </div>
    );
}
