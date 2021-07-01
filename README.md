**GitHub Page**

Lien vers la GitHub Page : [GitHubPage]( https://louisdc98.github.io/Billed-app-FR/)

**Liste des bugs à corriger** :

[TO DO liste](https://www.notion.so/a7a612fc166747e78d95aa38106a55ec?v=2a8d3553379c4366b6f66490ab8f0b90)

**Comment lancer l'application en local** :

Clonez le projet :
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR.git
```

Allez au repo cloné :
```
$ cd Billed-app-FR
```

Installez les packages npm (décrits dans `package.json`) :
```
$ npm install
```

Installez live-server pour lancer un serveur local :
```
$ npm install -g live-server
```

Lancez l'application :
```
$ live-server
```

Puis allez à l'adresse : `http://127.0.0.1:8080/`


**Comment lancer tous les tests en local avec Jest :**

```
$ npm run test
```

**Comment lancer un seul test :**

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

**Comment voir la couverture de test :**

`http://127.0.0.1:8080/coverage/lcov-report/`


