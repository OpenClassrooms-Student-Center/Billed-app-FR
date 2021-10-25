allez à l'adresse : `http://127.0.0.1:5500/

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

`http://127.0.0.1:5500/coverage/lcov-report/`

*** kaban ***
https://www.notion.so/b89da851ea464aa5ae1410ab6ff641f7?v=ff980f9c9340411db9c6d803c3918002

*** projet OCR ***
https://openclassrooms.com/fr/paths/314/projects/809/assignment

*** TODO ***
- composant views/Bills : faire passer le taux de couverture à 100% 
- composant container/Bills à passer au vert :
    - Ouvrir tous les "statements" sauf les appels au back-end firebase
    - Ajouter un test d'intégration GET Bills.