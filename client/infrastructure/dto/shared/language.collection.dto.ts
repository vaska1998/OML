import {Languages} from "../../constants/languages";

export type LanguageCollectionType = {
    [key in Languages]?: string;
}

export interface LanguageCollectionStringDto extends LanguageCollectionType {
    ua: string;
    en?: string;
}
