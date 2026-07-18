import {
    FileText, BarChart3, Users, Shield,
    Zap, Download, Smartphone, TrendingUp, Mail,
    Clock, Globe, Lock, Euro,
} from "lucide-react"

export const MODULES = [
    {
        Icon: Shield,
        color: "#6366f1",
        title: "Authentification sécurisée",
        tagline: "Accès protégé à votre espace",
        desc: "Sécurité renforcée par JWT, mots de passe hashés bcrypt, et gestion stricte des rôles artisan/admin. Blacklist Redis pour des déconnexions instantanées.",
        points: [
            "Authentification JWT robuste",
            "Mots de passe bcrypt (salted)",
            "Rôles artisan / administrateur",
            "Blacklist Redis au logout",
            "Isolation stricte des données",
        ],
    },
    {
        Icon: Users,
        color: "#0ea5e9",
        title: "Gestion clients",
        tagline: "Centralisez votre base clients",
        desc: "Fiches clients complètes avec historique intégré. Retrouvez instantanément les coordonnées, devis et factures de chaque partenaire.",
        points: [
            "Fiche client détaillée",
            "Historique devis et factures",
            "Recherche instantanée",
            "Gestion des adresses et contacts",
            "Interface épurée et réactive",
        ],
    },
    {
        Icon: FileText,
        color: "#16A34A",
        title: "Devis professionnels",
        tagline: "Réactivité et professionnalisme",
        desc: "Créez des devis PDF sobres et experts. Personnalisez vos lignes, gérez la TVA et transformez vos devis acceptés en factures en un clic.",
        points: [
            "7 templates pro et neutres",
            "Calcul TVA automatique",
            "Workflow : Brouillon → Envoyé → Accepté",
            "Transformation facture en 1 clic",
            "Filtre grayscale sur votre logo",
        ],
    },
    {
        Icon: Euro,
        color: "#f59e0b",
        title: "Facturation experte",
        tagline: "Conformité et clarté",
        desc: "Générez des factures légales avec numérotation séquentielle personnalisable. Suivez l'état de vos paiements en temps réel sur votre dashboard.",
        points: [
            "Numérotation automatique",
            "Préfixes personnalisables",
            "Suivi des paiements (Payée, Retard)",
            "Mentions légales intégrées",
            "Génération PDF haute qualité",
        ],
    },
    {
        Icon: Mail,
        color: "#8b5cf6",
        title: "Communication & Support",
        tagline: "Échanges fluides et archivage",
        desc: "Envoyez vos documents par email directement. Profitez d'un support dédié intégré à votre dashboard pour toute assistance technique.",
        points: [
            "Envoi direct par email",
            "Templates d'emails sobres",
            "Support technique intégré",
            "Messagerie stockée (MongoDB)",
            "Suivi des demandes admin",
        ],
    },
    {
        Icon: BarChart3,
        color: "#ec4899",
        title: "Pilotage d'activité",
        tagline: "Visualisez votre croissance",
        desc: "Dashboard complet affichant votre CA, vos impayés et votre taux de conversion. Archivage automatique de vos données avant toute suppression de compte.",
        points: [
            "Chiffre d'affaires mensuel",
            "Taux de conversion devis",
            "Top clients et statistiques",
            "Alerte factures en retard",
            "Archive PDF avant suppression",
        ],
    },
] as const

export const FEATURES = [
    { Icon: Zap,        title: "Devis en 3 minutes",    desc: "Réactivité maximale pour vos clients avec des PDF générés instantanément." },
    { Icon: Mail,       title: "Envoi par email",       desc: "Communiquez vos devis et factures d'un simple clic sans quitter l'application." },
    { Icon: Download,   title: "Archivage sécurisé",    desc: "Archive complète de vos données générée automatiquement avant départ." },
    { Icon: Smartphone, title: "Optimisé mobile",        desc: "Interface responsive pensée pour gérer votre entreprise depuis le chantier." },
    { Icon: TrendingUp, title: "Analyse en temps réel", desc: "CA et santé financière visibles immédiatement sur votre tableau de bord." },
    { Icon: Euro,       title: "Templates experts",     desc: "7 styles de documents sobres pour une image de marque professionnelle." },
] as const

export const EXTRAS = [
    { Icon: Clock,      title: "Gain de temps administratif", desc: "Automatisez vos calculs et votre numérotation pour vous concentrer sur votre métier." },
    { Icon: Globe,      title: "Zéro installation",           desc: "Application web accessible 24/7 depuis n'importe quel navigateur moderne." },
    { Icon: Lock,       title: "Souveraineté des données",    desc: "Isolation totale de vos données. Vous restez maître de votre compte et de sa suppression." },
    { Icon: Shield,     title: "Sécurité moderne",            desc: "Utilisation des standards de l'industrie : Spring Security, JWT et stockage Redis." },
] as const

export const STEPS = [
    { n: "01", title: "Configuration profil",      desc: "Renseignez vos infos légales et importez votre logo pro." },
    { n: "02", title: "Gestion clients",           desc: "Enregistrez vos clients pour faciliter vos futures saisies." },
    { n: "03", title: "Émission documents",        desc: "Créez vos devis et factures avec nos templates neutres." },
    { n: "04", title: "Pilotage & Archive",        desc: "Suivez vos gains et archivez vos données en toute liberté." },
] as const

export const HERO_STATS = [
    { n: "7",      label: "Templates pro neutres" },
    { n: "100 %",  label: "Isolation des données" },
    { n: "01",     label: "Archive PDF au départ" },
    { n: "24/7",   label: "Accès mobile & desktop" },
] as const


export const FAQS = [
    { q: "Les documents sont-ils conformes à la loi ?",             a: "Oui. FacturArt intègre la numérotation séquentielle et toutes les mentions légales obligatoires (SIRET, TVA, dates d'échéance)." },
    { q: "Puis-je personnaliser le style de mes devis ?",          a: "Absolument. Choisissez parmi 7 templates professionnels et neutres, ajustez vos préfixes et ajoutez votre logo avec filtre automatique." },
    { q: "Comment fonctionne la suppression de compte ?",          a: "Nous prônons la souveraineté des données. Avant toute suppression, une archive PDF complète de vos statistiques et documents est générée pour vous." },
    { q: "L'application est-elle utilisable sur smartphone ?",     a: "Oui, l'interface est totalement responsive. Vous pouvez créer et envoyer vos devis directement depuis votre chantier." },
    { q: "Mes données sont-elles partagées ?",                      a: "Jamais. Chaque artisan dispose d'une isolation stricte au niveau de la base de données. Seul vous avez accès à vos clients et factures." },
    { q: "Comment contacter l'assistance ?",                        a: "Un module de support est intégré directement dans votre dashboard pour échanger avec l'équipe d'administration." },
] as const