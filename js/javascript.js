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

// THEME SWITCHER

// On récupère tous les labels dans le panneau des thèmes
const themeLabels = document.querySelectorAll('.style__switcher label')

// Pour chaque label de thème
themeLabels.forEach((label) => {
    // Quand on clique sur un label
    label.addEventListener('click', () => {
        // On garde la position horizontale actuelle
        const currentX = window.scrollX

        // On garde la position verticale actuelle
        const currentY = window.scrollY

        // Après le clic, on remet la page exactement à la même position
        setTimeout(() => {
            // On empêche la page de remonter au début
            window.scrollTo(currentX, currentY)
        }, 0)
    })
})

// EFFET D'ÉCRITURE DU TEXTE DANS LA PARTIE HERO

// On récupère le texte animé grâce à son id "typing-text"
const typingText = document.querySelector('#typing-text')

// On prépare la liste des compétences qui doivent s'afficher une après l'autre
const typingWords = [
    // Premier texte affiché dans l'animation
    'Développeur Web',

    // Deuxième texte affiché dans l'animation
    'Créateur de sites modernes',

    // Troisième texte affiché dans l'animation
    'Designer UI / UX',

    // Quatrième texte affiché dans l'animation
    'Développeur Fullstack',

    // Cinquième texte affiché dans l'animation
    'Freelance Web'
]

// On vérifie si l'élément du texte animé existe dans le HTML
if (typingText) {
    // On vérifie si l'utilisateur a demandé moins d'animations dans les paramètres de son navigateur
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // On crée l'index du mot actuellement utilisé dans le tableau typingWords
    let wordIndex = 0

    // On crée l'index de la lettre actuellement affichée
    let letterIndex = 0

    // On indique si le texte est actuellement en train de s'effacer
    let isDeleting = false

    // On définit la vitesse d'écriture des lettres
    const typingSpeed = 95

    // On définit la vitesse d'effacement des lettres
    const deletingSpeed = 55

    // On définit le temps d'attente quand le mot est complètement écrit
    const waitingSpeed = 1300

    // Si l'utilisateur préfère réduire les animations
    if (prefersReducedMotion) {
        // On affiche directement le premier texte sans animation
        typingText.textContent = typingWords[0]
    } else {
        // On vide le texte au départ pour éviter un décalage visuel au chargement
        typingText.textContent = ''

        // Fonction principale qui écrit, attend, efface et change de mot
        function typeWriterEffect() {
            // On récupère le mot actuel dans le tableau
            const currentWord = typingWords[wordIndex]

            // Si le texte n'est pas en train de s'effacer
            if (!isDeleting) {
                // On ajoute une lettre à l'affichage
                letterIndex += 1

                // On affiche le mot actuel jusqu'à la lettre en cours
                typingText.textContent = currentWord.substring(0, letterIndex)

                // Si le mot est écrit entièrement
                if (letterIndex === currentWord.length) {
                    // On indique que la prochaine étape sera l'effacement
                    isDeleting = true

                    // On attend avant de commencer à effacer
                    setTimeout(typeWriterEffect, waitingSpeed)

                    // On arrête cette exécution pour respecter le temps d'attente
                    return
                }

                // On relance la fonction après la vitesse d'écriture
                setTimeout(typeWriterEffect, typingSpeed)

                // On arrête cette exécution
                return
            }

            // Si le texte est en train de s'effacer
            if (isDeleting) {
                // On retire une lettre à l'affichage
                letterIndex -= 1

                // On affiche le mot actuel avec une lettre en moins
                typingText.textContent = currentWord.substring(0, letterIndex)

                // Si le mot est complètement effacé
                if (letterIndex === 0) {
                    // On indique que la prochaine étape sera l'écriture
                    isDeleting = false

                    // On passe au mot suivant
                    wordIndex += 1

                    // Si on dépasse le dernier mot
                    if (wordIndex === typingWords.length) {
                        // On revient au premier mot pour faire une boucle infinie
                        wordIndex = 0
                    }
                }

                // On relance la fonction après la vitesse d'effacement
                setTimeout(typeWriterEffect, deletingSpeed)
            }
        }

        // On lance l'effet d'écriture
        typeWriterEffect()
    }
}

