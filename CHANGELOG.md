# Changelog

## [0.4.2](https://github.com/PhilibertG/philcn/compare/v0.4.1...v0.4.2) (2026-09-24)


### Bug fixes

* **ci:** install the library's packages before type-checking the site ([3753ec7](https://github.com/PhilibertG/philcn/commit/3753ec7f72425eb56858f7445c72e7880b6e86c5))

## [0.4.1](https://github.com/PhilibertG/philcn/compare/v0.4.0...v0.4.1) (2026-09-21)


### Documentation

* **site:** centred content, a navigation that lands on a spring, smooth scrolling ([26acfa2](https://github.com/PhilibertG/philcn/commit/26acfa279a5bef2b6e262088f76a12f3972324ec))
* **site:** concentric navigation corners and squircle cards ([1f0fcd2](https://github.com/PhilibertG/philcn/commit/1f0fcd248d88ed041d4cd054b8f22d18cbd00054))
* **site:** give the full-width bar its own fill, and a real bounce ([357aa7c](https://github.com/PhilibertG/philcn/commit/357aa7c56827e7e939d04eb1c609cef05a2b4410))
* **site:** nest the navigation's corners, and draw the cards as squircles ([54e80fc](https://github.com/PhilibertG/philcn/commit/54e80fc9a30f80832b7197747b88ec49b31fdad4))
* **site:** set the resting bar into the hero card, not against its edge ([38bd9e7](https://github.com/PhilibertG/philcn/commit/38bd9e771777e22da3aeb3f6b6e5f68f358d787e))
* **site:** smooth scrolling, a darker top, and a spring for the navigation ([2904836](https://github.com/PhilibertG/philcn/commit/2904836fe48a1ea8483f6a9817000fd8588f9d39))

## [0.4.0](https://github.com/PhilibertG/philcn/compare/v0.3.1...v0.4.0) (2026-09-21)


### ⚠ BREAKING CHANGES

* animate with tw-animate-css, the way shadcn does
* stacked dialogs no longer step back. A dialog opened over another used to fade and recede, and return when the one above closed; they now stack the way shadcn's do. The surface underneath is still made inert and still hidden from screen readers while covered — that is accessibility, not decoration, and it stays.

### Features

* animate with tw-animate-css, the way shadcn does ([157829f](https://github.com/PhilibertG/philcn/commit/157829f4a98081df8d8878648f1dbcf9be472f20))
* animate with tw-animate-css, the way shadcn does ([1326d60](https://github.com/PhilibertG/philcn/commit/1326d601d27dead95633376585a9ceff555574e7))


### Bug fixes

* **command:** keep the page still and let long lists scroll ([cea1596](https://github.com/PhilibertG/philcn/commit/cea1596ea4cc8afb1ec8fb8e151f0fc8e020b03e))
* **command:** keep the page still and let long lists scroll ([119248e](https://github.com/PhilibertG/philcn/commit/119248e2e239236d9efb3009aa0fad804d5b4f66))
* hold the last frame of every closing animation ([789fce1](https://github.com/PhilibertG/philcn/commit/789fce1e157fbc88fba1f0827231eac8621cdc8a))


### Documentation

* **site:** add the showcase site ([677b0b7](https://github.com/PhilibertG/philcn/commit/677b0b76629e5d0e657110e051f0a2f634df4a84))
* **site:** add the showcase site ([2034fd4](https://github.com/PhilibertG/philcn/commit/2034fd40c69fc96fc114a204800befa366d98f6c))
* **site:** give the hero to the beams and the components their own card ([508ce9d](https://github.com/PhilibertG/philcn/commit/508ce9d468af6411b8d0bb01a6b14fe777e964a9))
* **site:** lay the page out as rounded cards, and offer five backdrops ([ccb2450](https://github.com/PhilibertG/philcn/commit/ccb2450775dab2ba7041818f8a7a4c693e2af163))
* **site:** pin the header, widen the margins, shorten the hero ([8e8ab0d](https://github.com/PhilibertG/philcn/commit/8e8ab0df73422bc66d6137c3c7d0d51e22d81640))
* **site:** turn the navigation into a capsule that draws in on scroll ([9a5e727](https://github.com/PhilibertG/philcn/commit/9a5e727f50e89e151bf23e90cedc9e71d5a3cf56))
* **site:** turn the navigation into a capsule that draws in on scroll ([e8bd41d](https://github.com/PhilibertG/philcn/commit/e8bd41ddb5bc883e67b929f40d5bade2b50ac450))

## [0.3.1](https://github.com/PhilibertG/philcn/compare/v0.3.0...v0.3.1) (2026-09-20)


### Bug fixes

* **avatar:** stop writing state from inside an effect ([7ab2517](https://github.com/PhilibertG/philcn/commit/7ab251795e8ea0591385cb5146685f047a689100))
* **cli:** let Tailwind see the classes the package carries ([c513ca0](https://github.com/PhilibertG/philcn/commit/c513ca07cdf4905766e577f345e7b90dff9aa1a6)), closes [#8](https://github.com/PhilibertG/philcn/issues/8)
* let Tailwind see the classes the installed package carries ([cc5538f](https://github.com/PhilibertG/philcn/commit/cc5538ff2035485829bcc9bef3bc4b8d39c5a691))
* run inside React Server Components and React 19 lint rules ([300b143](https://github.com/PhilibertG/philcn/commit/300b1431b2c4940eec25da872003525aab9f5739))
* **slot:** render asChild inside a React Server Component ([889467c](https://github.com/PhilibertG/philcn/commit/889467c44c5c7ceae53fb85fd1b1f2664955d813))


### Rewrites

* **menu:** name the keyboard entry point as a ref ([fe9d930](https://github.com/PhilibertG/philcn/commit/fe9d930c4108810f854ce6517e3ad294f3327173))

## [0.3.0](https://github.com/PhilibertG/philcn/compare/v0.2.1...v0.3.0) (2026-09-20)


### Features

* **cli:** import the shared behaviour rather than copying it ([f123afe](https://github.com/PhilibertG/philcn/commit/f123afe34deebb5f86046bb49f8aea9fed56685f))
* hand components over the way shadcn does ([1cb32b4](https://github.com/PhilibertG/philcn/commit/1cb32b4cfddb2467bb463cb4c67926c695828d32))
* **lib:** ship the shared behaviour as a compiled package ([2fb9ff8](https://github.com/PhilibertG/philcn/commit/2fb9ff8a173a3986f21001ae0ce9b8a03364d5e0))


### Bug fixes

* **avatar:** accept an image source widened by a framework ([26dee37](https://github.com/PhilibertG/philcn/commit/26dee372431a2736665a64267b94c9a3ad5a17a9))
* **components:** mark the interactive components as client components ([2568d5c](https://github.com/PhilibertG/philcn/commit/2568d5cbfc3ea6bb3a913b4f0ef2b4c771832875))
* make the components work in a Next.js App Router project ([88b9078](https://github.com/PhilibertG/philcn/commit/88b90780215cf84991ce19fefc32c67ead651571))


### Rewrites

* **lib:** build cn on clsx and tailwind-merge ([7cb1554](https://github.com/PhilibertG/philcn/commit/7cb1554ff006bb96f12fbbc1d3f5fe4faa70e9d6))
* **lib:** use class-variance-authority for the variants ([662bebe](https://github.com/PhilibertG/philcn/commit/662bebe755a096e1e2d8b26a394c9b52d040d7dd))

## [0.2.1](https://github.com/PhilibertG/philcn/compare/v0.2.0...v0.2.1) (2026-09-20)


### Bug fixes

* **cli:** point components.json at the stylesheet it actually wrote ([a7411fe](https://github.com/PhilibertG/philcn/commit/a7411fee6bc4a2f690a7b94bf564efeb879982b8))

## [0.2.0](https://github.com/PhilibertG/philcn/compare/v0.1.0...v0.2.0) (2026-09-20)


### Features

* **calendar:** add Calendar with single, multiple and range modes ([37ae7a6](https://github.com/PhilibertG/philcn/commit/37ae7a67ded70e1bf13ee98b95adc0289aac2e3a))
* **checkbox:** add Checkbox ([d968b67](https://github.com/PhilibertG/philcn/commit/d968b670ea6f5b501fe2be80ed020042a80f9f58))
* **cli:** add the philcn command that copies components into a project ([a05592f](https://github.com/PhilibertG/philcn/commit/a05592f0df9772a847ebbb29022329417d97eb61))
* **cli:** speak the project's own package manager ([52f7b23](https://github.com/PhilibertG/philcn/commit/52f7b2372c945e5ec7b77c8dff78f53e2decfde5))
* **form:** add Form on top of react-hook-form ([9a28aff](https://github.com/PhilibertG/philcn/commit/9a28aff7eaa1a421eade822c198fe3bee196d557))
* **lib:** add the calendar arithmetic ([1313795](https://github.com/PhilibertG/philcn/commit/13137957f207bd10b4b79f8bbbe71af026f7d569))
* **lib:** add the slider arithmetic ([4cc96d8](https://github.com/PhilibertG/philcn/commit/4cc96d8edbd505f892d7fcf8a7abd637ce954410))
* **menu:** add submenus to DropdownMenu, ContextMenu and Menubar ([26fd8d7](https://github.com/PhilibertG/philcn/commit/26fd8d78293015be1c71477f22341c3f0b914e94))
* **slider:** add Slider ([406c467](https://github.com/PhilibertG/philcn/commit/406c467f7342d5147753bd52f981a310eaca7dd1))
* **switch:** add Switch ([2aede00](https://github.com/PhilibertG/philcn/commit/2aede000245b54af55fcfc122b3e1b4229172d50))


### Bug fixes

* **calendar:** drop its own background inside a popover or a card ([67b70e9](https://github.com/PhilibertG/philcn/commit/67b70e9a86573bdaa9aae3d0959f8c75ed7711ac))
* **calendar:** keep the grid from squashing in a narrow container ([1e516db](https://github.com/PhilibertG/philcn/commit/1e516db821b375665b2a9ec700df3083d160cf73))


### Documentation

* clear the phase 5 to-do list ([956dbc8](https://github.com/PhilibertG/philcn/commit/956dbc8bee5299f19b1eb298418cfcfac00a03c0))
* drop the design decisions document ([1cfde68](https://github.com/PhilibertG/philcn/commit/1cfde680a1b5003264228b97c09a436cae961ade))
* mark the phase 5 submenu gap as settled ([8745d9d](https://github.com/PhilibertG/philcn/commit/8745d9df6e313ce30071f78e65d624ebcd21a1cb))
* record Form and the end of phase 6 ([0d88f0f](https://github.com/PhilibertG/philcn/commit/0d88f0fea2fd34b521dc92af39b4b8946b96594a))
* record phase 6 and the submenus ([258eec9](https://github.com/PhilibertG/philcn/commit/258eec9edea680059bce44c3c9c7a272c2e45b2d))
* replace the working notes with a design decisions document ([c853362](https://github.com/PhilibertG/philcn/commit/c8533628ac39a540947f2a3b5e2044e3a562fb47))

## 0.1.0 (2026-09-19)


### Features

* **accordion:** add Accordion ([8934a27](https://github.com/PhilibertG/philcn/commit/8934a2721c62b034a3c8dde99028299e64af3a06))
* **button:** add Button with six variants and four sizes ([ad8548f](https://github.com/PhilibertG/philcn/commit/ad8548ff7d0631981580ddc9127599584b19976f))
* **button:** show a pointer cursor on enabled buttons ([54323f1](https://github.com/PhilibertG/philcn/commit/54323f10e88d4ff0c2c9b747bb478a5157c478b2))
* **command:** add Command and the command palette ([d577860](https://github.com/PhilibertG/philcn/commit/d577860ba437799ebc205c72b94033ba244affff))
* **context-menu:** add ContextMenu ([ab00d00](https://github.com/PhilibertG/philcn/commit/ab00d00d0b0cc1d00453076e3171b8ab8067cd52))
* **dialog:** add Dialog with focus trap, layer stack and scroll lock ([628bf88](https://github.com/PhilibertG/philcn/commit/628bf88d21d2c00914e2a6433409ea73f259d7a9))
* **dialog:** fade a dialog out when another opens on top ([6a333d5](https://github.com/PhilibertG/philcn/commit/6a333d52ba966ab394162d3be4568ef42f92ba7e))
* **drawer:** add Drawer with drag-to-dismiss ([4f6965a](https://github.com/PhilibertG/philcn/commit/4f6965ad7848abd200ab7756d57873bdeb165350))
* **dropdown-menu:** add DropdownMenu ([76083d3](https://github.com/PhilibertG/philcn/commit/76083d3f65002ed4c64d708ad451e57f8eb199a2))
* **lib:** accept readonly arrays in cn ([9ad00d7](https://github.com/PhilibertG/philcn/commit/9ad00d7196c1acb2a08c1c040c5265d7dcab4240))
* **lib:** add cn and variants class utilities ([445420e](https://github.com/PhilibertG/philcn/commit/445420ef97919a1eb3e381da7e7f086acc84f843))
* **lib:** add FocusScope, DismissableLayer and scroll locking ([8ef97b9](https://github.com/PhilibertG/philcn/commit/8ef97b90f7f7f8253213151178d62daa65eb1faa))
* **lib:** add hover opening with delays ([2ad23e0](https://github.com/PhilibertG/philcn/commit/2ad23e0df4814c2c4264f2774e593e3b3d24a3ab))
* **lib:** add list navigation rules ([3d1a3ae](https://github.com/PhilibertG/philcn/commit/3d1a3ae395e0495c975415f5f102b292c2118f58))
* **lib:** add placement mapping and the position engine ([01e9c8a](https://github.com/PhilibertG/philcn/commit/01e9c8a355cdc19db6a49645b0ada9b564c7e7d4))
* **lib:** add Portal ([a4fa32c](https://github.com/PhilibertG/philcn/commit/a4fa32c4bceda1730e9c6e8f6d0995f82b01071f))
* **lib:** add Presence with an exit-animation safety net ([01495c1](https://github.com/PhilibertG/philcn/commit/01495c116a8219783ac581bf9fa84ca368485f00))
* **lib:** add roving focus for keyboard groups ([bee47c1](https://github.com/PhilibertG/philcn/commit/bee47c1868ac788e497bcef861dafdca21a2aa21))
* **lib:** add Slot to support the asChild prop ([82ce018](https://github.com/PhilibertG/philcn/commit/82ce01874e7bc9be064e59065168c96ccdd31c00))
* **lib:** add the command search rules ([21caac9](https://github.com/PhilibertG/philcn/commit/21caac93fa6ebab2c12da542bc68c06215f5ec27))
* **lib:** add the controllable state, callback ref and id hooks ([e6fe14c](https://github.com/PhilibertG/philcn/commit/e6fe14cc11b5cd1e734dadf0ae53d534f6f0f949))
* **lib:** add the drag-to-dismiss arithmetic ([72e4fee](https://github.com/PhilibertG/philcn/commit/72e4fee2bc87a44b3f994e0fbbca14ada156a62e))
* **lib:** add the Floating panel primitive ([e365911](https://github.com/PhilibertG/philcn/commit/e365911d557bc29c1fb9c35bfcede4dba3dccdbf))
* **lib:** add the self-registering list and its keyboard driver ([e2c2d6c](https://github.com/PhilibertG/philcn/commit/e2c2d6c1e7db7d48a923c589113b42b11181472f))
* **lib:** wire drag-to-dismiss to pointer events ([726106a](https://github.com/PhilibertG/philcn/commit/726106a42e59f2055e147596c07e8e6cbd4016e2))
* **menubar:** add Menubar ([80db6de](https://github.com/PhilibertG/philcn/commit/80db6ded9d18207e19a469ba75f6dd15f37a5f9c))
* **navigation-menu:** add NavigationMenu ([bcc0eee](https://github.com/PhilibertG/philcn/commit/bcc0eee8395154cd77ca78368924261aba863f5e))
* **popover:** add Popover ([89f1e12](https://github.com/PhilibertG/philcn/commit/89f1e12b6fc2478e11faac81d65512ba3cbc5116))
* **radio-group:** add RadioGroup ([6e12444](https://github.com/PhilibertG/philcn/commit/6e124449bc8a831747406dbec7033ff08253e254))
* **select:** add Select ([4bcca1a](https://github.com/PhilibertG/philcn/commit/4bcca1a280d44850063c1ad74b7835464ac9c3d7))
* **styles:** add design tokens for light and dark themes ([d97be3f](https://github.com/PhilibertG/philcn/commit/d97be3fc183ef5f17a78ef480b384d209a01bda6))
* **tabs:** add Tabs ([2777359](https://github.com/PhilibertG/philcn/commit/27773596b36f6dcab50d3913ba080afd847602af))
* **toggle-group:** add ToggleGroup ([ee3fbdc](https://github.com/PhilibertG/philcn/commit/ee3fbdc8b3958b9aa09e3bf9b40d425dd7f66920))
* **toggle:** add Toggle ([f28daf2](https://github.com/PhilibertG/philcn/commit/f28daf25e3404196158bf6cb3646df1d80db19b1))
* **ui:** accept both the asChild and render spellings ([d0797bd](https://github.com/PhilibertG/philcn/commit/d0797bd8571d3d6ea9bdbce5d3e7a30047c5f85e))
* **ui:** add AlertDialog and Sheet ([1ca1a5d](https://github.com/PhilibertG/philcn/commit/1ca1a5d208da8ef012bc4d1a08024f02817586c1))
* **ui:** add Label, Input, Textarea, Badge and Card ([db58a4d](https://github.com/PhilibertG/philcn/commit/db58a4db1bcab2fe53771d391afbfa0697a92935))
* **ui:** add the remaining eleven phase 1 components ([86d7008](https://github.com/PhilibertG/philcn/commit/86d7008ba986182aff08e57776afb2877f8165a4))
* **ui:** add Tooltip and HoverCard ([cc10d44](https://github.com/PhilibertG/philcn/commit/cc10d4460e9a7a99c06d1fdca68ba3d5b8236ab2))


### Bug fixes

* **dialog:** hold the scroll lock through the exit animation ([318ed05](https://github.com/PhilibertG/philcn/commit/318ed05665f280899a4eca5e4b9f64413bcc8670))
* **drawer:** follow shadcn's swipeDirection prop ([5b92ae7](https://github.com/PhilibertG/philcn/commit/5b92ae74b63821ebea6816bcb7513548b3a3846c))
* **drawer:** let a tap reach the button under it ([f793596](https://github.com/PhilibertG/philcn/commit/f793596f5499ca652552e64cbbda9dd80cf42616))
* **drawer:** stop the panel flashing back after a drag closes it ([b0502ef](https://github.com/PhilibertG/philcn/commit/b0502ef141172108156129b3acc2d4195b46e495))
* **styles:** animate scale only, never the centring translate ([b25dd35](https://github.com/PhilibertG/philcn/commit/b25dd35627ad091b1043f891dfc452b03a0ecc32))
* **styles:** hold the last animation frame until React unmounts ([0e94dc1](https://github.com/PhilibertG/philcn/commit/0e94dc176ef0024fb963f433c56cedd20bec3945))


### Performance

* **ui:** animate only the properties that actually change ([0231280](https://github.com/PhilibertG/philcn/commit/02312802feedb6c17d1b92fd6be7b8501297e0c3))


### Rewrites

* **lib:** extract ref and prop composition from Slot ([dbaae87](https://github.com/PhilibertG/philcn/commit/dbaae876c8eb3d3abe75073f19e82c161d8a44b8))
* **lib:** extract the shared menu from DropdownMenu ([16716ff](https://github.com/PhilibertG/philcn/commit/16716ff1a391cec3331d60db3d4d490b68bf3b59))
* **lib:** extract the shared overlay core from Dialog ([ab627f9](https://github.com/PhilibertG/philcn/commit/ab627f9800e9adb59f40034923a7b8ef369d192e))


### Documentation

* add MIT license and record the phase 0 decisions ([1cc728f](https://github.com/PhilibertG/philcn/commit/1cc728f692575f7828cb835c13bd1c39114067f2))
* explain the release process in the README ([549e235](https://github.com/PhilibertG/philcn/commit/549e235bad17d4a8ffdf3afe6636aca665625fb5))
* record phase 0 completion in the project brief ([81b9e50](https://github.com/PhilibertG/philcn/commit/81b9e50dfe3f817d4b23de70a1d14b442ae077c0))
* record phase 2 completion in the project brief ([48198d5](https://github.com/PhilibertG/philcn/commit/48198d54385db693b5b6736f471048232429103f))
* record phase 3 completion in the project brief ([5abc381](https://github.com/PhilibertG/philcn/commit/5abc3817c5d167053716ba9a65ee567f2cd7f15a))
* record that there is no deployment target yet ([eb7dc8a](https://github.com/PhilibertG/philcn/commit/eb7dc8a8ad37da9210327fb83ba96d75c682ec89))
* record the animation audit and the new divergences ([6d3467d](https://github.com/PhilibertG/philcn/commit/6d3467dbcaa083d421d22f7b297ab76a30827144))
* record the state after phase 5 ([c767263](https://github.com/PhilibertG/philcn/commit/c7672630a7ac4bea343069540045128532c60e25))
* record the state of phase 3 in the project brief ([75be7e7](https://github.com/PhilibertG/philcn/commit/75be7e79cc9c2b03c37de4d4970d1e9db416f7f2))
* record where phase 4 stands ([56dceb1](https://github.com/PhilibertG/philcn/commit/56dceb143b33755932a4bf7836455211187a4644))
* relax the dependency rule after Phil's correction ([1a23d3d](https://github.com/PhilibertG/philcn/commit/1a23d3d825234e6aef598221abd321ae715ca2fc))
