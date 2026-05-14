// CHARGEMENT DE LA PAGE

// On récupère l'élément du chargement dans le HTML grâce à son id "page-loader"
const pageLoader = document.querySelector('#page-loader')

// On crée une variable pour savoir si le chargement a déjà été masqué ou non
let loaderAlreadyHidden = false

// Fonction qui permet de masquer l'écran de chargement
function hidePageLoader() {
    // Si le loader a déjà été masqué, on arrête la fonction pour éviter de répéter l'action
    if (loaderAlreadyHidden) return

    // On indique maintenant que le loader est déjà masqué
    loaderAlreadyHidden = true

    // Si le loader n'existe pas dans le HTML, on retire quand même le blocage du body
    if (!pageLoader) {
        // On enlève la classe qui bloque le scroll de la page
        document.body.classList.remove('is-loading')

        // On arrête la fonction ici
        return
    }

    // On ajoute la classe qui lance l'animation de disparition du loader
    pageLoader.classList.add('hide-loader')

    // On enlève la classe qui empêchait de scroller pendant le chargement
    document.body.classList.remove('is-loading')

    // Après l'animation, on supprime complètement le loader du HTML
    setTimeout(() => {
        // On vérifie encore que le loader existe avant de le supprimer
        if (pageLoader) {
            // On supprime le loader pour ne plus le garder dans la page
            pageLoader.remove()
        }
    }, 800)
}

// Le loader va durer maximum 5 secondes, puis disparaître automatiquement
setTimeout(() => {
    // On masque le loader après 5 secondes
    hidePageLoader()
}, 5000)