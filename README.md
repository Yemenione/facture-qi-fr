# SaaS Facturation France (2026 Compliant)

Plateforme de facturation multi-tenant pour le marché français, conforme Factur-X et Loi Anti-Fraude TVA.

## Architecture

*   **Monorepo** : TurboRepo
*   **Backend** : NestJS + Prisma + PostgreSQL
*   **Client App** : Next.js 14 + Shadcn/UI
*   **Admin Panel** : Vite + React

## Pré-requis

*   Node.js 18+
*   Docker & Docker Compose

## Installation & Démarrage

1.  **Installer les dépendances**
    ```bash
    npm install
    ```

2.  **Lancer l'infrastructure (Base de données)**
    ```bash
    docker compose up -d db redis
    ```

3.  **Initialiser la Base de Données**
    ```bash
    npx turbo run db:push
    ```

4.  **Lancer le projet en mode développement** (API + Client + Admin + Traefik)
    ```bash
    docker compose up -d traefik
    npx turbo run dev
    ```

## Accès

*   **Client Dashboard** : [http://localhost:3000](http://localhost:3000)
*   **Admin Dashboard** : [http://localhost:5173](http://localhost:5173)
*   **API** : [http://localhost:3001](http://localhost:3001)

## Fonctionnalités Clés Implémentées

*   [x] **Factur-X** : Génération PDF/A-3 + XML CII.
*   [x] **Anti-Fraude** : Chaînage de hash (SHA256) sur les factures validées.
*   [x] **Multi-Tenancy** : Isolation des données par `companyId`.
*   [x] **Super Admin** : Impersonation sécurisée des comptes clients.
