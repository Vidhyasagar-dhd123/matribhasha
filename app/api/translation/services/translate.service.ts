import { vendors, VendorType } from "./vendors.service"

export const translate=async (text:string, srcLang:string, tgtLang:string,vendor:string):Promise<string>=>{
    const translator = vendors[vendor as VendorType]
    return translator(text,srcLang,tgtLang)
}

export const translateToMany=async (text:string, srcLang:string, tgtLangs:string[],vendor:string):Promise<Record<string,string>>=>{
    const translator = vendors[vendor as VendorType]
    const result:Record<string,string>={}
    for (const tgtLang of tgtLangs) {
        result[tgtLang] = await translator(text, srcLang, tgtLang);
    }
    return result
}