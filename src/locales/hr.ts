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
    update: "Ažuriraj",
    logout: "Odjava",
    cancel: "Odustani",
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
            'Nastavkom se slažeš s našim <a href="/legal/tos">Uvjetima korištenja</a> i <a href="/legal/privacy-policy">Pravilima privatnosti</a>.',
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
        get_subscription: "Kupi Premium",
        title: "Unaprijedi svoje jezične vještine",
        description:
            "Ekskluzivne lekcije, praksa i vođenje uz pomoć AI-a - sve na jednom mjestu.",
        cta: "Pretplati se - $9.99/mjesečno",
        disclaimer:
            "Vaša će se pretplata automatski obnoviti ako je ne otkažete. Pretplatu otkazati ili promijeniti u postavkama svoga računa u bilo kojem trenutku. Pretplatom prihvaćate naše Uvjete pružanja usluge i Pravila privatnosti.",
        item_1: "**Personalizirane lekcije** prilagođene tvojim ciljevima.",
        item_2: "**Pričaj s povjerenjem** u poslu i svakodnevnom životu.",
        item_3: "**Vježbaj govor** s realističnim, interaktivnim AI dijalogom.",
        thanks: "Hvala na pretplati <3",
        thanks_description:
            "Sada možeš pristupiti svim premium sadržajima i funkcijama.",
    },
    tabs: {
        home: "Početna",
        scenarios: "Scenariji",
        chats: "AI Čavrljanja",
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
            new_section: "Nova sekcija otključana!",
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
            correct_form: "Točan oblik: {{form}}",
            listen_and_choose: "Poslušaj i odaberi",
        },
    },
    popups: {
        logout: {
            title: "Odjava",
            description: "Jeste li sigurni da se želite odjaviti?",
            cancel: "Odustani",
            confirm: "Odjavi se",
        },
    },
    settings: {
        title: "Postavke",
        hapticFeedback: "Taktilne povratne informacije",
        language: "Jezik",
        darkMode: "Tamni način rada",
        deviceDefault: "Sustav",
        light: "Svijetlo",
        dark: "Tamno",
        premium: {
            heading: "Vi ste Premium korisnik",
            renews: "Vaša se pretplata obnavlja {{date}}",
            cancel: "Otkaži pretplatu",
            cancelPrompt:
                "Jeste li sigurni da želite otkazati pretplatu? Izgubit ćete sve pogodnosti Premium pretplate.",
            cancelSubscription: "Otkaži pretplatu",
            keepSubscription: "Zadrži pretplatu",
        },
    },
    scenarios: {
        beginner: "Početnik",
        intermediate: "Srednji",
        advanced: "Napredni",
        fluent: "Tečno",
        filters: {
            all: "Sve",
            unfinished: "Nedovršeno",
            not_started: "Nezapočeto",
            finished: "Završeno",
        },
    },
    chats: {
        tapToChat: "Dodirni za chat",
        youChat: "Vi: {{message}}",
        clear: "Očisti chat",
        clearChatPrompt:
            "Jeste li sigurni da želite očistiti chat? Ova radnja je nepovratna.",
    },
    translation: {
        from: "Sa",
        to: "Na",
        translate: "Prevedi",
    },
    notifications: {
        reminders: {
            r1: {
                title: "Opa!",
                body: "Pingvin je upravo prošao i rekao da preskačeš svoje lekcije?!",
            },
            r2: {
                title: "što se događa?",
                body: "samo sam ti htio reći da mi nedostaješ. želiš naučiti neke nove riječi danas?",
            },
            r3: {
                title: "Ring-ring!",
                body: "Tvoje učenje te zove. Hoćeš li se javiti?",
            },
            r4: {
                title: "Gdje si?",
                body: "Ako pingvini mogu izdržati hladnoću, možeš i ti jednu lekciju.",
            },
            r5: {
                title: "Tvoje lekcije su ti napisale pismo prekida.",
                body: "'Nije do mene, do tebe je.' Učini im uslugu - vrati se prije nego što bude prekasno.",
            },
            r6: {
                title: "Nećemo moliti...",
                body: "Zapravo, hoćemo. Molimo te, uči danas. Nedostaješ nam :(",
            },
            r7: {
                title: "Postaješ popularan!",
                body: "Na listi 'Najmanje učenih'. Promijenimo to!",
            },
            r8: {
                title: "Nema pritiska, ali...",
                body: "Jedan se pingvin kladio u svoju ribu da ćeš učiti danas. Nemoj ga iznevjeriti.",
            },
            r9: {
                title: "Nisi sigma!",
                body: "Samo prave sigme rade svoje lekcije. Znači, ti nisi sigma? Dokaži suprotno.",
            },
            r10: {
                title: "nadam se da si sretan",
                body: "tvoje lekcije plaču. samo žele biti naučene. je li to previše za tražiti?",
            },
            r11: {
                title: "wow. stvarno wow.",
                body: "dakle, ovo je sada tvoj život? netko tko odustaje? ja ne bih nikad.",
            },
            r12: {
                title: "Nisam ljut.",
                body: "samo razočaran. u tebe. jer ne učiš. mislio sam da smo prijatelji.",
            },
            r13: {
                title: "Nadam se da su memovi vrijedili toga.",
                body: "Zanemaruješ svoje lekcije. Tužne su. Pomozi im.",
            },
            r14: {
                title: "aha, znači više ne mariš?",
                body: "jesam li ti ikad bio važan? valjda ne. samo sam ti podsjetnik, ha?",
            },
            r15: {
                title: "okej. idi svom drugom pingvinu.",
                body: "vidim kako je. imaš drugog pingvina. ja sam samo podsjetnik. razumijem.",
            },
            final: {
                title: "okej. shvaćam.",
                body: "prestat ću te gnjaviti. mislio sam da smo prijatelji, ali očito nismo.",
            },
        },
    },
    paywall: {
        title: "Izgleda da ste otkrili Premium značajku!",
        description:
            "Ova je značajka dostupna samo Premium korisnicima. Pretplatite se kako biste je otključali.",
        subscribe: "Pretplati se",
    },
};

export default translations;