// STUDIO DE COMPÉTENCES

// On récupère tous les boutons de filtre de la section compétences
const studioFilterButtons = document.querySelectorAll('[data-studio-filter]')

// On récupère toutes les cartes de technologies de la section compétences
const studioSkillCards = document.querySelectorAll('[data-studio-card]')

// On récupère tous les panneaux de description de la section compétences
const studioSkillPanels = document.querySelectorAll('[data-studio-panel]')

// On récupère le compteur qui affiche le nombre de cartes visibles
const studioVisibleCount = document.querySelector('#skills-visible-count')

// Fonction qui filtre les technologies et les descriptions selon la catégorie choisie
function filterStudioSkills(selectedFilter) {
    // Variable qui va compter les cartes visibles après le filtre
    let visibleCount = 0

    // On parcourt chaque carte de technologie
    studioSkillCards.forEach((card) => {
        // On récupère les catégories inscrites dans l'attribut data-studio-category
        const cardCategories = card.dataset.studioCategory || ''

        // On transforme les catégories en tableau pour pouvoir faire une comparaison propre
        const categoryList = cardCategories.split(' ')

        // On vérifie si on doit afficher la carte ou non
        const shouldShowCard = selectedFilter === 'all' || categoryList.includes(selectedFilter)

        // On cache la carte si elle ne correspond pas au filtre
        card.classList.toggle('is-hidden', !shouldShowCard)

        // Si la carte est visible, on augmente le compteur
        if (shouldShowCard) {
            visibleCount += 1
        }
    })

    // On parcourt chaque panneau descriptif
    studioSkillPanels.forEach((panel) => {
        // On récupère la catégorie du panneau
        const panelCategory = panel.dataset.studioPanel

        // En mode "Toutes", on affiche tous les panneaux ; sinon on affiche seulement le bon panneau
        const shouldShowPanel = selectedFilter === 'all' || panelCategory === selectedFilter

        // On cache ou affiche le panneau selon le filtre
        panel.classList.toggle('is-hidden', !shouldShowPanel)
    })

    // Si le compteur existe, on affiche le nombre de cartes visibles
    if (studioVisibleCount) {
        studioVisibleCount.textContent = visibleCount
    }
}

// On vérifie que la section compétences existe avant d'ajouter les événements
if (studioFilterButtons.length && studioSkillCards.length && studioSkillPanels.length) {
    // On parcourt chaque bouton de filtre
    studioFilterButtons.forEach((button) => {
        // Quand on clique sur un bouton
        button.addEventListener('click', () => {
            // On récupère la catégorie demandée par ce bouton
            const selectedFilter = button.dataset.studioFilter || 'all'

            // On retire l'état actif de tous les boutons
            studioFilterButtons.forEach((filterButton) => {
                // On retire la classe active
                filterButton.classList.remove('active')

                // On indique que le bouton n'est pas sélectionné pour l'accessibilité
                filterButton.setAttribute('aria-pressed', 'false')
            })

            // On ajoute l'état actif sur le bouton cliqué
            button.classList.add('active')

            // On indique que ce bouton est sélectionné pour l'accessibilité
            button.setAttribute('aria-pressed', 'true')

            // On applique le filtre choisi
            filterStudioSkills(selectedFilter)
        })
    })

    // Au chargement, on affiche toutes les compétences
    filterStudioSkills('all')
}

// APPARITION PROGRESSIVE AU SCROLL

