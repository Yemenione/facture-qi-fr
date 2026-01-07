
export default function MentionsLegalesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Mentions Légales</h1>

            <section>
                <h2 className="text-xl font-semibold mb-2">1. Éditeur du site</h2>
                <p>
                    Le site Factuer FR est édité par : <br />
                    <strong>SAS FACTUER FR</strong> <br />
                    Capital social de 1 000 € <br />
                    RCS Paris B 123 456 789 <br />
                    Siège social : 10 Rue de la Paix, 75001 Paris, France <br />
                    TVA Intracommunautaire : FR 12 123456789 <br />
                    Email : contact@factuer.fr
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">2. Directeur de la publication</h2>
                <p>M. Jean Dupont, en qualité de Président.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">3. Hébergement</h2>
                <p>
                    Le site est hébergé par : <br />
                    <strong>Vercel Inc.</strong> <br />
                    340 S Lemon Ave #4133 Walnut, CA 91789, USA <br />
                    Site web : https://vercel.com
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">4. Propriété intellectuelle</h2>
                <p>
                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
                    Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
            </section>
        </div>
    )
}
