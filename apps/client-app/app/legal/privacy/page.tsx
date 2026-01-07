
export default function PrivacyPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Politique de Confidentialité</h1>

            <section>
                <h2 className="text-xl font-semibold mb-2">1. Collecte des données</h2>
                <p>Nous collectons les données nécessaires au bon fonctionnement du service (email, nom, données de facturation).</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">2. Utilisation</h2>
                <p>Vos données ne sont jamais vendues à des tiers.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">3. Vos droits</h2>
                <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.</p>
            </section>
        </div>
    )
}
