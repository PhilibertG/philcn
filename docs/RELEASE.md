# Mise en ligne — comment ça marche

Ce document est pour Phil. Il décrit la chaîne qui va d'un commit à une
version publiée, et la seule règle d'usage à retenir.

## La règle

**Rien n'atteint les utilisateurs tant que la release PR n'est pas mergée.**
Et je ne la merge **qu'après** avoir fait mon parcours de test à la main.
C'est ma vérification qui ouvre la porte, jamais un envoi à l'aveugle.

## Les quatre étages

**1. Les commits.** Chaque commit porte une étiquette : `feat:` pour une
nouveauté, `fix:` pour une correction, `docs:`, `refactor:`… C'est cette
étiquette qui décide du numéro de version et qui écrit le changelog.

**2. La vérification automatique.** Sur chaque pull request, GitHub relit tous
les commits et refuse ceux qui n'ont pas la bonne forme. Il refuse aussi tout
commit portant une co-signature ou la mention d'un outil d'IA — c'est la
preuve d'authorship qui est protégée là. Au même moment, le code est compilé
et les tests sont joués.

Pour faire cette vérification sur ma machine avant de pousser :

```bash
node scripts/check-commits.mjs origin/main..HEAD
```

**3. Le robot de version.** Dès qu'un commit arrive sur `main`, un robot
(release-please) tient à jour **une seule pull request permanente**, appelée
« chore: release X.Y.Z ». Elle contient le futur numéro de version et le
changelog rédigé tout seul. Elle se met à jour à chaque nouveau commit. Tant
qu'elle n'est pas mergée, il ne se passe rien d'autre.

Le numéro se calcule seul :

| Commits depuis la dernière version | Version obtenue (avant la 1.0) |
| --- | --- |
| que des `fix:` | 0.1.0 → 0.1.1 |
| au moins un `feat:` | 0.1.0 → 0.2.0 |
| un `feat!:` ou `BREAKING CHANGE:` | 0.1.0 → 0.2.0 aussi, tant qu'on est en 0.x |

**4. La mise en ligne.** Quand je merge la release PR :

1. l'étiquette de version (le *tag*) est posée sur le dépôt ;
2. la release et son changelog sont publiés ;
3. le déploiement part **depuis ce même workflow**.

Ce dernier point est volontaire : une release créée par le robot avec le
jeton GitHub standard ne réveille pas les autres workflows. Le déploiement est
donc appelé directement, il n'attend pas un signal qui ne viendrait jamais.

## Où vivent mes versions

`https://github.com/PhilibertG/philcn/releases`

C'est la page de preuve : une entrée par version, avec sa date, son tag et la
liste de ce qui a changé. Le fichier `CHANGELOG.md` à la racine dit la même
chose, versionné dans le dépôt.

## Le déploiement

Le workflow de déploiement est branché et se déclenche bien sur la release,
mais **il n'a pas encore de cible** : philcn est une bibliothèque, il n'y a
pour l'instant ni serveur ni site en ligne. Il pose le tag, publie le
changelog, revérifie que la version taguée compile et passe les tests, puis
indique qu'il n'y a rien à livrer.

Pour l'allumer plus tard, deux réglages dans les paramètres du dépôt :

- **Variable** `DEPLOY_TARGET` = `ssh`
- **Variable** `DEPLOY_COMMAND` = la commande à lancer sur le serveur, par
  exemple `cd /srv/philcn && git fetch --tags && git checkout "$TAG" && npm ci && npm run build && systemctl restart philcn`
- **Secrets** `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`

La clé SSH doit être une clé **dédiée au déploiement**, pas ma clé
personnelle : on en crée une nouvelle, on met la partie publique sur le
serveur dans `~/.ssh/authorized_keys` du compte de déploiement, et la partie
privée dans le secret `DEPLOY_SSH_KEY`. Elle ne vit jamais dans le code.

## Rejouer une livraison

`Actions` → `Deploy` → `Run workflow`, en donnant le tag (`v0.1.0` par
exemple). Ça ne crée pas de version, ça relivre une version déjà publiée.
