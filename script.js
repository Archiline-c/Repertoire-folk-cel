// ════════════════════════════════════════════════════════════
//  CONFIGURATION — à adapter une seule fois avec ton dépôt
// ════════════════════════════════════════════════════════════
var GITHUB_UTILISATEUR = "Archiline-c";
var GITHUB_DEPOT = "Repertoire-folk-cel";
var GITHUB_BRANCHE = "main";
var CHEMIN_JSON = "data/morceaux.json";

// URL publique pour LIRE le fichier JSON (pas besoin de token pour lire)
var URL_LECTURE_JSON =
  "https://raw.githubusercontent.com/" + GITHUB_UTILISATEUR + "/" +
  GITHUB_DEPOT + "/" + GITHUB_BRANCHE + "/" + CHEMIN_JSON;

// URL de l'API GitHub pour ÉCRIRE dans le fichier JSON (token nécessaire)
var URL_API_CONTENU =
  "https://api.github.com/repos/" + GITHUB_UTILISATEUR + "/" +
  GITHUB_DEPOT + "/contents/" + CHEMIN_JSON;


// ════════════════════════════════════════════════════════════
//  DONNÉES GLOBALES
// ════════════════════════════════════════════════════════════
var morceaux = [];          // tableau de tous les morceaux chargés depuis GitHub
var shaFichierJson = null;  // identifiant de version du fichier JSON sur GitHub
                             // (l'API GitHub l'exige pour savoir QUELLE version
                             // on modifie, et éviter d'écraser un changement
                             // fait par ailleurs entre-temps)
var tokenGitHub = null;     // reste en mémoire uniquement, jamais sauvegardé

var filtres = {
  statut: "tous",
  danse: "tous",
  recherche: ""
};


// ════════════════════════════════════════════════════════════
//  RÉFÉRENCES AUX ÉLÉMENTS DE LA PAGE
// ════════════════════════════════════════════════════════════
var champToken = document.getElementById("champ-token");
var boutonConnexion = document.getElementById("bouton-connexion");
var statutConnexion = document.getElementById("statut-connexion");

var champRecherche = document.getElementById("champ-recherche");
var compteurResultats = document.getElementById("compteur-resultats");

var conteneurFiltresDanse = document.getElementById("filtres-danse");
var boutonsFiltresStatut = document.querySelectorAll(".bouton-filtre.f-statut");

var formulaire = document.getElementById("formulaire-ajout-morceau");
var champIdEdition = document.getElementById("champ-id-edition");
var champTitre = document.getElementById("champ-titre");
var champArtiste = document.getElementById("champ-artiste");
var champDanse = document.getElementById("champ-danse");
var champStatut = document.getElementById("champ-statut");
var titreFormulaire = document.getElementById("titre-formulaire");
var boutonSoumettre = document.getElementById("bouton-soumettre");
var boutonAnnulerEdition = document.getElementById("bouton-annuler-edition");


// ════════════════════════════════════════════════════════════
//  CHARGEMENT DU JSON DEPUIS GITHUB (lecture, sans token)
// ════════════════════════════════════════════════════════════
function chargerMorceaux() {
  fetch(URL_LECTURE_JSON)
    .then(function(reponse) {
      if (!reponse.ok) {
        throw new Error("Impossible de lire le fichier JSON (code " + reponse.status + ")");
      }
      return reponse.json();
    })
    .then(function(donnees) {
      morceaux = donnees;
      genererBoutonsDanse();
      genererOptionsDanse();
      afficherListe();
    })
    .catch(function(erreur) {
      console.error(erreur);
      var liste = document.getElementById("liste-morceaux");
      liste.innerHTML = "<li class='message-erreur'>Erreur de chargement : " + erreur.message + "</li>";
    });
}


// ════════════════════════════════════════════════════════════
//  GÉNÉRATION DYNAMIQUE DES BOUTONS / OPTIONS DE DANSE
//  (à partir des danses réellement présentes dans le JSON)
// ════════════════════════════════════════════════════════════
function listeDansesUniques() {
  var danses = [];
  for (var i = 0; i < morceaux.length; i++) {
    var d = morceaux[i].danse;
    if (d !== "" && danses.indexOf(d) === -1) {
      danses.push(d);
    }
  }
  danses.sort();
  return danses;
}

