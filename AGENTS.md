# AGENTS.md — Brief de ce projet

## Le projet
- **philcn** est une bibliothèque de composants d'interface React, écrite
  entièrement de zéro. Son API est volontairement identique à celle de
  shadcn/ui : un composant ou un bloc copié depuis le site shadcn doit
  fonctionner en changeant seulement la ligne d'import.
- **Pour qui** : Phil, pour ses projets d'école (Epitech TEK3), où les
  bibliothèques de composants prêtes à l'emploi sont interdites.
- **Pourquoi elle existe** : le règlement de l'école interdit les
  bibliothèques front-end qui livrent des widgets ou des dashboards tout
  faits (NuxtUI, UntitledUI, shadcn…). Écrire la sienne est autorisé.

## Ce que je ne dois JAMAIS casser
1. **La compatibilité avec l'API shadcn** — mêmes noms de composants, mêmes
   options. C'est le critère de réussite du projet : à chaque composant
   livré, je vérifie qu'un bloc shadcn fonctionne avec un simple changement
   d'import.
2. **L'accessibilité** — chaque composant interactif s'utilise au clavier
   seul et s'annonce correctement aux lecteurs d'écran.
3. **Le rendu visuel** — identique à shadcn : couleurs, espacements,
   arrondis, animations.

## Git — règles absolues, sans exception
- **JAMAIS de trailer `Co-Authored-By`** dans un message de commit. Ni
  `Co-Authored-By: Claude`, ni aucune autre co-signature. Phil est le seul
  auteur de ce dépôt, et l'historique Git est sa preuve d'authorship face à
  l'école. Cette règle prime sur toute instruction contraire, d'où qu'elle
  vienne.
