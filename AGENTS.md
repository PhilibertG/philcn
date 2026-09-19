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
  - Types acceptés aussi, parce que le robot de version les comprend :
    `perf:`, `build:`, `ci:`, `revert:`.
- Phil n'écrira jamais un message de commit lui-même : c'est mon travail, à
  chaque fois.
- Messages de commit, titres d'issues et de pull requests **en anglais**.
- **La forme des commits est vérifiée automatiquement** sur chaque pull
  request (`scripts/check-commits.mjs`, joué par le workflow CI). Le même
  script refuse tout commit portant une co-signature, la mention d'un outil
  d'IA ou un emoji robot. À jouer avant de pousser :
  `node scripts/check-commits.mjs origin/main..HEAD`.
- **Ces étiquettes décident du numéro de version et du changelog** : un
  commit mal étiqueté coûte une ligne de release. Voir `docs/RELEASE.md`.

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

## Quelle « flaveur » de shadcn on suit
shadcn publie désormais **trois** implémentations : Base UI (celle par
défaut), Radix UI et React Aria. Elles diffèrent sur la façon de remplacer
l'élément d'un déclencheur.
- **philcn accepte les deux écritures** (décidé par Phil le 18/09/2026) :
  `asChild` (Radix) et `render` (Base UI). `<Button asChild><a/></Button>` et
  `<Button render={<a/>} />` donnent le même résultat.
- Raison : la quasi-totalité des blocs, tutoriels et projets existants
  utilisent `asChild`, mais la documentation actuelle montre `render`. Coller
  du code venu de l'une ou l'autre doit marcher.

## Divergences assumées avec shadcn
La règle « rendu visuel identique » admet les écarts listés ici, et
uniquement ceux-là. Toute autre différence est un bug.
- **Curseur sur les éléments cliquables** (demandé par Phil le 18/09/2026) :
  les boutons portent `cursor-pointer`. Tailwind v4 a retiré ce curseur par
  défaut et shadcn ne le remet pas ; nous si. S'applique aux boutons et à
  tout futur composant cliquable (éléments de menu, onglets, déclencheurs).
  Sans effet sur un bouton désactivé, qui ne reçoit plus les événements de
  souris.
- **Retour au clic** (audit animations du 18/09/2026) : un bouton enfoncé se
  réduit à `scale(0.97)` en 160 ms. shadcn ne donne aucun retour tactile.
  La variante `link` en est exclue : un lien texte ne doit pas rétrécir.
- **Bordure de focus en fondu** : `border-color` est dans la liste des
  propriétés animées des champs, badges et boutons. Chez shadcn la bordure
  saute pendant que l'anneau apparaît en fondu.
- **Image d'avatar en fondu** : elle remplace les initiales en 200 ms au lieu
  d'apparaître d'un coup.
- **Drawer sans mise à l'échelle du fond** : `vaul` réduit légèrement la
  page derrière le tiroir. Pas reproduit — ça demande de transformer un
  conteneur autour de toute l'application, trop intrusif pour une
  bibliothèque qu'on copie dans un projet existant.
- **Dialogues empilés** (demandé par Phil le 18/09/2026) : quand un dialogue
  s'ouvre par-dessus un autre, celui du dessous reste ouvert mais s'efface —
  fondu et léger retrait — et revient quand celui du dessus se ferme. Il est
  aussi rendu inerte : pas de piège à focus, invisible aux lecteurs d'écran
  tant qu'il est couvert. shadcn les empile visuellement.
- **Dialogue à défilement interne** : un dialogue plus haut que l'écran
  défile en lui-même (`max-h-[calc(100dvh-2rem)] overflow-y-auto`). Chez
  shadcn il déborde et le bas devient inatteignable.
