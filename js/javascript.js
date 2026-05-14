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


// NAVIGATION MOBILE + ACTIVE LINK

// On récupère tous les liens de navigation
const navLinks = document.querySelectorAll('.nav__link')

// On récupère le bouton hamburger
const hamburger = document.querySelector('.nav__toggle')

// On récupère la liste du menu mobile
const mobileMenu = document.querySelector('.nav__list')

// On récupère le header pour lui ajouter une ombre au scroll
const header = document.querySelector('.header')

// Pour chaque lien de navigation
navLinks.forEach((link) => {
    // Si le lien n'a pas encore l'attribut data-after
    if (!link.dataset.after) {
        // On ajoute automatiquement data-after avec le texte du lien
        link.dataset.after = link.textContent.trim()
    }
})

// Fonction pour ouvrir ou fermer le menu mobile
function toggleMobileMenu() {
    // Si le hamburger ou le menu n'existe pas, on arrête la fonction
    if (!hamburger || !mobileMenu) return

    // On ajoute ou retire la classe active sur le hamburger
    hamburger.classList.toggle('active')

    // On ajoute ou retire la classe active sur le menu mobile
    mobileMenu.classList.toggle('active')

    // On bloque ou débloque le scroll du body quand le menu est ouvert
    document.body.classList.toggle('menu-open')
}

// Fonction pour fermer le menu mobile
function closeMobileMenu() {
    // Si le hamburger ou le menu n'existe pas, on arrête la fonction
    if (!hamburger || !mobileMenu) return

    // On retire la classe active du hamburger
    hamburger.classList.remove('active')

    // On retire la classe active du menu mobile
    mobileMenu.classList.remove('active')

    // On débloque le scroll du body
    document.body.classList.remove('menu-open')
}

// Si le hamburger existe
if (hamburger) {
    // Quand on clique dessus, on ouvre ou ferme le menu mobile
    hamburger.addEventListener('click', toggleMobileMenu)
}

// Fonction pour retirer la classe active-link de tous les liens
function removeActiveLinks() {
    // On parcourt tous les liens
    navLinks.forEach((link) => {
        // On retire la classe active-link du lien
        link.classList.remove('active-link')
    })
}

// Fonction pour activer le bon lien selon le hash actuel
function activateLinkByHash(hash) {
    // Si aucun hash n'est trouvé, on considère que la section active est #home
    const currentHash = hash || '#home'

    // On cherche le lien qui correspond au hash actuel
    const currentLink = document.querySelector(`.nav__link[href="${currentHash}"]`)

    // Si le lien correspondant existe
    if (currentLink) {
        // On retire active-link sur tous les liens
        removeActiveLinks()

        // On ajoute active-link uniquement sur le lien actuel
        currentLink.classList.add('active-link')
    }
}

// Pour chaque lien du menu
navLinks.forEach((link) => {
    // Quand on clique sur un lien
    link.addEventListener('click', () => {
        // On active directement le lien cliqué
        activateLinkByHash(link.getAttribute('href'))

        // On ferme le menu mobile après le clic
        closeMobileMenu()
    })
})

// Quand la page est chargée
window.addEventListener('load', () => {
    // On active le bon lien selon le hash actuel ou #home par défaut
    activateLinkByHash(window.location.hash || '#home')
})

// Quand le hash change dans l'URL
window.addEventListener('hashchange', () => {
    // On active le lien correspondant au nouveau hash
    activateLinkByHash(window.location.hash || '#home')
})


// ACTIVE LINK AU SCROLL

// On récupère toutes les sections qui ont un id dans le main
const sections = document.querySelectorAll('main section[id]')

// Fonction pour activer automatiquement le bon lien pendant le scroll
function activateLinkOnScroll() {
    // Si aucune section n'existe, on arrête la fonction
    if (!sections.length) return

    // Par défaut, on considère que la section active est #home
    let currentSectionHash = '#home'

    // On ajoute 160px pour détecter la section un peu avant le haut exact
    const scrollPosition = window.scrollY + 160

    // On parcourt toutes les sections
    sections.forEach((section) => {
        // On récupère la position haute de la section
        const sectionTop = section.offsetTop

        // On récupère la position basse de la section
        const sectionBottom = sectionTop + section.offsetHeight

        // On construit le hash de la section, exemple : #about
        const sectionHash = `#${section.getAttribute('id')}`

        // Si la position actuelle du scroll est dans cette section
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            // Alors cette section devient la section active
            currentSectionHash = sectionHash
        }
    })

    // On active le lien correspondant à la section visible
    activateLinkByHash(currentSectionHash)
}

// Quand l'utilisateur scrolle
document.addEventListener('scroll', () => {
    // Si le header existe
    if (header) {
        // Si on a scrollé plus de 250px
        if (window.scrollY > 250) {
            // On ajoute une classe pour donner un style au header
            header.classList.add('scrolled')
        } else {
            // Sinon on retire cette classe
            header.classList.remove('scrolled')
        }
    }

    // On met à jour le lien actif selon la section visible
    activateLinkOnScroll()
})