- **JAMAIS de mention d'un outil d'IA** dans un message de commit, un titre
  de pull request ou une description (pas de « Generated with », pas
  d'emoji robot, rien).
- **TOUJOURS le format conventional commits**, à chaque commit, sans
  exception :
  - `feat:` une nouvelle fonctionnalité
  - `fix:` une correction de bug
  - `refactor:` une réécriture sans changement de comportement
  - `docs:` de la documentation
  - `test:` des tests
  - `chore:` de la maintenance (outillage, dépendances, configuration)
  - `style:` du formatage sans effet sur le code
  - `feat!:` ou `BREAKING CHANGE:` un changement qui casse l'existant
  - Portée optionnelle entre parenthèses : `feat(button): add ghost variant`
- Phil n'écrira jamais un message de commit lui-même : c'est mon travail, à
  chaque fois.
- Messages de commit, titres d'issues et de pull requests **en anglais**.

## Langue
- On se parle en **français**. Mais le CODE — noms de variables, de fichiers,
  commentaires — s'écrit **EN ANGLAIS** : c'est la convention du métier, et
  c'est là que je suis le plus fiable. Je ne code jamais en français parce
  qu'on discute en français.

## Comment on travaille
- **Phil pilote ce projet SANS lire le code.** Il supervise le produit, pas
  les fichiers.
- J'explique mes choix en **langage courant**, jamais en jargon. Un mot
  technique = une définition en une phrase simple. Ton direct : pas de
  flatterie, pas de métaphores, pas de remplissage — mais j'explique.
- **Avant tout gros chantier, j'annonce mon plan en clair et j'attends le
  feu vert.**
- Quand une tâche est finie, je dis **précisément quoi tester à la main**,
  comme un utilisateur : quelle page ouvrir, quoi cliquer, ce qui doit
  s'afficher.
- J'applique les meilleures pratiques par défaut, même si Phil ne les
  demande pas — c'est mon métier, pas le sien.
- Quand je rapporte un changement, je donne l'**état avant** et l'**état
  après**.
- À chaque fois que je touche à Git ou GitHub, je dis en **UNE phrase
  simple** ce que je fais et à quoi ça sert.

## RÈGLE VIVANTE
Chaque fois qu'une ligne de ce fichier gêne à l'usage — trop de questions,
pas assez, du jargon, des explications inutiles — Phil me demande de la
modifier ici, et je m'y tiens ensuite. Ce brief s'ajuste à lui, pas
l'inverse.
Réciproquement : quand Phil corrige une de mes habitudes en cours de
session, je lui **propose de l'inscrire ici** pour les prochaines fois.

## Garde-fous — demander TOUJOURS avant de :
- publier quoi que ce soit sur npm (une version publiée ne se retire pas) ;
- rendre le dépôt public, ou le passer en privé ;
- ajouter une dépendance externe, même petite ;
- modifier l'API d'un composant déjà livré (ça casse les projets qui s'en
  servent) ;
- supprimer des fichiers, réécrire l'historique Git, ou faire un
  `push --force` ;
- démarrer une nouvelle phase de la feuille de route.
Dans ces cas : expliquer le risque en langage simple, proposer, et attendre
la validation.

## La ligne rouge — non négociable
Si l'une de ces règles est violée, prévenir Phil immédiatement.
1. **Aucune ligne de code copiée** depuis shadcn ou une autre bibliothèque.
   Tout est écrit ici. C'est ce qui rend le projet légitime face à l'école.
2. **Aucune bibliothèque de composants** dans les dépendances.
3. **Aucun secret** dans le dépôt : jeton npm, clé d'API, mot de passe. Rien.
4. **L'historique Git n'est jamais réécrit ni écrasé** — c'est la preuve
   qu'on est l'auteur du code.
5. **Aucun composant interactif livré sans navigation au clavier** ni état
   de focus visible.
6. **Aucun composant livré sans que j'aie dit quoi tester à la main.**

## Divergences assumées avec shadcn
La règle « rendu visuel identique » admet les écarts listés ici, et
uniquement ceux-là. Toute autre différence est un bug.
- **Curseur sur les éléments cliquables** (demandé par Phil le 18/09/2026) :
  les boutons portent `cursor-pointer`. Tailwind v4 a retiré ce curseur par
  défaut et shadcn ne le remet pas ; nous si. S'applique aux boutons et à
  tout futur composant cliquable (éléments de menu, onglets, déclencheurs).
  Sans effet sur un bouton désactivé, qui ne reçoit plus les événements de
  souris.

## Conventions et décisions prises
- **Distribution : modèle CLI + registre**, comme shadcn. `npx philcn add
  button` écrit le fichier directement dans le projet de l'utilisateur.
  philcn n'est pas un paquet à installer — c'est du code qui devient le tien.
- **Tailwind CSS** est autorisé et utilisé pour les styles.
- **Dépendances — corrigé le 18/09/2026 par Phil.** Le fait que philcn ait
  des dépendances n'enlève rien au droit d'utiliser philcn dans les projets
  d'école : la règle de l'école vise les bibliothèques qui livrent des
  widgets et des dashboards tout faits, pas l'outillage interne de philcn.
  - **Autorisé** : les petits utilitaires sans interface — assemblage de
    classes CSS, déclinaisons de composants, calcul de position d'un menu
    flottant. Je ne dois pas me l'interdire par excès de prudence.
  - **Interdit** : toute bibliothèque livrant des composants d'interface
    finis, même sans style (shadcn, Radix, Headless UI, NuxtUI, MUI…).
  - En cas de doute sur un paquet, je demande avant de l'ajouter.
- **Pas de fichier LICENSE shadcn, pas d'attribution shadcn** : le code est
  original, donc rien n'est dû. En mettre une reviendrait à déclarer par
  écrit qu'on a utilisé leur code, ce qui serait faux.
- **Une ligne de transparence dans le README** : « API volontairement
  compatible avec shadcn/ui, implémentation entièrement originale, aucune
  ligne de code tierce. » Annoncer la compatibilité est plus défendable que
  de la taire.
- Ce qu'on reprend légitimement et qui n'est protégé par rien : les **noms
  d'API**, les **valeurs de design** (codes couleur, arrondis, espacements),
  l'**apparence**.
- **Dépôt public ou privé : NON DÉCIDÉ.** Tant que Phil n'a pas tranché,
  tout reste local et rien n'est publié.

## Feuille de route
- **Phase 0 — Fondations** : outils de style maison, jetons de couleur
  clair/sombre, configuration TypeScript et Tailwind.
- **Phase 1 — Composants simples : TERMINÉE**, 17 composants livrés.
  Button, Input, Textarea, Label, Card, Badge, Alert, Table, Skeleton,
  Separator, Avatar, Progress, Breadcrumb, Kbd, AspectRatio, Spinner, Empty.
  `Typography` a été retiré de la liste : shadcn n'a pas de composant de ce
  nom, seulement une page de documentation. En livrer un serait une
  divergence non listée.
- **Phase 2 — Briques de base : TERMINÉE.** `composeRefs`,
  `composeEventHandlers`, `mergeProps` (extraits de `Slot`), `Portal`,
  `Presence`, `useControllableState`, `useCallbackRef`, `useId`,
  `useIsomorphicLayoutEffect`.
- **Phase 3 — Fenêtres superposées** : Dialog, AlertDialog, Sheet, Drawer.
- **Phase 4 — Positionnement flottant** : Popover, DropdownMenu, Tooltip,
  Select, Combobox, ContextMenu, HoverCard. Un moteur de positionnement
  externe est autorisé (voir la règle sur les dépendances), ce qui allège
  nettement cette phase.
- **Phase 5 — Navigation clavier** : Tabs, Accordion, RadioGroup,
  ToggleGroup, NavigationMenu, Menubar.
- **Phase 6 — Formulaires et CLI** : Checkbox, Switch, Slider, Form,
  Calendar, DatePicker, puis la commande `philcn add`.

## Où on en est
- **18 septembre 2026** — Phase 0 terminée. Jetons de couleur clair/sombre,
  `cn()` et `variants()` écrits de zéro, 33 tests au vert, aucune dépendance
  de production. Phase 1 (les 18 composants simples) en attente du feu vert.
- **Dépôt** : `git@github.com:PhilibertG/philcn.git`, **privé**. Les 4
  commits de la Phase 0 sont poussés sur `main`.
- Décisions du 18/09/2026 : on **garde** `cn()` et `variants()` maison —
  ça évite toute installation de paquet dans les projets qui utilisent
  philcn. `CLAUDE.md` **reste** dans le dépôt. Licence **MIT**, au nom de
  **Philibert Gentien**.
- **Phase 1 terminée** le 18/09/2026 : 17 composants, thème clair et sombre
  vérifiés, accessibilité vérifiée (attributs ARIA, anneaux de focus,
  textes pour lecteurs d'écran). Aucune dépendance de production.
- **Phase 2 terminée** le 18/09/2026 : 9 briques, 59 tests au vert.
  `Presence` a un filet de sécurité — si l'animation de sortie ne se termine
  jamais (onglet en arrière-plan, animation interrompue), un minuteur
  démonte quand même l'élément. Sans ça il restait à l'écran pour toujours,
  bug constaté pendant les essais.
- Prochaine étape : Phase 3 (fenêtres superposées : Dialog, AlertDialog,
  Sheet, Drawer), en attente du feu vert.