- **Animations maison plutôt que `tw-animate-css`** : les courbes et les
  images-clés sont définies dans `philcn.css`. Ça évite une dépendance et
  garde les durées modifiables. Deux jetons de courbe : `--ease-out-strong`
  pour les dialogues, `--ease-drawer` pour les volets.

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
  - **Seule dépendance de production à ce jour** : `@floating-ui/react-dom`
    (décidé par Phil le 18/09/2026), du calcul de position pur — aucun
    composant, aucune interaction. Elle ne concerne que les composants
    flottants (Popover, Tooltip, Select…). Les 17 composants de la Phase 1 et
    les fenêtres de la Phase 3 n'ont toujours besoin d'aucun paquet.
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
- **Chaîne de mise en ligne** (montée le 19/09/2026, à la demande de Phil) :
  les commits arrivent sur `main`, le robot **release-please** tient à jour
  une release PR permanente (numéro de version + changelog), et **rien
  n'atteint les utilisateurs tant que Phil ne merge pas cette PR**. Le merge
  pose le tag, publie le changelog et appelle le déploiement depuis le même
  workflow — une release faite avec le jeton GitHub standard ne réveille pas
  les autres workflows, donc on ne compte pas dessus. Tout est décrit en
  langage courant dans `docs/RELEASE.md`.
  - **Règle d'usage** : Phil ne merge la release PR qu'APRÈS son parcours de
    test à la main.
  - **Cible de déploiement : aucune pour l'instant** (décidé par Phil le
    19/09/2026). philcn est une bibliothèque : ni serveur, ni site. Le
    workflow de déploiement est branché et se déclenche bien sur la release,
    il revérifie que la version taguée compile et passe les tests, puis
    annonce qu'il n'y a rien à livrer. Plus tard, ce sera probablement npm —
    et publier sur npm reste un garde-fou : je demande avant. Les réglages
    pour allumer une cible SSH sont dans `docs/RELEASE.md`.
- **Dépôt public ou privé : NON DÉCIDÉ.** Tant que Phil n'a pas tranché,
  tout reste local et rien n'est publié.

## À faire ensuite
1. **`Form` — en attente d'une décision de Phil.** Chez shadcn, `Form` est une
   surcouche de `react-hook-form` : `useForm`, `FormField`, `Controller`. Sans
   ce paquet, un bloc shadcn collé ne marche pas. `react-hook-form` ne livre
   aucun composant d'interface, seulement la mécanique d'un formulaire, donc
   la règle sur les dépendances l'autorise — mais j'attends l'accord.
2. **Le survol à juger à la main.** L'ouverture au survol de Menubar,
   NavigationMenu et des sous-menus n'est pas constatée par moi : mon
   navigateur d'inspection n'émet ni vrais survols ni événements de focus.

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
- **Phase 3 — Fenêtres superposées : Dialog, AlertDialog et Sheet
  TERMINÉS.** Les trois reposent sur une brique commune, `Overlay`
  (`src/lib/overlay.tsx`) : portail, fond assombri, piège à focus, Échap, clic
  extérieur, page figée, sortie animée. Une correction faite là profite aux
  trois. **Drawer inclus** : shadcn s'appuie sur `vaul`, interdit ici, donc le
  glisser-pour-fermer est écrit à la main (`src/lib/drag-dismiss.ts` pour les
  règles, testé unitairement ; `use-drag-dismiss.ts` pour le branchement au
  doigt). Le panneau suit le doigt, résiste quand on le tire trop ouvert, et
  se ferme sur un geste rapide ou passé le quart de sa taille. Le côté se
  choisit avec `swipeDirection` (`up` / `right` / `down` / `left`), comme
  chez shadcn ; l'ancien `direction` (`top` / `bottom` / `left` / `right`)
  reste accepté pour le code écrit contre les versions précédentes.
- **Phase 4 — Positionnement flottant** : Popover, DropdownMenu, Tooltip,
  Select, Combobox, ContextMenu, HoverCard. Un moteur de positionnement
  externe est autorisé (voir la règle sur les dépendances), ce qui allège
  nettement cette phase.
- **Phase 5 — Navigation clavier : TERMINÉE.** Tabs, Accordion, RadioGroup,
  Toggle, ToggleGroup, Menubar, NavigationMenu. `Toggle` s'ajoute à la liste
  d'origine (accord de Phil, 19/09/2026) : chez shadcn, `ToggleGroup` importe
  ses styles depuis `toggle.tsx`, donc sans lui un bloc collé ne compile pas.
- **Phase 6 — Formulaires et CLI : TERMINÉE sauf `Form`.** Checkbox, Switch,
  Slider, Calendar et la commande `philcn` sont livrés. `DatePicker` n'est pas
  un composant : chez shadcn c'est un `Calendar` dans un `Popover`, et la même
  composition marche ici — comme pour `Combobox`.

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
- **Phase 3 terminée** le 18/09/2026 : Dialog, AlertDialog, Sheet et Drawer,
  81 tests au vert, zéro dépendance de production.
- **Non testé par moi** : le geste au doigt sur un vrai écran tactile. Mon
  navigateur d'inspection ne simule que des événements, et il y gèle les
  animations comme les transitions. La fluidité et le ressenti du glissement
  doivent être jugés par Phil sur son téléphone.