// On récupère les éléments qui doivent apparaître progressivement au scroll
const revealElements = document.querySelectorAll(`
    .home__content,
    .home__img-wrapper,
    .about__img-wrapper,
    .about__content,
    .resume__group,
    .services__item,
    .skills__filter,
    .skills__tech-zone,
    .skills__tech-card,
    .skills__insights,
    .skills__panel,
    .work__card,
    .testimonials__item,
    .contact__details,
    .contact__form
`)

// Pour chaque élément à révéler
revealElements.forEach((element, index) => {
    // On ajoute la classe reveal pour cacher l'élément au départ
    element.classList.add('reveal')

    // On ajoute un petit délai différent pour rendre l'apparition plus fluide
    element.style.transitionDelay = `${index * 0.02}s`
})

// On crée un observer pour détecter quand un élément entre dans l'écran
const revealObserver = new IntersectionObserver(
    // Fonction appelée quand les éléments observés changent d'état
    (entries) => {
        // On parcourt chaque élément observé
        entries.forEach((entry) => {
            // Si l'élément entre dans l'écran
            if (entry.isIntersecting) {
                // On ajoute la classe show pour afficher l'élément
                entry.target.classList.add('show')

                // On arrête d'observer cet élément après son apparition
                revealObserver.unobserve(entry.target)
            }
        })
    },
    // Options de l'observer
    {
        // L'effet démarre quand 15% de l'élément est visible
        threshold: 0.15
    }
)

// On observe chaque élément qui doit apparaître au scroll
revealElements.forEach((element) => {
    // On lance l'observation de cet élément
    revealObserver.observe(element)
})

// ENVOI DU FORMULAIRE CONTACT SANS REDIRECTION AVEC TOAST

// Sélectionne le formulaire qui possède l'id "contact-form"
const contactForm = document.querySelector('#contact-form')
// Sélectionne la notification toast globale
const contactToast = document.querySelector('#contact-toast')
// Sélectionne le titre affiché dans le toast
const contactToastTitle = document.querySelector('#contact-toast-title')
// Sélectionne le texte/message affiché dans le toast
const contactToastText = document.querySelector('#contact-toast-text')

// Variable qui servira à stocker le timer du toast
// Cela permet d'annuler un ancien timer avant d'en créer un nouveau
let contactToastTimeout = null

// Fonction qui affiche une notification toast
// type = loading / success / error
// title = titre affiché
// message = texte affiché
function showContactToast(type, title, message) {

    // Vérifie que tous les éléments du toast existent dans le HTML
    // Si un élément manque, on arrête la fonction immédiatement
    if (!contactToast || !contactToastTitle || !contactToastText) return

    // Supprime l'ancien timer si un toast était déjà affiché
    clearTimeout(contactToastTimeout)

    // Retire toutes les anciennes classes du toast
    // Cela permet de réinitialiser son état avant de le réafficher
    contactToast.classList.remove('is-loading', 'is-success', 'is-error', 'show')

    // Force le navigateur à recalculer le rendu du toast
    // Très utile pour relancer correctement les animations CSS
    contactToast.offsetHeight

    // Ajoute la classe "show" pour afficher le toast
    // Ajoute aussi dynamiquement :
    // is-loading OU is-success OU is-error
    contactToast.classList.add('show', `is-${type}`)

    // Change le texte du titre du toast
    contactToastTitle.textContent = title

    // Change le message du toast
    contactToastText.textContent = message

    // Si le toast n'est PAS en mode loading
    // alors on le cache automatiquement après 6 secondes
    if (type !== 'loading') {

        // Lance un timer
        contactToastTimeout = setTimeout(() => {

            // Retire la classe show pour cacher le toast
            contactToast.classList.remove('show')

        }, 6000) // 6000ms = 6 secondes
    }
}

