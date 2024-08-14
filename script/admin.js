/////////////////////////////////////////////////////
// //////Gestion des modules administrateur /////////
/////////////////////////////////////////////////////
// INDEX : 1- GESTION BOITE MODALE                 //
//         2- GESTION TOKEN LOGIN                  //
//         3- GENERATION DS LA MODALE              //
//         4- GESTION SUPPRESSION PROJET           //
//         5- GESTION AJOUT PROJET                 //
//         6- GESTION AJOUT D'UN PROJET            //
/////////////////////////////////////////////////////
// INDEX : 1-// GESTION BOITE MODALE ////////////////
/////////////////////////////////////////////////////

///////////// Reset la section projets ///////////////
function resetModaleSectionProjets() {  
    modaleSectionProjets.innerHTML = "";
}

///////////// Ouverture de la modale //////////////////
let modale = null;
let dataAdmin;
const modaleSectionProjets = document.querySelector(".js-admin-projets");

const openModale = function(e) {
    e.preventDefault();
    modale = document.querySelector(e.target.getAttribute("href"));

    modaleProjets(); // Génère les projets dans la modale admin

    // Attendre la fin de la génération des projets
    setTimeout(() => {
        modale.style.display = null;
        modale.removeAttribute("aria-hidden");
        modale.setAttribute("aria-modal", "true");
    }, 25);

    // Ajout EventListener sur les boutons pour ouvrir la modale projet
    document.querySelectorAll(".js-modale-projet").forEach(a => {
        a.addEventListener("click", openModaleProjet);
    });
    
    // Appel fermeture modale
    modale.addEventListener("click", closeModale);
    modale.querySelector(".js-modale-close").addEventListener("click", closeModale);
    modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation);
};

//////////////////////////////// Genere les projets dans la modale admin ///////////////////////
async function modaleProjets() { 
    const response = await fetch('http://localhost:5678/api/works');
    dataAdmin = await response.json();
    resetModaleSectionProjets();
    for (let i = 0; i < dataAdmin.length; i++) {
        
        const div = document.createElement("div");
        div.classList.add("gallery__item-modale");
        modaleSectionProjets.appendChild(div);

        const img = document.createElement("img");
        img.src = dataAdmin[i].imageUrl;
        img.alt = dataAdmin[i].title;
        div.appendChild(img);

        const p = document.createElement("p");
        div.appendChild(p);
        p.classList.add(dataAdmin[i].id, "js-delete-work");

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can");
        p.appendChild(icon);

        const a = document.createElement("a");
        div.appendChild(a);
    }
    deleteWork();
}

/////////////////////////////  Ferme la modale ///////////////////////////
const closeModale = function(e) {
    e.preventDefault();
    if (modale === null) return;

    modale.setAttribute("aria-hidden", "true");
    modale.removeAttribute("aria-modal");
    modale.style.display = "none";

    modale.querySelector(".js-modale-close").removeEventListener("click", closeModale);
    modale.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation);
    modale.removeEventListener("click", closeModale);

    modale = null;
   
};

///////////////////// Définit la "border" du click pour fermer la modale ////////////////
const stopPropagation = function(e) {
    e.stopPropagation();
};

//////////////// Selectionne les éléments qui ouvrent la modale /////////////////////////
document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModale);
});

/////////////////  Ferme la modale avec la touche echap ////////////////////////
window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModale(e);
        closeModaleProjet(e);
    }
});

////////////////////////////////////////////////////
// INDEX : 2- GESTION TOKEN LOGIN //////////////////
////////////////////////////////////////////////////

////////////////////////////////// Récupération du token ////////////////////////////////////////
const token = localStorage.getItem("token");
const AlreadyLogged = document.querySelector(".js-already-logged");

adminPanel();

///////////////////////////////// Gestion de l'affichage des boutons admin ///////////////////////
function adminPanel() {
    document.querySelectorAll(".admin__modifer").forEach(a => {
        if (token === null) {
            return;
        } else {
            a.removeAttribute("aria-hidden");
            a.removeAttribute("style");
            AlreadyLogged.innerHTML = "logout";
            AlreadyLogged.classList.add('logOut-btn')
            AlreadyLogged.addEventListener('click', function() {
                if (AlreadyLogged.innerHTML === "logout") {
                    window.location.href = 'login.html'; // Redirection vers login.html
                }
            });
        }
    });
}

const sort = document.querySelector(".sort");
if (token !== null) {
    sort.style.display = "none";
}

////////////////////////////////////////////////////////////
// INDEX : 3-GESTION SUPPRESSION D'UN PROJET ////////////
////////////////////////////////////////////////////////////

