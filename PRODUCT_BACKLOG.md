# iVote — Product Backlog

> **Projet :** plateforme de vote électronique universitaire  
> **Backend :** Django, Django REST Framework, PostgreSQL  
> **Frontend :** React  
> **Communication :** API REST, HTTPS, authentification JWT  
> **Statut :** backlog initial du MVP — à valider avec l'équipe

## 1. Objectif du produit

iVote permet aux administrateurs d'organiser des scrutins universitaires et aux étudiants éligibles de consulter les scrutins, les candidatures, de voter et d'accéder aux résultats publiés, dans le respect des règles de confidentialité et d'intégrité du vote.

## 2. Conventions

- **P0 — Critique :** indispensable au MVP.
- **P1 — Important :** fonctionnalité utile, après les exigences critiques.
- **P2 — Optionnel :** amélioration envisageable après le MVP.
- **Équipes :** Backend, Frontend, Fullstack.
- **Statuts suggérés :** Backlog, Todo, In Progress, In Review, Done.
- **Définition de terminé :** critères d'acceptation validés, tests pertinents passés, revue de code effectuée et documentation API mise à jour si nécessaire.

## 3. Vue d'ensemble

| Epic | Fonctionnalité | Tickets |
| --- | --- | --- |
| EPIC 1 | Architecture et configuration | IV-01 à IV-05 |
| EPIC 2 | Authentification et permissions | IV-06 à IV-09 |
| EPIC 3 | Gestion des scrutins | IV-10 à IV-13 |
| EPIC 4 | Candidatures | IV-14 à IV-16 |
| EPIC 5 | Vote électronique | IV-17 à IV-20 |
| EPIC 6 | Résultats et statistiques | IV-21 à IV-22 |
| EPIC 7 | Documentation et qualité | IV-23 |

## 4. Product Backlog détaillé

### EPIC 1 — Architecture et configuration

| ID | User Story / Tâche | Équipe | Priorité | Sprint proposé |
| --- | --- | --- | --- | --- |
| IV-01 | Initialiser et configurer Django et Django REST Framework | Backend | P0 | 1 |
| IV-02 | Configurer PostgreSQL et les migrations | Backend | P0 | 1 |
| IV-03 | Définir les modèles de données et leurs relations | Backend | P0 | 1 |
| IV-04 | Initialiser React et le routage | Frontend | P0 | 1 |
| IV-05 | Configurer le client HTTP, les environnements et CORS | Fullstack | P0 | 1 |

**Livrable :** architecture de base et communication frontend–backend opérationnelles.

### EPIC 2 — Authentification et permissions

| ID | User Story | Équipe | Priorité | Sprint proposé |
| --- | --- | --- | --- | --- |
| IV-06 | En tant qu'utilisateur, je veux me connecter pour accéder à mon espace | Fullstack | P0 | 1 |
| IV-07 | En tant qu'utilisateur, je veux consulter et modifier mon profil étudiant | Fullstack | P1 | 1 |
| IV-08 | En tant qu'administrateur, je veux gérer les rôles et les permissions | Backend | P0 | 1 |
| IV-09 | En tant qu'utilisateur, je veux renouveler ma session en sécurité avec JWT | Fullstack | P0 | 1 |

**Critères d'acceptation principaux :**
- Connexion avec des identifiants valides et réponse d'erreur pour les identifiants invalides.
- Les endpoints protégés vérifient l'authentification et les permissions côté serveur.
- Le renouvellement et la déconnexion respectent la stratégie de sécurité des tokens retenue.
- Le profil présente uniquement les données autorisées.

### EPIC 3 — Gestion des scrutins

| ID | User Story | Équipe | Priorité | Sprint proposé |
| --- | --- | --- | --- | --- |
| IV-10 | En tant qu'administrateur, je veux créer un scrutin | Fullstack | P0 | 2 |
| IV-11 | En tant qu'administrateur, je veux configurer les dates, le statut et les règles d'un scrutin | Fullstack | P0 | 2 |
| IV-12 | En tant qu'étudiant, je veux consulter les scrutins qui me concernent | Fullstack | P0 | 2 |
| IV-13 | En tant qu'administrateur, je veux modifier, ouvrir ou clôturer un scrutin | Fullstack | P1 | 2 |

**Critères d'acceptation principaux :**
- Seul un compte autorisé peut créer ou gérer un scrutin.
- Les dates et champs obligatoires sont validés.
- L'étudiant n'accède qu'aux scrutins qui le concernent.
- Les transitions de statut sont contrôlées et les modifications interdites après certaines étapes sont bloquées.

### EPIC 4 — Candidatures

| ID | User Story | Équipe | Priorité | Sprint proposé |
| --- | --- | --- | --- | --- |
| IV-14 | En tant qu'administrateur, je veux gérer les candidats associés à un scrutin | Fullstack | P0 | 2 |
| IV-15 | En tant qu'étudiant, je veux consulter les candidats et leurs profils | Fullstack | P0 | 2 |
| IV-16 | En tant qu'administrateur, je veux gérer les candidatures et leurs documents, si ce processus est retenu | Fullstack | P2 | 2 / après MVP |

**Critères d'acceptation principaux :**
- Les candidats sont rattachés à un scrutin et à une fonction ou catégorie de candidature selon les règles définies.
- Les étudiants voient les candidats des scrutins auxquels ils ont accès.
- Les données et pièces non publiques ne sont pas exposées aux étudiants.

### EPIC 5 — Vote électronique

