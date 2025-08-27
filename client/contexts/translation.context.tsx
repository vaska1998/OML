import {Translate} from "next-translate";
import {LanguageCollectionStringDto} from "../infrastructure/dto/shared/language.collection.dto";
import React, {useContext, useEffect, useState} from "react";
import useTranslation from "next-translate/useTranslation";
import {RequiredLanguage} from '../infrastructure/constants/languages';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const emptyTranslate: Translate = (_) => '';

export type AppTranslationContext = {
    t: Translate;
    lang: keyof LanguageCollectionStringDto;
    lVal: (data: LanguageCollectionStringDto) => string,
}

export const AppTranslationContext = React.createContext<AppTranslationContext>({
    lang: 'ua',
    t: emptyTranslate,
    lVal: () => '',
});

export const AppTranslationProvider: React.FC = ({children}) => {
    const {t, lang} = useTranslation('common');
    const lVal = (target: LanguageCollectionStringDto) => {
        const value = target[lang as keyof LanguageCollectionStringDto];
        return !value ? target[RequiredLanguage] : value;
    };

    const [translationContext, setTranslationContext] = useState<AppTranslationContext>({
        t,
        lang: lang as keyof  LanguageCollectionStringDto,
        lVal,
    });

    useEffect(() => {
        setTranslationContext({
            t,
            lang: lang as keyof LanguageCollectionStringDto,
            lVal,
        });
    }, [lang]);

    return (
        <AppTranslationContext.Provider value={translationContext} children={children} />
    );
};

export const useAppTranslation = () => useContext(AppTranslationContext);