/////////////////////////// Event listener sur les boutons supprimer par rapport a leur id /////////////////////
function deleteWork() {
    let btnDelete = document.querySelectorAll(".js-delete-work");
    btnDelete.forEach(btn => {
        btn.addEventListener("click", deleteProjets);
    });
}

/////////////////////////////// Supprimer le projet //////////////////////////////////

async function deleteProjets(e) {
    e.preventDefault();
    const target = e.currentTarget;
    await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        if (response.status === 204) {
            const projet = document.querySelector(`.js-projet-${this.classList[0]}`);
            if (projet) {
                projet.remove(); 
            }
            target.closest(".gallery__item-modale").remove();
            displayWorks();
            modaleProjets();
        } else if (response.status === 401) {
            alert("Vous n'êtes pas autorisé à supprimer ce projet, merci de vous connecter avec un compte valide");
            window.location.href = "login.html";
        }
    })
    .catch(error => {
        console.error("Erreur:", error);
    });
}


/////////////////////////////////// Rafraichit les projets sans recharger la page /////////////////////////
async function refreshPage(i) {
    modaleProjets(); // Re lance une génération des projets dans la modale admin

    // Supprime le projet de la page d'accueil
    const projet = document.querySelector(`.js-projet-${i}`);
    if (projet) {
        projet.style.display = "none";
    }
}

////////////////////////////////////////////////////
// INDEX : 4-/ GESTION BOITE MODALE AJOUT PROJET ///
////////////////////////////////////////////////////

////////////////////////////////// Ouverture de la modale projet //////////////////////////////
let modaleProjet = null;
const openModaleProjet = function(e) {
    e.preventDefault();
    modaleProjet = document.querySelector(e.target.getAttribute("href"));

    modaleProjet.style.display = null;
    modaleProjet.removeAttribute("aria-hidden");
    modaleProjet.setAttribute("aria-modal", "true");

    // Appel fermeture modale
    modaleProjet.addEventListener("click", closeModaleProjet);
    modaleProjet.querySelector(".js-modale-close").addEventListener("click", closeModaleProjet);
    modaleProjet.querySelector(".js-modale-stop").addEventListener("click", stopPropagation);
    modaleProjet.querySelector(".js-modale-return").addEventListener("click", backToModale);
};

//////////////////////// Fermeture de la modale projet ///////////////////////:
const closeModaleProjet = function(e) {
    if (modaleProjet === null) return;

    modaleProjet.setAttribute("aria-hidden", "true");
    modaleProjet.removeAttribute("aria-modal");

    modaleProjet.querySelector(".js-modale-close").removeEventListener("click", closeModaleProjet);
    modaleProjet.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation);

    modaleProjet.style.display = "none";
    modaleProjet = null;
     location.reload();

    closeModale(e);
};

//////////////////////////// Retour au modale admin ///////////////////////////
const backToModale = function(e) {
    e.preventDefault();
    modaleProjet.style.display = "none";
    modaleProjet = null;
    modaleProjets(dataAdmin);
};

////////////////////////////////////////////////////
// INDEX : 5-/ GESTION AJOUT D'UN PROJET        ///
////////////////////////////////////////////////////

const btnAjouterProjet = document.querySelector(".js-add-work");
btnAjouterProjet.addEventListener("click", function(event) {
    addWork(event);
});

///////////////////////////// Ajouter un projet //////////////////////////:
async function addWork(event) {
    event.preventDefault();

    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const image = document.querySelector(".js-image").files[0];

    if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Merci de choisir une catégorie valide");
        return;
    } else {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 201) {
                alert("Projet ajouté avec succès :)");
                 closeModale(event);
                modaleProjets(dataAdmin);
            } else if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    }
}

/////////////////////////// Aperçu des photos //////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const pictureInput = document.querySelector("#photo");
    const picturePreviewImg = document.querySelector("#picturePreviewImg");
    const picturePreviewDiv = document.querySelector("#picturePreview");
    const labelPhoto = document.querySelector("#labelPhoto");
    const iconPhoto = document.querySelector("#iconPhoto");

    pictureInput.addEventListener("change", picturePreview);

    function picturePreview() {
        const [file] = pictureInput.files;
        if (file) {
            picturePreviewImg.src = URL.createObjectURL(file);
            picturePreviewDiv.style.display = "flex";
            labelPhoto.style.display = "none";
            iconPhoto.style.display = "none";
        } else {
            picturePreviewDiv.style.display = "none";
            labelPhoto.style.display = "block";
            iconPhoto.style.display = "block";
            picturePreviewImg.src = "";
        }
    }

    
   

    
});