function genererBoutonsDanse() {
  var danses = listeDansesUniques();

  for (var i = 0; i < danses.length; i++) {
    var bouton = document.createElement("button");
    bouton.className = "bouton-filtre f-danse";
    bouton.setAttribute("data-filtre", danses[i]);
    bouton.textContent = danses[i];
    bouton.addEventListener("click", gererClicFiltreDanse);
    conteneurFiltresDanse.appendChild(bouton);
  }

  // Le bouton "Tous" déjà présent dans le HTML a aussi besoin de son écouteur
  document.querySelector(".bouton-filtre.f-danse[data-filtre='tous']")
    .addEventListener("click", gererClicFiltreDanse);
}

function genererOptionsDanse() {
  var danses = listeDansesUniques();
  for (var i = 0; i < danses.length; i++) {
    var option = document.createElement("option");
    option.value = danses[i];
    option.textContent = danses[i];
    champDanse.appendChild(option);
  }
}


// ════════════════════════════════════════════════════════════
//  AFFICHAGE DE LA LISTE (filtres + recherche combinés)
// ════════════════════════════════════════════════════════════
function correspondRecherche(morceau, texte) {
  if (texte === "") {
    return true;
  }
  var texteRecherche = texte.toLowerCase();
  var titre = morceau.titre.toLowerCase();
  var artiste = morceau.artiste.toLowerCase();
  return titre.indexOf(texteRecherche) !== -1 || artiste.indexOf(texteRecherche) !== -1;
}

function afficherListe() {
  var liste = document.getElementById("liste-morceaux");
  liste.innerHTML = "";

  var nombreAffiches = 0;

  for (var i = 0; i < morceaux.length; i++) {
    var morceau = morceaux[i];

    var correspondStatut = (filtres.statut === "tous" || morceau.statut === filtres.statut);
    var correspondDanse = (filtres.danse === "tous" || morceau.danse === filtres.danse);
    var correspondTexte = correspondRecherche(morceau, filtres.recherche);

    if (correspondStatut && correspondDanse && correspondTexte) {
      nombreAffiches = nombreAffiches + 1;

      var li = document.createElement("li");
      li.className = "carte-morceau";

      var divTitre = document.createElement("div");
      divTitre.className = "carte-titre";
      divTitre.textContent = morceau.titre;

      var divDetails = document.createElement("div");
      divDetails.className = "carte-details";
      divDetails.textContent = morceau.artiste + " — " + morceau.danse + " — " + morceau.statut;

      var divActions = document.createElement("div");
      divActions.className = "carte-actions";

      var boutonModifier = document.createElement("button");
      boutonModifier.className = "bouton-secondaire";
      boutonModifier.textContent = "Modifier";
      boutonModifier.addEventListener("click", creerGestionnaireModifier(morceau.id));

      var boutonSupprimer = document.createElement("button");
      boutonSupprimer.className = "bouton-danger";
      boutonSupprimer.textContent = "Supprimer";
      boutonSupprimer.addEventListener("click", creerGestionnaireSupprimer(morceau.id));

      divActions.appendChild(boutonModifier);
      divActions.appendChild(boutonSupprimer);

      li.appendChild(divTitre);
      li.appendChild(divDetails);
      li.appendChild(divActions);
      liste.appendChild(li);
    }
  }

  compteurResultats.textContent = nombreAffiches + " morceau(x) affiché(s) sur " + morceaux.length;
}


// ════════════════════════════════════════════════════════════
//  RECHERCHE EN TEMPS RÉEL
// ════════════════════════════════════════════════════════════
champRecherche.addEventListener("input", function() {
  filtres.recherche = champRecherche.value;
  afficherListe();
});


// ════════════════════════════════════════════════════════════
//  GESTION DES FILTRES (statut + danse)
// ════════════════════════════════════════════════════════════
function gererClicFiltreStatut() {
  filtres.statut = this.getAttribute("data-filtre");
  for (var k = 0; k < boutonsFiltresStatut.length; k++) {
    boutonsFiltresStatut[k].classList.remove("actif");
  }
  this.classList.add("actif");
  afficherListe();
}

