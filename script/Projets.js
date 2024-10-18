/////////////////////////////////////////////////////
// //////Gestion des projets via le backend /////////
/////////////////////////////////////////////////////
const projects = document.querySelector(".gallery")
const filters = document.querySelector(".sort")
const btnAll = document.getElementById("0")
async function getWorks() {
    try { 
        const response = await fetch("http://localhost:5678/api/works")
        return await response.json()
    } catch {
        const p = document.createElement("p")
        p.classList.add("error")
        p.innerHTML = "Une erreur est survenue lors de la récupération des projets<br><br><br>Si le problème persiste, veuillez contacter l'administrateur du site";
        projects.appendChild(p)
    }
}

async function displayWorksByCategory(categoryId) {
    const arrayWorks = await getWorks()
    let filteredWorks
    if (categoryId === null) {
        filteredWorks = arrayWorks
    } else {
        filteredWorks = arrayWorks.filter(work => work.categoryId === categoryId)
    }
    projects.innerHTML = ''
    
    filteredWorks.forEach(work => {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        const figCaption = document.createElement("figcaption");
        figCaption.textContent = work.title;

        figure.classList.add(".gallery");
        figure.appendChild(img);
        figure.appendChild(figCaption);
        projects.appendChild(figure);
    });
}

async function displayWorks() {
    displayWorksByCategory(null)
}

async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories")
    return await response.json();
}

async function displayCategoriesBtn() {
    const categories = await getCategories();
    const categoryIds = categories.map(categorie => categorie.id)
    categories.forEach(categorie => {
        const btn = document.createElement("button");
        btn.textContent = categorie.name;
        btn.id = categorie.id;
        filters.appendChild(btn);
        btn.classList.add("sortBtn");
        
        btn.addEventListener('click', () => {
            // Supprimer la classe 'sortBtn--active' de tous les boutons
            document.querySelectorAll('.sortBtn').forEach((btn) => {
                btn.classList.remove('sortBtn-active')
            })
            btn.classList.add('sortBtn-active'); // Ajouter la classe 'sortBtn--active' au bouton cliqué
            displayWorksByCategory(categorie.id);
        });
    });
}
displayWorks();
getCategories();
displayCategoriesBtn();
