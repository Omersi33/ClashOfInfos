# APPLICATION

Cette application a pour but de consulter les informations des joueurs et des clans dans Clash of Clans.



# FONCTIONNALITÉS

- Authentification (inscription/connexion/déconnexion)
- Mise à jour du profil (photo, pseudo)
- Recherche de joueurs via le gamertag
- Appairage de comptes via le token récupérable depuis les paramètres du jeu Clash of Clans
- Affichage automatique des comptes apparaiés
- Recherche de clans via le clantag
- Affichage automatique des clans dont au moins un joueur est appairé



# Lancement

-> Après avoir cloné le dépôt git, il faudra modifier le fichier config/apiConfig.ts.
Dans ce fichier se trouve deux *const* dont **API_KEY** qui est vide. Il faut lui donner une clé API de Clash of Clans. Pour ce faire :
- Visiter le site https://developer.clashofclans.com/#/
- Créer un compte (rapide)
- Cliquer sur ***My account***, puis sur *Create New Key*
- Remplir les champs ***Key Name*** et ***Description*** puis ajouter sa propre adresse IP.
- Enfin, appuyer sur ***Create Key*** et récupérer le ***Token***
- Ajouter ce token dans **API_KEY** du fichier config/apiConfig.ts
Pourquoi tout ça ? Malheureusement, seule une clé API ne suffit pas pour pouvoir utiliser l'API de Clash of Clans, il faut aussi donner le droit via l'adresse IP.

-> Entrer la commande `npm i`

-> Entrer la commande `npm start`

L'application est maintenant lancée !



# Compte

Si vous n'avez pas le jeu Clash of Clans (pour tester par exemple l'appairage), vous pouvez toujours vous connecter sur le compte suivant qui a trois comptes Clash of Clans appairés :
- a@a.com
- 123456