function gererClicFiltreDanse() {
  filtres.danse = this.getAttribute("data-filtre");
  var boutonsDanse = document.querySelectorAll(".bouton-filtre.f-danse");
  for (var k = 0; k < boutonsDanse.length; k++) {
    boutonsDanse[k].classList.remove("actif");
  }
  this.classList.add("actif");
  afficherListe();
}

for (var j = 0; j < boutonsFiltresStatut.length; j++) {
  boutonsFiltresStatut[j].addEventListener("click", gererClicFiltreStatut);
}
// Les boutons de filtre par danse sont rattachés dans genererBoutonsDanse(),
// une fois que le JSON est chargé et que les boutons existent.


// ════════════════════════════════════════════════════════════
//  CONNEXION GITHUB (saisie du token, en mémoire uniquement)
// ════════════════════════════════════════════════════════════
boutonConnexion.addEventListener("click", function() {
  var valeur = champToken.value.trim();

  if (valeur === "") {
    alert("Merci de saisir un token GitHub pour pouvoir modifier le répertoire.");
    return;
  }

  tokenGitHub = valeur;
  statutConnexion.textContent = "Connecté — modifications possibles";
  statutConnexion.className = "connecte";
  champToken.value = "";
});


// ════════════════════════════════════════════════════════════
//  ÉCRITURE VERS GITHUB (ajout / édition / suppression)
//  Toute modification suit le même principe :
//  1. On modifie le tableau "morceaux" en mémoire
//  2. On envoie le tableau complet à l'API GitHub, qui remplace
//     le contenu du fichier JSON dans le dépôt
// ════════════════════════════════════════════════════════════

// Convertit une chaîne de texte en base64, format exigé par l'API GitHub.
// On passe par encodeURIComponent/decodeURIComponent pour que les accents
// et caractères spéciaux (é, è, ’...) soient correctement encodés.
function texteVersBase64(texte) {
  return btoa(unescape(encodeURIComponent(texte)));
}

function recupererShaActuel(callbackSuite) {
  var enTetes = { "Accept": "application/vnd.github+json" };
  if (tokenGitHub) {
    enTetes["Authorization"] = "token " + tokenGitHub;
  }

  fetch(URL_API_CONTENU, { headers: enTetes })
    .then(function(reponse) {
      if (!reponse.ok) {
        throw new Error("Impossible de récupérer la version actuelle du fichier (code " + reponse.status + ")");
      }
      return reponse.json();
    })
    .then(function(donnees) {
      shaFichierJson = donnees.sha;
      callbackSuite();
    })
    .catch(function(erreur) {
      console.error(erreur);
      alert("Erreur : " + erreur.message);
    });
}

