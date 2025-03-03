import i18next from "i18next";

// Static data for the onboarding process
// React context is unnecessary here
const OnboardingStatic = {
    appLanguage: i18next.language ?? "en",
};

export default OnboardingStatic;