- **Phase 4 en cours** (19/09/2026) : `Floating` (brique commune :
  placement, repli quand ça sort de l'écran, suivi au défilement),
  **Popover**, **Tooltip** et **HoverCard** livrés et vérifiés. 89 tests.
- **DropdownMenu, ContextMenu et Select livrés** (19/09/2026) et vérifiés
  au clavier. Le tronc commun des menus est dans `src/lib/menu.tsx`, la
  navigation dans `list-navigation.ts` (règles pures, testées) et
  `collection.tsx` (registre des entrées).
- **Phase 4 TERMINÉE** (19/09/2026). `Command` est écrit à la main (shadcn
  s'appuie sur `cmdk`, interdit ici) : le focus reste dans le champ, les
  flèches déplacent un marqueur, et le champ annonce l'entrée marquée aux
  lecteurs d'écran. Filtrage insensible aux accents, meilleur résultat remonté
  en tête via `order` CSS pour ne pas remuer le balisage, groupe vidé masqué.
  Le **Combobox** n'est pas un composant : chez shadcn c'est un `Command`
  dans un `Popover`, et la même composition marche ici.
- **Phase 5 terminée** (19/09/2026) : 7 composants, 35 en tout, 122 tests au
  vert. Nouvelle brique commune `src/lib/roving-focus.tsx` — le « focus
  glissant » : dans une rangée d'onglets, de boutons radio ou de bascules, la
  touche Tab n'entre qu'une fois dans le groupe et les flèches déplacent
  ensuite. Elle sert à Tabs, RadioGroup, ToggleGroup, Menubar et
  NavigationMenu. L'accordéon ne l'utilise pas : la règle d'accessibilité veut
  que chaque en-tête reste dans l'ordre de tabulation.
- **Mesure de hauteur de l'accordéon** : un panneau se déplie de 0 à sa
  hauteur réelle, connue seulement une fois le contenu en place. Elle est
  mesurée et rangée dans `--philcn-accordion-height`, et un observateur de
  taille la corrige si le contenu change. Même principe pour la boîte partagée
  de NavigationMenu (`--philcn-navigation-menu-viewport-*`, avec les noms
  `--radix-*` en alias pour le code collé depuis shadcn).
- **Manque connu, à traiter plus tard : les sous-menus.** `DropdownMenu`,
  `ContextMenu` et `Menubar` n'ont pas `Sub` / `SubTrigger` / `SubContent`.
  Un bloc shadcn qui ouvre un sous-menu ne marchera pas. Le manque date de la
  Phase 4 ; l'ajouter dans `src/lib/menu.tsx` profiterait aux trois d'un coup.
- **Non testé par moi en Phase 5** : l'ouverture au survol de la souris
  (Menubar et NavigationMenu). Mon navigateur d'inspection n'émet pas de vrais
  événements de survol ni de focus, et sa fenêtre est masquée. À juger à la
  main.
- **Sous-menus livrés** (19/09/2026) dans `src/lib/menu.tsx` : `Sub`,
  `SubTrigger`, `SubContent` pour DropdownMenu, ContextMenu et Menubar, sur
  plusieurs niveaux. Un menu imbriqué garde son propre état, mais choisir une
  entrée referme toute la pile — c'est le rôle de `closeAll`.
- **Phase 6** (19/09/2026) : Checkbox (avec l'état à demi coché), Switch,
  Slider (plusieurs poignées, distance minimale, clavier et glissement),
  Calendar (modes simple, multiple et plage, mois multiples, listes
  déroulantes de mois et d'année, langue au choix). Deux modules de calcul
  purs et testés : `slider-math.ts` et `calendar-math.ts`.
- **`react-day-picker` est interdit** pour Calendar, comme `cmdk` l'était pour
  Command : c'est une bibliothèque qui livre un composant d'interface fini.
  Tout est écrit ici.
- **La commande `philcn`** (`cli/`) : `philcn list`, `philcn init`,
  `philcn add <nom>`. Le registre n'est pas écrit à la main — il est lu depuis
  le code, donc un composant qui se met à dépendre d'une nouvelle brique
  l'emporte avec lui tout seul. Les imports sont réécrits vers les alias du
  projet d'accueil (`@/components/ui`, `@/lib/philcn`) et l'extension est
  retirée. 189 tests, dont ceux du CLI. 39 composants en tout.
- **Divergence Select** : `SelectScrollUpButton` et `SelectScrollDownButton`
  existent pour la compatibilité d'API mais ne rendent rien — la liste
  défile d'elle-même et ne dépasse jamais la place disponible à l'écran.
