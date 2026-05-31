# Formation Pro PWA — Déploiement

## Option 1 : Netlify Drop (2 minutes, gratuit)
1. Va sur **app.netlify.com/drop**
2. Dézippe le ZIP → glisse **le dossier pwa_v3** sur la page
3. URL HTTPS prête en 30 secondes
4. Sur mobile : bannière d'installation automatique (Chrome Android)
5. iOS Safari : Partager → "Sur l'écran d'accueil"

## Option 2 : Vercel CLI
```bash
npm i -g vercel
cd pwa_v3
vercel --prod
```

## Option 3 : GitHub Pages
1. Crée un repo public
2. Push le contenu du dossier pwa_v3/
3. Settings → Pages → Deploy from main branch / root
4. URL : https://[user].github.io/[repo]

## Option 4 : Test local
```bash
cd pwa_v3
python3 -m http.server 8080
# Ouvre http://localhost:8080
# NB : SW requiert HTTPS ou localhost
```

## Premier lancement
1. Ouvrir l'URL sur mobile
2. Entrer la clé Anthropic (console.anthropic.com → API Keys)
3. La clé est stockée dans localStorage — jamais transmise ailleurs
4. Toucher "Installer" pour ajouter à l'écran d'accueil

## Fonctionnalités hors-ligne
✓ Navigation entre modules
✓ Cours déjà générés (mis en cache localStorage)
✓ Quiz déjà générés
✓ Calculateur Runway
✓ Analyseur d'email (détection jargon locale)
✗ Génération de cours (requiert API Anthropic)
✗ Outils IA live (requiert API Anthropic)