function enregistrerSurGitHub(messageCommit) {
  if (!tokenGitHub) {
    alert("Tu dois d'abord te connecter avec un token GitHub pour enregistrer une modification.");
    return;
  }

  // On récupère systématiquement le sha le plus récent avant d'écrire,
  // pour éviter d'écraser une modification faite depuis un autre appareil.
  recupererShaActuel(function() {
    var contenuJson = JSON.stringify(morceaux, null, 2);

    var corpsRequete = {
      message: messageCommit,
      content: texteVersBase64(contenuJson),
      sha: shaFichierJson,
      branch: GITHUB_BRANCHE
    };

    fetch(URL_API_CONTENU, {
      method: "PUT",
      headers: {
        "Authorization": "token " + tokenGitHub,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(corpsRequete)
    })
      .then(function(reponse) {
        if (!reponse.ok) {
          throw new Error("Échec de l'enregistrement sur GitHub (code " + reponse.status + ")");
        }
        return reponse.json();
      })
      .then(function(donnees) {
        shaFichierJson = donnees.content.sha;
        console.log("Enregistré sur GitHub : " + messageCommit);
      })
      .catch(function(erreur) {
        console.error(erreur);
        alert("Erreur lors de l'enregistrement : " + erreur.message);
      });
  });
}


// ════════════════════════════════════════════════════════════
//  CALCUL DU PROCHAIN IDENTIFIANT DISPONIBLE
// ════════════════════════════════════════════════════════════
function prochainId() {
  var maxId = 0;
  for (var i = 0; i < morceaux.length; i++) {
    if (morceaux[i].id > maxId) {
      maxId = morceaux[i].id;
    }
  }
  return maxId + 1;
}


// ════════════════════════════════════════════════════════════
//  AJOUT / ÉDITION : SOUMISSION DU FORMULAIRE
// ════════════════════════════════════════════════════════════
formulaire.addEventListener("submit", function(event) {
  event.preventDefault();

  var titre = champTitre.value.trim();
  if (titre === "") {
    alert("Le titre est obligatoire !");
    return;
  }

  var idEnEdition = champIdEdition.value;

  if (idEnEdition === "") {
    // ── Cas 1 : ajout d'un nouveau morceau ──
    var nouveauMorceau = {
      id: prochainId(),
      titre: titre,
      artiste: champArtiste.value.trim(),
      danse: champDanse.value,
      statut: champStatut.value
    };
    morceaux.push(nouveauMorceau);
    enregistrerSurGitHub("Ajout : " + titre);

  } else {
    // ── Cas 2 : édition d'un morceau existant ──
    var id = parseInt(idEnEdition, 10);
    for (var i = 0; i < morceaux.length; i++) {
      if (morceaux[i].id === id) {
        morceaux[i].titre = titre;
        morceaux[i].artiste = champArtiste.value.trim();
        morceaux[i].danse = champDanse.value;
        morceaux[i].statut = champStatut.value;
        break;
      }
    }
    enregistrerSurGitHub("Modification : " + titre);
  }

  reinitialiserFormulaire();
  afficherListe();
});


// ════════════════════════════════════════════════════════════
//  PASSAGE EN MODE ÉDITION (bouton "Modifier" d'une carte)
// ════════════════════════════════════════════════════════════
function creerGestionnaireModifier(id) {
  return function() {
    var morceau = null;
    for (var i = 0; i < morceaux.length; i++) {
      if (morceaux[i].id === id) {
        morceau = morceaux[i];
        break;
      }
    }
    if (morceau === null) {
      return;
    }

    champIdEdition.value = morceau.id;
    champTitre.value = morceau.titre;
    champArtiste.value = morceau.artiste;
    champDanse.value = morceau.danse;
    champStatut.value = morceau.statut;

    titreFormulaire.textContent = "Modifier un morceau";
    boutonSoumettre.textContent = "Enregistrer";
    boutonAnnulerEdition.style.display = "inline-block";

    document.getElementById("section-formulaire").scrollIntoView({ behavior: "smooth" });
  };
}

boutonAnnulerEdition.addEventListener("click", function() {
  reinitialiserFormulaire();
});

function reinitialiserFormulaire() {
  champIdEdition.value = "";
  champTitre.value = "";
  champArtiste.value = "";
  champDanse.value = "";
  champStatut.value = "À apprendre";

  titreFormulaire.textContent = "Ajouter un morceau";
  boutonSoumettre.textContent = "Ajouter";
  boutonAnnulerEdition.style.display = "none";
}


// ════════════════════════════════════════════════════════════
//  SUPPRESSION D'UN MORCEAU
// ════════════════════════════════════════════════════════════
function creerGestionnaireSupprimer(id) {
  return function() {
    var morceau = null;
    for (var i = 0; i < morceaux.length; i++) {
      if (morceaux[i].id === id) {
        morceau = morceaux[i];
        break;
      }
    }
    if (morceau === null) {
      return;
    }

    var confirmation = confirm("Supprimer définitivement \"" + morceau.titre + "\" ?");
    if (!confirmation) {
      return;
    }

    morceaux = morceaux.filter(function(m) {
      return m.id !== id;
    });

    enregistrerSurGitHub("Suppression : " + morceau.titre);
    afficherListe();
  };
}


// ════════════════════════════════════════════════════════════
//  DÉMARRAGE
// ════════════════════════════════════════════════════════════
chargerMorceaux();