// Vérifie que le formulaire existe avant d'ajouter les événements
if (contactForm) {

    // Écoute l'événement submit du formulaire
    contactForm.addEventListener('submit', async (event) => {

        // Empêche le rechargement/redirection classique du formulaire
        event.preventDefault()

        // Sélectionne le bouton submit du formulaire
        const submitButton = contactForm.querySelector('button[type="submit"]')

        // Sélectionne le champ sujet visible du formulaire
        const contactSubject = document.querySelector('#contact-subject')

        // Sélectionne le champ caché qui permet d'afficher le sujet dans l'e-mail reçu
        const contactSubjectCopy = document.querySelector('#contact-subject-copy')

        // Copie la valeur du sujet visible dans le champ caché avant de créer FormData
        if (contactSubject && contactSubjectCopy) {
            contactSubjectCopy.value = contactSubject.value
        }

        // Récupère automatiquement toutes les données du formulaire
        // (nom, email, message, etc.)
        const formData = new FormData(contactForm)

        // Vérifie que le bouton existe
        if (submitButton) {

            // Désactive le bouton pendant l'envoi
            // pour éviter plusieurs clics
            submitButton.disabled = true

            // Change le texte du bouton
            submitButton.textContent = 'Envoi...'
        }

        // Affiche le toast de chargement
        showContactToast(

            // Type du toast
            'loading',

            // Titre du toast
            'Envoi du message',

            // Message affiché
            'Patientez quelques secondes, votre message est en cours d’envoi.'
        )

        // Bloc try = essaye d'exécuter le code
        try {

            // Envoie les données vers le serveur avec fetch
            const response = await fetch(contactForm.action, {

                // Méthode HTTP utilisée
                method: 'POST',

                // Données envoyées
                body: formData,

                // Headers HTTP
                headers: {
                    // Demande une réponse JSON
                    Accept: 'application/json'
                }
            })

            // Vérifie si la requête a réussi
            // response.ok = true si statut 200-299
            if (response.ok) {

                // Réinitialise tous les champs du formulaire
                contactForm.reset()

                // Affiche un toast succès
                showContactToast(
                    // Type du toast
                    'success',

                    // Titre
                    'Message envoyé avec succès',

                    // Message
                    'Merci pour votre message. Je vous répondrai dès que possible.'
                )

            } else {

                // Affiche un toast erreur si le serveur répond avec une erreur
                showContactToast(

                    // Type du toast
                    'error',

                    // Titre
                    'Erreur lors de l’envoi',

                    // Message
                    'Le message n’a pas pu être envoyé. Veuillez réessayer.'
                )
            }

        // Bloc catch = exécuté si erreur réseau/internet
        } catch (error) {

            // Affiche une erreur de connexion
            showContactToast(

                // Type du toast
                'error',

                // Titre
                'Connexion impossible',

                // Message
                'Vérifiez votre connexion internet puis réessayez.'
            )

        // Bloc finally = exécuté dans tous les cas
        // succès OU erreur
        } finally {

            // Vérifie que le bouton existe
            if (submitButton) {

                // Réactive le bouton
                submitButton.disabled = false

                // Remet le texte normal du bouton
                submitButton.textContent = 'Envoyer'
            }
        }
    })
}

// BOUTON RETOUR EN HAUT

// On récupère le bouton qui permet de remonter en haut de la page
const backToTopButton = document.querySelector('#back-to-top')

// Fonction qui affiche ou cache le bouton selon la position du scroll
function toggleBackToTopButton() {
    // Si le bouton n'existe pas dans le HTML, on arrête la fonction
    if (!backToTopButton) return

    // Si l'utilisateur a scrollé assez bas, on affiche le bouton
    if (window.scrollY > 450) {
        backToTopButton.classList.add('show')
    } else {
        backToTopButton.classList.remove('show')
    }
}

// Si le bouton existe
if (backToTopButton) {
    // Quand on clique sur le bouton, on remonte doucement tout en haut
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    })
}

// À chaque scroll, on vérifie si le bouton doit apparaître ou disparaître
document.addEventListener('scroll', toggleBackToTopButton)

// On vérifie aussi une première fois au chargement de la page
toggleBackToTopButton()