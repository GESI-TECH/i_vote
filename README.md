# i_vote

## Gestion du repository GitHub

Chaque modification majeure du projet doit être réalisée sur une branche dédiée, créée à partir de la branche principale `main` à jour.

Après l'implémentation, l'auteur pousse ses modifications sur GitHub en conservant le même nom de branche. Il crée ensuite une pull request vers `main`, vérifie ses changements et procède à la fusion dans le respect des règles du dépôt.

La validation du travail relève de l'auteur lui-même. Cependant, GitHub ne permet pas d'approuver formellement sa propre pull request : si une approbation est exigée par les règles du dépôt, elle doit être effectuée par un autre contributeur. Voir la [documentation GitHub sur l'approbation des pull requests](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews).

### Convention de nommage des commits

| Type de modification | Commande |
| --- | --- |
| Correction d'un bug | `git commit -m "fix: explication des modifications"` |
| Nouvelle fonctionnalité | `git commit -m "feat: explication des modifications"` |
| Infrastructure | `git commit -m "infra: explication des modifications"` |
| Tâches de maintenance | `git commit -m "chore: explication des modifications"` |

### Convention de nommage des branches

| Type de modification | Commande |
| --- | --- |
| Correction d'un bug | `git checkout -b fix/nom_de_la_correction` |
| Nouvelle fonctionnalité | `git checkout -b feat/nom_de_la_fonctionnalite` |
| Infrastructure | `git checkout -b infra/nom_de_l_infrastructure` |
| Tâches de maintenance | `git checkout -b chore/nom_de_la_tache` |

### Exemple de workflow

Depuis un répertoire de travail sans modifications en attente :

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feat/nom_de_la_fonctionnalite
```

Après l'implémentation et la vérification des changements, ajouter les fichiers concernés avec `git add <fichiers>`, puis :

```bash
git commit -m "feat: description de la fonctionnalite"
git push -u origin feat/nom_de_la_fonctionnalite
```

Créer ensuite la pull request sur GitHub, avec `main` comme branche de destination.

## Documentation de l'API et communication avec le frontend

Tous les contributeurs doivent installer Python sur leur ordinateur pour exécuter l'API, qui constitue le backend du projet.

### Démarrer le backend

1. Depuis la racine du projet, ouvrir le dossier du backend :

   ```bash
   cd backend
   ```

2. Créer un environnement virtuel (une seule fois par installation locale) :

   ```bash
   python -m venv .venv
   ```

3. Activer l'environnement virtuel dans chaque nouveau terminal utilisé pour le backend.

   Sous Windows, avec PowerShell :

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

   Sous Windows, avec l'invite de commandes (`cmd`) :

   ```bat
   .venv\Scripts\activate.bat
   ```

   Sous Linux ou macOS :

   ```bash
   source .venv/bin/activate
   ```

4. Installer les dépendances :

   ```bash
   python -m pip install -r requirements.txt
   ```

5. Appliquer les migrations à la première installation et après l'ajout de nouvelles migrations :

   ```bash
   python manage.py migrate
   ```

6. Lancer le serveur de développement :

   ```bash
   python manage.py runserver 8000
   ```

Si la commande `python` n'est pas disponible sous Linux ou macOS, utiliser `python3` pour créer l'environnement virtuel.

### Consulter et utiliser l'API

Le backend est accessible à l'adresse `http://localhost:8000/`. Le frontend communique avec les endpoints exposés sous `http://localhost:8000/api/`.

L'API repose sur une architecture CRUD : chaque ressource peut proposer des opérations de création, de lecture, de mise à jour et de suppression. Les opérations disponibles dépendent de la ressource concernée.

Une fois le backend démarré, consulter la [documentation interactive de l'API](http://localhost:8000/api/docs/) pour connaître les URLs, les méthodes HTTP et les formats des requêtes et des réponses à utiliser depuis le frontend.

## Standards de contribution

- L'application doit inspirer confiance à ses utilisateurs grâce à une interface et une expérience utilisateur (UI/UX) soignées.
- L'application doit être facilement auditable.
- Chaque contributeur doit être capable d'expliquer clairement ses choix d'implémentation.
- L'utilisation de l'intelligence artificielle doit rester modérée. Chaque contributeur reste responsable du code et des modifications qu'il soumet, y compris lorsqu'il utilise une IA.
