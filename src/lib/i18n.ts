import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'fr' | 'ar';

interface LanguageStore {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguage = create<LanguageStore>()(
    persist(
        (set) => ({
            language: 'fr',
            setLanguage: (language) => set({ language }),
        }),
        {
            name: 'language-storage',
        }
    )
);

export const translations = {
    en: {
        nav: {
            features: 'Features',
            howItWorks: 'How it works',
            testimonials: 'Testimonials',
            cta: 'Get Started',
        },
        hero: {
            headline: "Professional WhatsApp Automation",
            headlineHighlight: "for Restaurants",
            headlineEnd: "",
            description: "Fully managed AI service - we handle setup, training & ongoing support for your WhatsApp customer service.",
            cta: "Request Demo",
            ctaSecondary: "Contact Sales",
            stats: [
                { value: "15min", label: "Average Response Time" },
                { value: "24/7", label: "Always Available" },
                { value: "90%+", label: "Order Accuracy" }
            ]
        },
        trust: {
            title: "Trusted by businesses across Africa",
            restaurant: "Businesses",
            shop: "Retail Shops",
            cafe: "Cafés",
            bakery: "Bakeries",
            groceryStore: "Grocery Stores",
            fastFood: "Fast Food"
        },
        value: {
            title: "White-Glove Service",
            subtitle: "We Handle Everything - You Focus on Your Business",
            items: [
                {
                    title: "Dedicated Onboarding",
                    description: "Our team configures your chatbot, uploads your menu, and handles all technical setup"
                },
                {
                    title: "Custom AI Training",
                    description: "We train the AI specifically on your menu, policies, and business requirements"
                },
                {
                    title: "Ongoing Support",
                    description: "Dedicated account manager ensures your chatbot delivers perfect responses"
                }
            ]
        },
        features: {
            title: 'Everything you need to succeed',
            description: 'A complete solution designed for African merchants',
            autoSales: 'Automated Sales',
            autoSalesDesc: 'Intelligent AI that presents your products and takes orders',
            multilingual: 'Multilingual',
            multilingualDesc: 'French, English, Wolof, Arabic - speak all languages',
            catalog: 'Product Catalog',
            catalogDesc: 'Easily manage your products with photos and prices',
            orders: 'Order Management',
            ordersDesc: 'Track and manage all your orders in real-time',
            notifications: 'Notifications',
            notificationsDesc: 'Receive instant notifications for every new order',
            analytics: 'Analytics',
            analyticsDesc: 'Detailed dashboards on your sales and performance',
            support: '24/7 Support',
            supportDesc: 'Your AI works day and night without interruption',
            whatsapp: 'WhatsApp Integration',
            whatsappDesc: 'Direct connection to your WhatsApp Business account',
            payments: 'Mobile Payments',
            paymentsDesc: 'Accept Wave, Orange Money, Free Money',
            mobile: '100% Mobile',
            mobileDesc: 'Manage everything from your smartphone, wherever you are',
            crm: 'Customer CRM',
            crmDesc: 'Keep history and preferences of your customers',
            marketing: 'Marketing',
            marketingDesc: 'Send targeted promotions to your customers',
        },
        howItWorks: {
            title: 'Start automating your sales in 15 min',
            description: '3 simple steps to transform your business',
            step1Title: 'Create your account',
            step1Desc: 'Sign up in 2 minutes with your email',
            step2Title: 'Add your products',
            step2Desc: 'Import your catalog with photos and prices',
            step3Title: 'Connect WhatsApp',
            step3Desc: 'Link your account and let AI handle it',
        },
        growth: {
            tabs: ['Acquisition', 'Conversion', 'Retention'],
            acquisition: {
                headline: 'Turn engagement into sales',
                headlineHighlight: 'with WhatsApp marketing',
                subtitle: 'Mafal-IA helps you reach more customers and convert interactions into revenue directly in chat.',
                items: [
                    { title: 'Launch WhatsApp campaigns', desc: 'that engage customers wherever they are.' },
                    { title: 'Use QR codes', desc: 'to generate instant conversions from offline to online.' },
                    { title: 'Run Click-to-WhatsApp ads', desc: 'that turn clicks into conversations.' },
                    { title: 'Use surveys, quizzes and more', desc: 'to spark interest and guide users to the right products.' },
                ],
            },
            conversion: {
                headline: 'Convert conversations',
                headlineHighlight: 'into confirmed orders',
                subtitle: 'AI-powered product recommendations and seamless ordering right inside WhatsApp.',
                items: [
                    { title: 'Smart product suggestions', desc: 'based on customer preferences and order history.' },
                    { title: 'One-tap ordering', desc: 'with integrated menu browsing inside the chat.' },
                    { title: 'Mobile payment integration', desc: 'with Wave, Orange Money, and Free Money.' },
                    { title: 'Automated order confirmation', desc: 'with real-time status updates sent to customers.' },
                ],
            },
            retention: {
                headline: 'Build loyalty',
                headlineHighlight: 'that keeps customers coming back',
                subtitle: 'Personalized follow-ups and smart re-engagement campaigns to maximize lifetime value.',
                items: [
                    { title: 'Automated follow-ups', desc: 'after each order to collect feedback and build loyalty.' },
                    { title: 'Personalized offers', desc: 'based on purchase history and preferences.' },
                    { title: 'Re-engagement campaigns', desc: 'to bring back inactive customers automatically.' },
                    { title: 'VIP customer programs', desc: 'with special deals and early access to new products.' },
                ],
            },
        },
        testimonials: {
            title: 'Discover what our customers say',
            description: 'Join hundreds of businesses that trust Mafal-IA',
            testimonial1: {
                name: 'Aminata Diallo',
                business: 'Restaurant Le Dakar',
                quote: 'Since using Mafal-IA, I never lose any orders. My customers love ordering on WhatsApp!',
            },
            testimonial2: {
                name: 'Moussa Sow',
                business: 'Boutique Fatou',
                quote: 'My revenue increased by 50% in 2 months. The AI even responds when I sleep.',
            },
            testimonial3: {
                name: 'Khady Ndiaye',
                business: 'Café Teranga',
                quote: 'Setup in 10 minutes, immediate results. Exactly what I needed!',
            },
        },
        cta: {
            title: 'Ready to transform your business?',
            description: 'Join the merchants using Mafal-IA to automate their sales and grow. Simple 15-minute setup.',
            ctaPrimary: 'Create my free account',
            ctaSecondary: 'Talk to an advisor',
        },
        pricingSection: {
            title: 'Simple, Transparent Pricing',
            description: 'No hidden fees. Just one simple monthly subscription.',
            cardTitle: 'Standard Plan',
            price: '5,000 FCFA',
            period: '/month',
            caption: 'Per restaurant chatbot',
            features: [
                'Unlimited WhatsApp Messages',
                '24/7 AI Automation',
                'Full Menu Management',
                'Order Dashboard',
                'Priority Support'
            ],
            premiumCardTitle: 'Premium Plan',
            premiumPrice: '10,000 FCFA',
            premiumFeatures: [
                'Everything in Standard',
                'Custom Landing Page',
                'Facebook Integration',
                'Instagram Integration',
                'TikTok Integration',
                'Advanced Analytics'
            ],
            cta: 'Start Free Trial'
        },
        footer: {
            tagline: 'Automate your sales on WhatsApp with artificial intelligence.',
            product: 'Product',
            features: 'Features',
            howItWorks: 'How it works',
            pricing: 'Pricing',
            company: 'Company',
            about: 'About',
            blog: 'Blog',
            contact: 'Contact',
            legal: 'Legal',
            privacy: 'Privacy',
            terms: 'Terms',
            copyright: '© 2026 Mafal-IA. All rights reserved.',
        },
    },
    fr: {
        nav: {
            features: 'Fonctionnalités',
            howItWorks: 'Comment ça marche',
            testimonials: 'Témoignages',
            cta: 'Démarrer',
        },
        hero: {
            headline: "Automatisation WhatsApp Professionnelle",
            headlineHighlight: "pour Restaurants",
            headlineEnd: "",
            description: "Service IA entièrement géré - nous nous occupons de la configuration, de la formation et du support continu pour votre service client WhatsApp.",
            cta: "Demander une démo",
            ctaSecondary: "Contacter les ventes",
            stats: [
                { value: "15min", label: "Temps de réponse moyen" },
                { value: "24/7", label: "Toujours disponible" },
                { value: "90%+", label: "Précision des commandes" }
            ]
        },
        trust: {
            title: "Approuvé par des entreprises à travers l'Afrique",
            restaurant: "Businesses",
            shop: "Boutiques",
            cafe: "Cafés",
            bakery: "Boulangeries",
            groceryStore: "Épiceries",
            fastFood: "Fast Food"
        },
        value: {
            title: "Service Clé en Main",
            subtitle: "Nous gérons tout - Vous vous concentrez sur votre entreprise",
            items: [
                {
                    title: "Intégration Dédicacée",
                    description: "Notre équipe configure votre chatbot, télécharge votre menu et gère toute la configuration technique"
                },
                {
                    title: "Formation IA Personnalisée",
                    description: "Nous entraînons l'IA spécifiquement sur votre menu, vos politiques et vos exigences commerciales"
                },
                {
                    title: "Support Continu",
                    description: "Un gestionnaire de compte dédié s'assure que votre chatbot fournit des réponses parfaites"
                }
            ]
        },
        features: {
            title: 'Tout ce qu\'il faut pour réussir',
            description: 'Une solution complète pensée pour les commerçants africains',
            autoSales: 'Vente Automatique',
            autoSalesDesc: 'IA intelligente qui présente vos produits et prend les commandes',
            multilingual: 'Multilingue',
            multilingualDesc: 'Français, Anglais, Wolof, Arabe - parlez toutes les langues',
            catalog: 'Catalogue Produits',
            catalogDesc: 'Gérez facilement vos produits avec photos et prix',
            orders: 'Gestion Commandes',
            ordersDesc: 'Suivez et gérez toutes vos commandes en temps réel',
            notifications: 'Notifications',
            notificationsDesc: 'Recevez instantanément chaque nouvelle commande',
            analytics: 'Analytics',
            analyticsDesc: 'Tableaux de bord détaillés sur vos ventes et performances',
            support: 'Support 24/7',
            supportDesc: 'Votre IA travaille jour et nuit sans interruption',
            whatsapp: 'Intégration WhatsApp',
            whatsappDesc: 'Connexion directe à votre compte WhatsApp Business',
            payments: 'Paiements Mobile',
            paymentsDesc: 'Acceptez Wave, Orange Money, Free Money',
            mobile: '100% Mobile',
            mobileDesc: 'Gérez tout depuis votre smartphone, où que vous soyez',
            crm: 'CRM Client',
            crmDesc: 'Conservez l\'historique et les préférences de vos clients',
            marketing: 'Marketing',
            marketingDesc: 'Envoyez des promotions ciblées à vos clients',
        },
        howItWorks: {
            title: 'Commencez à automatiser vos ventes en 15 min',
            description: '3 étapes simples pour transformer votre business',
            step1Title: 'Créez votre compte',
            step1Desc: 'Inscrivez-vous en 2 minutes avec votre email',
            step2Title: 'Ajoutez vos produits',
            step2Desc: 'Importez votre catalogue avec photos et prix',
            step3Title: 'Connectez WhatsApp',
            step3Desc: 'Liez votre compte et laissez l\'IA gérer',
        },
        growth: {
            tabs: ['Acquisition', 'Conversion', 'Rétention'],
            acquisition: {
                headline: 'Transformez l\'engagement en ventes',
                headlineHighlight: 'grâce au marketing WhatsApp',
                subtitle: 'Mafal-IA vous aide à toucher plus de clients et à convertir les interactions en revenus directement dans le chat.',
                items: [
                    { title: 'Lancez des campagnes WhatsApp', desc: 'qui engagent les clients là où ils se trouvent.' },
                    { title: 'Utilisez les codes QR', desc: 'pour générer des conversions instantanées du hors ligne vers le en ligne.' },
                    { title: 'Diffusez des publicités Click-to-WhatsApp', desc: 'qui transforment les clics en conversations.' },
                    { title: 'Utilisez des sondages, des quiz et bien plus encore', desc: 'pour susciter l\'intérêt des utilisateurs et les guider vers les produits qui leur conviennent.' },
                ],
            },
            conversion: {
                headline: 'Convertissez les conversations',
                headlineHighlight: 'en commandes confirmées',
                subtitle: 'Recommandations de produits par IA et commandes fluides directement dans WhatsApp.',
                items: [
                    { title: 'Suggestions de produits intelligentes', desc: 'basées sur les préférences et l\'historique des commandes.' },
                    { title: 'Commande en un clic', desc: 'avec navigation du menu intégrée dans le chat.' },
                    { title: 'Intégration paiement mobile', desc: 'avec Wave, Orange Money et Free Money.' },
                    { title: 'Confirmation de commande automatique', desc: 'avec mises à jour en temps réel envoyées aux clients.' },
                ],
            },
            retention: {
                headline: 'Fidélisez vos clients',
                headlineHighlight: 'pour qu\'ils reviennent encore et encore',
                subtitle: 'Suivis personnalisés et campagnes de réengagement intelligentes pour maximiser la valeur à vie.',
                items: [
                    { title: 'Suivis automatiques', desc: 'après chaque commande pour collecter des avis et fidéliser.' },
                    { title: 'Offres personnalisées', desc: 'basées sur l\'historique d\'achat et les préférences.' },
                    { title: 'Campagnes de réengagement', desc: 'pour ramener les clients inactifs automatiquement.' },
                    { title: 'Programmes clients VIP', desc: 'avec des offres spéciales et un accès anticipé aux nouveaux produits.' },
                ],
            },
        },
        testimonials: {
            title: 'Découvrez ce que nos clients disent',
            description: 'Rejoignez des centaines de commerces qui font confiance à Mafal-IA',
            testimonial1: {
                name: 'Aminata Diallo',
                business: 'Restaurant Le Dakar',
                quote: 'Depuis que j\'utilise Mafal-IA, je ne perds plus aucune commande. Mes clients adorent commander sur WhatsApp !',
            },
            testimonial2: {
                name: 'Moussa Sow',
                business: 'Boutique Fatou',
                quote: 'Mon chiffre d\'affaires a augmenté de 50% en 2 mois. L\'IA répond même quand je dors.',
            },
            testimonial3: {
                name: 'Khady Ndiaye',
                business: 'Café Teranga',
                quote: 'Configuration en 10 minutes, résultats immédiats. Exactement ce dont j\'avais besoin !',
            },
        },
        cta: {
            title: 'Vendez directement sur WhatsApp, automatisez et encaissez en un clic',
            description: 'Fini les pertes de temps et les conversations qui n\'aboutissent pas ! Automatisez vos échanges avec vos clients, envoyez vos catalogues, relancez automatiquement les ventes abandonnées et recevez les paiements directement via WhatsApp. Simple, rapide et sécurisé : transformez chaque message en vente.',
            ctaPrimary: 'Ouvrir un compte',
            ctaSecondary: 'Parler à un conseiller',
        },
        pricingSection: {
            title: 'Tarification Simple et Transparente',
            description: 'Pas de frais cachés. Juste un abonnement mensuel simple.',
            cardTitle: 'Plan Standard',
            price: '5 000 FCFA',
            period: '/mois',
            caption: 'Par chatbot restaurant',
            features: [
                'Messages WhatsApp Illimités',
                'Automatisation IA 24/7',
                'Gestion Complète du Menu',
                'Tableau de Bord des Commandes',
                'Support Prioritaire'
            ],
            premiumCardTitle: 'Plan Premium',
            premiumPrice: '10 000 FCFA',
            premiumFeatures: [
                'Tout ce qui est dans le Standard',
                'Page de Destination Personnalisée',
                'Intégration Facebook',
                'Intégration Instagram',
                'Intégration TikTok',
                'Analyses Avancées'
            ],
            cta: 'Essai Gratuit'
        },
        footer: {
            tagline: 'Automatisez vos ventes sur WhatsApp avec l\'intelligence artificielle.',
            product: 'Produit',
            features: 'Fonctionnalités',
            howItWorks: 'Comment ça marche',
            pricing: 'Tarifs',
            company: 'Entreprise',
            about: 'À propos',
            blog: 'Blog',
            contact: 'Contact',
            legal: 'Légal',
            privacy: 'Confidentialité',
            terms: 'Conditions',
            copyright: '© 2026 Mafal-IA. Tous droits réservés.',
        },
    },
    ar: {
        nav: {
            features: 'الميزات',
            howItWorks: 'كيف يعمل',
            testimonials: 'شهادات العملاء',
            cta: 'ابدأ الآن',
        },
        hero: {
            headline: "أتمتة واتساب احترافية",
            headlineHighlight: "للمطاعم",
            headlineEnd: "",
            description: "خدمة ذكاء اصطناعي مُدارة بالكامل - نحن نتولى الإعداد والتدريب والدعم المستمر لخدمة عملاء واتساب الخاصة بك.",
            cta: "طلب عرض تجريبي",
            ctaSecondary: "اتصل بالمبيعات",
            stats: [
                { value: "15 دقيقة", label: "متوسط وقت الاستجابة" },
                { value: "24/7", label: "متاح دائمًا" },
                { value: "+90%", label: "دقة الطلبات" }
            ]
        },
        trust: {
            title: "موثوق به من قبل الشركات في جميع أنحاء أفريقيا",
            restaurant: "المطاعم",
            shop: "متاجر التجزئة",
            cafe: "المقاهي",
            bakery: "المخابز",
            groceryStore: "محلات البقالة",
            fastFood: "الوجبات السريعة"
        },
        value: {
            title: "خدمة متكاملة",
            subtitle: "نحن نتولى كل شيء - أنت تركز على عملك",
            items: [
                {
                    title: "تأهيل مخصص",
                    description: "يقوم فريقنا بتكوين روبوت الدردشة الخاص بك، ورفع قائمتك، والتعامل مع جميع الإعدادات التقنية"
                },
                {
                    title: "تدريب مخصص للذكاء الاصطناعي",
                    description: "نقوم بتدريب الذكاء الاصطناعي خصيصًا على قائمتك وسياساتك ومتطلبات عملك"
                },
                {
                    title: "دعم مستمر",
                    description: "يضمن مدير الحساب المخصص أن يقدم روبوت الدردشة الخاص بك إجابات مثالية"
                }
            ]
        },
        features: {
            title: 'كل ما تحتاجه للنجاح',
            description: 'حل شامل مصمم للتجار الأفارقة',
            autoSales: 'مبيعات تلقائية',
            autoSalesDesc: 'ذكاء اصطناعي ذكي يعرض منتجاتك ويأخذ الطلبات',
            multilingual: 'متعدد اللغات',
            multilingualDesc: 'الفرنسية، الإنجليزية، الولوف، العربية - تحدث جميع اللغات',
            catalog: 'كتالوج المنتجات',
            catalogDesc: 'إدارة منتجاتك بسهولة مع الصور والأسعار',
            orders: 'إدارة الطلبات',
            ordersDesc: 'تتبع وإدارة جميع طلباتك في الوقت الفعلي',
            notifications: 'الإشعارات',
            notificationsDesc: 'تلقي إشعار فوري لكل طلب جديد',
            analytics: 'التحليلات',
            analyticsDesc: 'لوحات معلومات مفصلة عن مبيعاتك وأدائك',
            support: 'دعم 24/7',
            supportDesc: 'يعمل الذكاء الاصطناعي ليلًا ونهارًا دون انقطاع',
            whatsapp: 'تكامل واتساب',
            whatsappDesc: 'اتصال مباشر بحساب واتساب للأعمال الخاص بك',
            payments: 'المدفوعات المتنقلة',
            paymentsDesc: 'قبول Wave و Orange Money و Free Money',
            mobile: '100% متنقل',
            mobileDesc: 'إدارة كل شيء من هاتفك الذكي، أينما كنت',
            crm: 'إدارة علاقات العملاء',
            crmDesc: 'احتفظ بتاريخ وتفضيلات عملائك',
            marketing: 'التسويق',
            marketingDesc: 'إرسال عروض ترويجية مستهدفة لعملائك',
        },
        howItWorks: {
            title: 'ابدأ في أتمتة مبيعاتك في 15 دقيقة',
            description: '3 خطوات بسيطة لتحويل عملك',
            step1Title: 'أنشئ حسابك',
            step1Desc: 'سجل في دقيقتين بالبريد الإلكتروني',
            step2Title: 'أضف منتجاتك',
            step2Desc: 'استورد الكتالوج الخاص بك مع الصور والأسعار',
            step3Title: 'اربط واتساب',
            step3Desc: 'اربط حسابك ودع الذكاء الاصطناعي يتولى الأمر',
        },
        growth: {
            tabs: ['الاستقطاب', 'التحويل', 'الاحتفاظ'],
            acquisition: {
                headline: 'حوّل التفاعل إلى مبيعات',
                headlineHighlight: 'عبر تسويق واتساب',
                subtitle: 'مفال-IA يساعدك على الوصول إلى عملاء أكثر وتحويل التفاعلات إلى إيرادات مباشرة في المحادثة.',
                items: [
                    { title: 'أطلق حملات واتساب', desc: 'تصل إلى العملاء أينما كانوا.' },
                    { title: 'استخدم رموز QR', desc: 'لتحقيق تحويلات فورية من الواقع إلى الإنترنت.' },
                    { title: 'انشر إعلانات Click-to-WhatsApp', desc: 'التي تحول النقرات إلى محادثات.' },
                    { title: 'استخدم الاستطلاعات والمسابقات والمزيد', desc: 'لجذب اهتمام المستخدمين وتوجيههم نحو المنتجات المناسبة.' },
                ],
            },
            conversion: {
                headline: 'حوّل المحادثات',
                headlineHighlight: 'إلى طلبات مؤكدة',
                subtitle: 'توصيات منتجات بالذكاء الاصطناعي وطلبات سلسة مباشرة داخل واتساب.',
                items: [
                    { title: 'اقتراحات منتجات ذكية', desc: 'بناءً على تفضيلات العملاء وسجل الطلبات.' },
                    { title: 'طلب بنقرة واحدة', desc: 'مع تصفح القائمة داخل المحادثة.' },
                    { title: 'تكامل الدفع الإلكتروني', desc: 'مع Wave و Orange Money و Free Money.' },
                    { title: 'تأكيد تلقائي للطلبات', desc: 'مع تحديثات فورية تُرسل للعملاء.' },
                ],
            },
            retention: {
                headline: 'ابنِ ولاء',
                headlineHighlight: 'يجعل العملاء يعودون دائمًا',
                subtitle: 'متابعات مخصصة وحملات إعادة تفاعل ذكية لتعظيم القيمة الدائمة.',
                items: [
                    { title: 'متابعات تلقائية', desc: 'بعد كل طلب لجمع التقييمات وبناء الولاء.' },
                    { title: 'عروض مخصصة', desc: 'بناءً على تاريخ الشراء والتفضيلات.' },
                    { title: 'حملات إعادة التفاعل', desc: 'لإعادة العملاء غير النشطين تلقائيًا.' },
                    { title: 'برامج عملاء VIP', desc: 'مع عروض خاصة ووصول مبكر للمنتجات الجديدة.' },
                ],
            },
        },
        testimonials: {
            title: 'اكتشف ما يقوله عملاؤنا',
            description: 'انضم إلى مئات الشركات التي تثق في Mafal-IA',
            testimonial1: {
                name: 'أميناتا ديالو',
                business: 'مطعم لو داكار',
                quote: 'منذ استخدامي لـ Mafal-IA، لم أفقد أي طلب. يحب عملائي الطلب على واتساب!',
            },
            testimonial2: {
                name: 'موسى سو',
                business: 'بوتيك فاتو',
                quote: 'زادت إيراداتي بنسبة 50% في شهرين. يرد الذكاء الاصطناعي حتى عندما أنام.',
            },
            testimonial3: {
                name: 'خدي نداي',
                business: 'كافيه تيرانجا',
                quote: 'الإعداد في 10 دقائق، نتائج فورية. بالضبط ما كنت أحتاجه!',
            },
        },
        cta: {
            title: 'هل أنت مستعد لتحويل عملك؟',
            description: 'انضم إلى التجار الذين يستخدمون Mafal-IA لأتمتة مبيعاتهم والنمو. إعداد بسيط في 15 دقيقة.',
            ctaPrimary: 'أنشئ حسابي مجانًا',
            ctaSecondary: 'تحدث إلى مستشار',
        },
        pricingSection: {
            title: 'تسعير بسيط وشفاف',
            description: 'لا توجد رسوم خفية. اشتراك شهري بسيط واحد.',
            cardTitle: 'الخطة القياسية',
            price: '5,000 FCFA',
            period: '/شهر',
            caption: 'لكل روبوت مطعم',
            features: [
                'رسائل واتساب غير محدودة',
                'أتمتة الذكاء الاصطناعي 24/7',
                'إدارة القائمة الكاملة',
                'لوحة تحكم الطلبات',
                'دعم ذو أولوية'
            ],
            premiumCardTitle: 'الخطة المميزة',
            premiumPrice: '10,000 FCFA',
            premiumFeatures: [
                'كل شيء في الخطة القياسية',
                'صفحة هبوط مخصصة',
                'تكامل فيسبوك',
                'تكامل إنستغرام',
                'تكامل تيك توك',
                'تحليلات متقدمة'
            ],
            cta: 'بدء التجربة المجانية'
        },
        footer: {
            tagline: 'قم بأتمتة مبيعاتك على واتساب بالذكاء الاصطناعي.',
            product: 'المنتج',
            features: 'الميزات',
            howItWorks: 'كيف يعمل',
            pricing: 'التسعير',
            company: 'الشركة',
            about: 'حول',
            blog: 'المدونة',
            contact: 'اتصل',
            legal: 'قانوني',
            privacy: 'الخصوصية',
            terms: 'الشروط',
            copyright: '© 2026 Mafal-IA. جميع الحقوق محفوظة.',
        },
    },
};
