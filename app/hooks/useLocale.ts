import en from "./en";

export const useLocale = () => {
    const localizedStrings = en;
    const languageCode = 'en-US';

    return {localizedStrings, languageCode};
}

