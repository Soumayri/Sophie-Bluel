/////////////////////////////////////////////////////
// //////Gestion du logIn ///////////////////////////
/////////////////////////////////////////////////////
const alreadyLoggedError = document.querySelector(".alreadyLogged-error"); 
const loginEmailError = document.querySelector(".loginEmail-error"); 
const loginMdpError = document.querySelector(".loginMdp-error"); 
const email = document.getElementById("email")
const password = document.getElementById("password")
const submit = document.getElementById("submit")



alreadyLogged();

//////////////// Si l'utilisateur est déjà connecté, on supprime le token//////////////////
function alreadyLogged() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");

        const p = document.createElement("p");
        p.innerHTML = ""
        p.classList.add = ".error"
        alreadyLoggedError.appendChild(p);
        return;
    }
}

//////////////////////// Au clic, on envoie les valeurs de connexion////////////
submit.addEventListener("click", () => {
    let user = {
        email: email.value,
        password: password.value
    };
    login(user);
})

///////////////////// Fonction de connexion ////////////////////////////
function login(id) {
    console.log(id);
    loginEmailError.innerHTML = "";
    loginMdpError.innerHTML = "";
    //////// verification de l'email ///////////
    if (!id.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Veuillez entrer une adresse mail valide";
        loginEmailError.appendChild(p);
        return;
    }
    //////// verifcation du mot de passe /////////
    if (id.password.length < 5 && !id.password.match(/^[a-zA-Z0-9]+$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Veuillez entrer un mot de passe valide";
        loginMdpError.appendChild(p);
        return;
    }

    else {
    //////////// verification de l'email et du mot de passe /////////////
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(id)
    })
    .then(response => response.json())
    .then(result => { 

        ///////// Si couple email/mdp incorrect /////////
        if (result.error || result.message) {
            const p = document.createElement("p")
            p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte"
            loginMdpError.appendChild(p)

        //////////// Si couple email/mdp correct /////////
        } else if (result.token) {
            localStorage.setItem("token", result.token)
            window.location.href = "index.html"
            
        }
    
    })
    
    
    
}
}