| ID | User Story | Équipe | Priorité | Sprint proposé |
| --- | --- | --- | --- | --- |
| IV-17 | En tant qu'étudiant éligible, je veux accéder à mon bulletin de vote | Fullstack | P0 | 3 |
| IV-18 | En tant qu'étudiant éligible, je veux sélectionner un candidat et voter | Fullstack | P0 | 3 |
| IV-19 | En tant qu'administrateur, je veux empêcher tout vote multiple pour un même scrutin | Backend | P0 | 3 |
| IV-20 | En tant qu'étudiant, je veux une confirmation de participation sans divulgation de mon choix | Fullstack | P0 | 3 |

**Critères d'acceptation principaux :**
- Seul un étudiant authentifié et éligible peut voter dans un scrutin ouvert.
- Le bulletin n'affiche que les choix autorisés.
- Une soumission valide est enregistrée de façon atomique.
- Les votes multiples sont empêchés, y compris lors de requêtes simultanées.
- Le choix électoral reste confidentiel et n'apparaît pas dans une confirmation nominative ni dans les logs.

### EPIC 6 — Résultats et statistiques

| ID | User Story | Équipe | Priorité | Sprint proposé |
| --- | --- | --- | --- | --- |
| IV-21 | En tant qu'utilisateur autorisé, je veux consulter les résultats publiés | Fullstack | P0 | 4 |
| IV-22 | En tant qu'administrateur, je veux consulter les statistiques de participation et les résultats détaillés | Fullstack | P1 | 4 |

**Critères d'acceptation principaux :**
- Les résultats ne sont publiés que lorsque les règles du scrutin le permettent.
- Les totaux sont cohérents avec les suffrages enregistrés.
- Les statistiques ne permettent pas d'associer un électeur à son choix.
- Les cas sans vote et les égalités sont gérés.

### EPIC 7 — Documentation et qualité

| ID | User Story | Équipe | Priorité | Sprint proposé |
| --- | --- | --- | --- | --- |
| IV-23 | En tant que développeur frontend, je veux consulter les endpoints, schémas, exemples et permissions dans une documentation OpenAPI | Backend | P0 | 1 puis continu |

**Critères d'acceptation principaux :**
- Documentation OpenAPI consultable (par exemple avec drf-spectacular et Swagger UI).
- Requêtes, réponses, erreurs, paramètres, filtres et authentification décrits.
- La documentation est actualisée à chaque modification des endpoints.

## 5. Proposition de planification

| Sprint | Objectif | Tickets | Démonstration attendue |
| --- | --- | --- | --- |
| **1 — Fondations** | Backend, frontend et authentification | IV-01 à IV-09, IV-23 | Connexion et accès à une zone protégée |
| **2 — Scrutins et candidatures** | Préparation des élections | IV-10 à IV-16 | Création d'un scrutin et affichage des candidats |
| **3 — Vote** | Parcours de vote sécurisé | IV-17 à IV-20 | Vote unique d'un étudiant éligible |
| **4 — Résultats** | Dépouillement, publication, tests et stabilisation | IV-21 à IV-22 + tests transversaux | Clôture d'un scrutin et affichage des résultats |

> Les sprints sont indicatifs. IV-07 et IV-16 peuvent être reportés pour préserver la livraison du MVP. La durée et la charge doivent être estimées par l'équipe.

## 6. Répartition des responsabilités

| Backend Django | Frontend React |
| --- | --- |
| Modèles, migrations et serializers | Pages, composants et routage |
| API REST et contrats de données | Client API et gestion des états |
| Authentification et permissions serveur | Formulaires et navigation selon les rôles |
| Règles métier des scrutins | Création et consultation des scrutins |
| Éligibilité, validation et intégrité des votes | Bulletin et confirmation de participation |
| Dépouillement et contrôle d'accès aux résultats | Visualisation des résultats |
| Tests API et documentation OpenAPI | Tests UI et intégration |

## 7. Décisions produit à confirmer

- [ ] Quelle structure académique détermine l'éligibilité (faculté, département, promotion, etc.) ?
- [ ] Qui peut être candidat et comment sa candidature est-elle validée ?
- [ ] Un scrutin comprend-il un seul poste à pourvoir ou plusieurs ?
- [ ] Quel mode de scrutin est autorisé (un candidat, plusieurs choix, bulletin blanc) ?
- [ ] Qui peut consulter les statistiques et à quel moment ?
- [ ] Quelles règles garantissent le secret du vote et la traçabilité des actions administratives ?
- [ ] Quels événements ouvrent, clôturent et publient un scrutin ?

## 8. Suivi dans GitHub

Créer une **GitHub Issue** par ticket et l'ajouter au **GitHub Project iVote**.

**Champs suggérés :** `Status`, `Priority`, `Epic`, `Sprint`, `Team`, `Assignee`.

**Labels suggérés :** `backend`, `frontend`, `fullstack`, `security`, `documentation`, `bug`.

### Modèle d'Issue

```markdown
## User Story
En tant que ..., je veux ... afin de ...

## Description
Décrire le comportement et les règles métier attendus.

## Critères d'acceptation
- [ ] Critère 1
- [ ] Critère 2
- [ ] Critère 3

## Dépendances
- ...

## Notes techniques / API
- Endpoint(s) concernés : ...
- Permissions attendues : ...
```

> **Source de vérité :** les GitHub Issues / Projects pour le statut des tâches ; ce document pour la vision d'ensemble et le périmètre fonctionnel.
