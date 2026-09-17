import { vendors, VendorType } from "./vendors.service";

export const translate = async (
    text: string,
    srcLang: string,
    tgtLang: string,
    vendor: string = "indicTrans"
): Promise<string> => {
    const primaryKey = (vendor in vendors ? vendor : "indicTrans") as VendorType;
    const translator = vendors[primaryKey] || vendors.indicTrans;

    try {
        return await translator(text, srcLang, tgtLang);
    } catch (err) {
        console.warn(`Translation with vendor ${primaryKey} failed, attempting local fallback...`, err);
        if (primaryKey !== "local" && vendors.local) {
            return await vendors.local(text, srcLang, tgtLang);
        }
        throw err;
    }
};

export const translateToMany = async (
    text: string,
    srcLang: string,
    tgtLangs: string[],
    vendor: string = "indicTrans"
): Promise<Record<string, string>> => {
    const result: Record<string, string> = {};
    for (const tgtLang of tgtLangs) {
        result[tgtLang] = await translate(text, srcLang, tgtLang, vendor);
    }
    return result;
};