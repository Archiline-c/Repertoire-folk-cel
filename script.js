// ── Données globales ──
var morceaux = [];
var filtres = {
  statut: "tous",
  danse: "tous"
};

// ── Références aux boutons de filtre ──
var boutonsFiltres = document.querySelectorAll(".bouton-filtre");
var boutonsFiltresStatut = document.querySelectorAll(".bouton-filtre.f-statut");
var boutonsFiltresDanse = document.querySelectorAll(".bouton-filtre.f-danse");


// ── Affichage de la liste ──
function afficherListe() {
  var liste = document.getElementById("liste-morceaux");
  liste.innerHTML = "";

  for (var i = 0; i < morceaux.length; i++) {
    if (
      (filtres.statut === "tous" || morceaux[i].statut === filtres.statut) &&
      (filtres.danse === "tous" || morceaux[i].danse === filtres.danse)
    ) {
      var li = document.createElement("li");
      li.className = "carte-morceau";
      li.innerHTML =
        "<div class='carte-titre'>" + morceaux[i].titre + "</div>" +
        "<div class='carte-details'>" +
          morceaux[i].artiste + " — " +
          morceaux[i].danse + " — " +
          morceaux[i].statut +
        "</div>";
      liste.appendChild(li);
    }
  }
}


// ── Ajout d'un morceau ──
document.getElementById("formulaire-ajout-morceau").addEventListener("submit", function(event) {
  event.preventDefault();

  var titre = document.getElementById("champ-titre").value;

  if (titre !== "") {
    var morceau = {
      titre: titre,
      artiste: document.getElementById("champ-artiste").value,
      danse: document.getElementById("champ-danse").value,
      statut: document.getElementById("champ-statut").value
    };

    morceaux.push(morceau);

    document.getElementById("champ-titre").value = "";
    document.getElementById("champ-artiste").value = "";
    document.getElementById("champ-danse").value = "";
    document.getElementById("champ-statut").value = "À apprendre";

    afficherListe();
    console.log("Nombre de morceaux : " + morceaux.length);

  } else {
    alert("Le titre est obligatoire !");
  }
});


// ── Gestion des filtres ──
for (var j = 0; j < boutonsFiltres.length; j++) {
  boutonsFiltres[j].addEventListener("click", function() {

    if (this.classList.contains("f-statut")) {
      filtres.statut = this.getAttribute("data-filtre");
      for (var k = 0; k < boutonsFiltresStatut.length; k++) {
        boutonsFiltresStatut[k].classList.remove("actif");
      }

    } else if (this.classList.contains("f-danse")) {
      filtres.danse = this.getAttribute("data-filtre");
      for (var k = 0; k < boutonsFiltresDanse.length; k++) {
        boutonsFiltresDanse[k].classList.remove("actif");
      }
    }

    this.classList.add("actif");
    afficherListe();
  });
}