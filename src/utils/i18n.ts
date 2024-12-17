import i18n from "i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/locales/en";
import hrTranslation from "@/locales/hr";

const resources = {
    en: { translation: enTranslation },
    hr: { translation: hrTranslation },
};

export default async function loadLocales() {
    let savedLanguage = await AsyncStorage.getItem("language");

    if (!savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode;
    }

    i18n.use(initReactI18next).init({
        resources,
        lng: savedLanguage || "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });
}
