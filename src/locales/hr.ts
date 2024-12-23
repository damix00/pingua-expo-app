import en from "./en";

const translations: typeof en = {
    get_started: "Započni",
    continue: "Nastavi",
    email: "Email",
    languages: {
        en: "Engleski",
        de: "Njemački",
        hr: "Hrvatski",
        es: "Španjolski",
        fr: "Francuski",
        it: "Talijanski",
        ru: "Ruski",
        pt: "Portugalski",
        tr: "Turski",
        el: "Grčki",
        nl: "Nizozemski",
        pl: "Poljski",
        sv: "Švedski",
    },
    errors: {
        email_empty: "Email ne može biti prazan.",
        email_invalid: "Email nije valjan.",
        oh_no: "O, ne!",
        email_sending_fail:
            "Slanje e-pošte nije uspjelo. Molimo pokušajte ponovno.",
    },
    onboarding: {
        page_1_title: "Pričaj s povjerenjem.",
        page_1_description: "Tvoj put do tečnosti počinje ovdje.",
        have_account: "Već imaš račun?",
        page_2_title: "Odaberi jezik za učenje",
        page_2_description: "Koji će jezik osigurati tvoju budućnost?",
        i_speak: "Govorim...",
        i_want_to_learn: "Želim naučiti...",
        page_3_title: "Koliko dobro poznaješ {{language, lowercase}}?",
        fluency: {
            beginner: "Početnik",
            beginner_description: "Znam nekoliko riječi i fraza.",
            intermediate: "Srednji",
            intermediate_description: "Mogu voditi osnovni razgovor.",
            advanced: "Napredni",
            advanced_description: "Mogu razgovarati o većini tema tečno.",
            fluent: "Tečno",
            fluent_description:
                "Govorim {{language, lowercase}} kao izvorni govornik.",
        },
        page_4_title: "Koliko si posvećen?",
        page_4_description:
            "Odaberi koliko ćeš vremena provesti na učenje u aplikaciji.",
        goals: {
            tier_1: "5-10 minuta dnevno",
            tier_1_description: "Brzi dnevni poticaj",
            tier_2: "10-20 minuta dnevno",
            tier_2_description: "Stalni napredak, čvrsti rast",
            tier_3: "20-30 minuta dnevno",
            tier_3_description: "Fokusirano vježbanje za stvarne rezultate",
            tier_4: "30+ minuta dnevno",
            tier_4_description: "Posvećeno vrijeme za savladavanje",
        },
        configuring_course_title: "Samo sekunda!",
        configuring_course_description:
            "Postavljamo tvoj tečaj. Ovo neće dugo trajati.",
    },
    auth: {
        login: "Prijavi se ili registriraj",
        register: "Još samo jedan korak!",
        disclaimer:
            'Nastavkom se slažeš s našim <a href="https://google.com">Uvjetima korištenja</a> i <a href="https://google.com">Pravilima privatnosti</a>.',
    },
};

export default translations;
