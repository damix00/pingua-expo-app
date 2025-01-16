import i18n from "i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/locales/en";
import hrTranslation from "@/locales/hr";
import twemoji from "@twemoji/api";

const resources = {
    en: { translation: enTranslation },
    hr: { translation: hrTranslation },
};

export const languageMap = {
    en: "English",
    hr: "Hrvatski",
};

export const languageCodeMap = {
    English: "en",
    Hrvatski: "hr",
};

export type CourseLanguage = {
    code: string;
    flag: string;
};

export let courseLanguages: CourseLanguage[] = [
    {
        code: "en",
        flag: `${twemoji.base}svg/1f1ec-1f1e7.svg`,
    },
    {
        code: "de",
        flag: `${twemoji.base}svg/1f1e9-1f1ea.svg`,
    },
    {
        code: "hr",
        flag: `${twemoji.base}svg/1f1ed-1f1f7.svg`,
    },
    // {
    //     code: "es",
    //     flag: `${twemoji.base}svg/1f1ea-1f1f8.svg`,
    // },
    // {
    //     code: "fr",
    //     flag: `${twemoji.base}svg/1f1eb-1f1f7.svg`,
    // },
    // {
    //     code: "it",
    //     flag: `${twemoji.base}svg/1f1ee-1f1f9.svg`,
    // },
    // {
    //     code: "ru",
    //     flag: `${twemoji.base}svg/1f1f7-1f1fa.svg`,
    // },
    // {
    //     code: "pt",
    //     flag: `${twemoji.base}svg/1f1f5-1f1f9.svg`,
    // },
    // {
    //     code: "tr",
    //     flag: `${twemoji.base}svg/1f1f9-1f1f7.svg`,
    // },
    // {
    //     code: "el",
    //     flag: `${twemoji.base}svg/1f1ec-1f1f7.svg`,
    // },
    // {
    //     code: "nl",
    //     flag: `${twemoji.base}svg/1f1f3-1f1f1.svg`,
    // },
    // {
    //     code: "pl",
    //     flag: `${twemoji.base}svg/1f1f5-1f1f1.svg`,
    // },
    // {
    //     code: "sv",
    //     flag: `${twemoji.base}svg/1f1f8-1f1ea.svg`,
    // },
];

export function findFlag(code: string) {
    return courseLanguages.find((lang) => lang.code === code)?.flag;
}

let localizations: any;

export default async function loadLocales() {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode;
    }

    await i18n.use(initReactI18next).init({
        resources,
        lng: savedLanguage || "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

    i18n.services.formatter?.add("lowercase", (value, lng, options) => {
        return value.toLowerCase();
    });

    i18n.services.formatter?.add("capitalize", (value, lng, options) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    });
}

export { localizations };

export async function saveLocale(language: string | null) {
    if (!language) {
        await AsyncStorage.removeItem("language");
    }
    await AsyncStorage.setItem("language", language!);
}
