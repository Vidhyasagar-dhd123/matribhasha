import localTranslate from "./localTranslation.service";
import indicTransClient from "./indicTrans.service";
import { TranslationFunction } from "./utils";

const indicTranslate: TranslationFunction = async (text, srcLang, tgtLang) => {
    const result = await indicTransClient.rawTranslate(text, srcLang, tgtLang);
    return result.translatedText;
};

export const vendors = {
    local: localTranslate,
    indicTrans: indicTranslate,
} as const;

export type VendorType = keyof typeof vendors;