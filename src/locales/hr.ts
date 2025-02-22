import en from "./en";

const translations: typeof en = {
    get_started: "Započni",
    continue: "Nastavi",
    email: "Email",
    name: "Ime",
    username: "Korisničko ime",
    finish: "Završi",
    back: "Natrag",
    change: "Promijeni",
    tap_to_continue: "Dodirni za nastavak",
    completed: "Završeno",
    message: "Poruka",
    delete_text: "Obriši",
    copy: "Kopiraj",
    translate: "Prevedi",
    copied: "Kopirano!",
    listen: "Poslušaj",
    great: "Odlično!",
    narrator: "Pripovjedač",
    skip: "Preskoči",
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
        currently_learning:
            "Trenutno učiš {{language}}, s postavljenim temeljnim jezikom na {{base}}.",
    },
    permissions: {
        denied_mic:
            "Pristup mikrofonu potreban je za korištenje prepoznavanja govora.",
    },
    errors: {
        email_empty: "Email ne može biti prazan.",
        email_invalid: "Email nije valjan.",
        oh_no: "O, ne!",
        email_sending_fail:
            "Slanje e-pošte nije uspjelo. Molimo pokušajte ponovno.",
        otp_fail: "Nešto je pošlo po zlu. Molimo pokušajte ponovno.",
        wrong_otp: "Pogrešan kȏd. Molimo pokušajte ponovno.",
        field_required: "Ovo polje je obavezno.",
        min_characters: "Mora sadržavati najmanje {{count}} znakova.",
        something_went_wrong:
            "Nešto je pošlo po zlu. Molimo pokušajte ponovno.",
        failed_to_create_chat: "Nismo mogli učitati chat.",
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
        no_account_title: "Nismo mogli pronaći tvoj račun.",
        no_account_description:
            "Izgleda da ste se pokušali prijaviti s e-mailom koji nije povezan s nijednim računom. Možete se vratiti ili nastaviti s postavljanjem novog računa.",
    },
    auth: {
        login: "Prijava ili registracija",
        disclaimer:
            'Nastavkom se slažeš s našim <a href="https://google.com">Uvjetima korištenja</a> i <a href="https://google.com">Pravilima privatnosti</a>.',
        otp_title: "Šesteroznamenkasti kȏd",
        otp_description:
            "Poslali smo kȏd na {{email}}. Unesite ga ispod kako biste nastavili.",
        otp_button: "Potvrdi",
        profile_setup_title: "Dobrodošli!",
        profile_setup_description:
            "Drago nam je što ste s nama. Upoznajmo se bolje.",
    },
    subscription: {
        subscribe: "Pretplati se",
        name: "Premium",
        title: "Unaprijedi svoje jezične vještine",
        description:
            "Ekskluzivne lekcije, praksa i vođenje uz pomoć AI-a - sve na jednom mjestu.",
        cta: "Pretplati se",
        disclaimer:
            "Vaša će se pretplata automatski obnoviti ako je ne otkažete. Pretplatu otkazati ili promijeniti u postavkama svoga računa u bilo kojem trenutku. Pretplatom prihvaćate naše Uvjete pružanja usluge i Pravila privatnosti.",
        item_1: "**Personalizirane lekcije** prilagođene tvojim ciljevima.",
        item_2: "**Pričaj s povjerenjem** u poslu i svakodnevnom životu.",
        item_3: "**Bez reklama, bez ometanja** - samo premium iskustvo.",
        item_4: "**Vježbaj govor** s realističnim, interaktivnim AI dijalogom.",
    },
    tabs: {
        home: "Početna",
        scenarios: "Scenariji",
        chats: "Čavrljanja",
        profile: "Profil",
        translate: "Prevoditelj",
    },
    course: {
        completed_unit: "Jedinica {{unit}} završena!",
        continue_unit: "Nastavi s Jedinicom {{unit}}",
        unavailable_unit:
            "Molimo završite Jedinicu {{unit}} kako biste nastavili.",
        unit: "Jedinica {{unit}}",
        xpToLevel: "{{xp}} XP do Sekcije {{level}}",
        xp: "{{xp}} XP",
        xpToUnit: "{{xp}} XP do Jedinice {{unit}}",
    },
    lesson: {
        loading: "Učitavanje...",
        loading_description: "Samo trenutak! Ovo neće dugo trajati.",
        modal: {
            title: "Molim te ostani!",
            subtitle:
                "Ako izađete, Vaš napredak neće biti spremljen. Jeste li sigurni da želite izaći?",
            exit: "Izađi",
            cancel: "Odustani",
        },
        story: {
            continue: "Dalje",
        },
        success: {
            title: "Svaka čast!",
            description: "Završili ste ovu lekciju.",
            xp: "+{{xp}} XP",
        },
        questions: {
            new_word: "Nova riječ!",
            tap_to_see_translation: "Dodirni za prijevod.",
            speak: "Izgovori sljedeću rečenicu",
            tap_to_record: "Drži za snimanje",
            voice_loading: "Obrada...",
            multiple_choice: "Odaberi točan prijevod",
            correct: "Točno!",
            incorrect: "Netočno :(",
            translate_task: "Prevedi sljedeću rečenicu",
            translation_placeholder: "Ovdje upiši prijevod...",
            check: "Provjeri",
            listen_and_write: "Poslušaj i napiši",
            write_here: "Napiši ovdje...",
            cant_listen: "Sada ne mogu slušati",
            correct_translation: "Točan prijevod: {{translation}}",
        },
    },
    chats: {
        tapToChat: "Dodirni za chat",
        youChat: "Vi: {{message}}",
    },
    translation: {
        from: "Sa",
        to: "Na",
        translate: "Prevedi",
    },
};

export default translations;
