

export default function map(lang:string){
    const langMap:Record<string,string> = {
        //Only Indian Languages for now
        "eng_Latn":"English",
        "hin_Deva":"Hindi",
        "bn":"Bengali",
        "te":"Telugu",
        "mar_Deva":"Marathi",
        "ta":"Tamil",
        "gu":"Gujarati",
        "kn":"Kannada",
        "ml":"Malayalam",
        "or":"Odia",
        "pa":"Punjabi",
        "as":"Assamese",
        "sd":"Sindhi",
        "ne":"Nepali",
        "ks":"Kashmiri",
        "sa":"Sanskrit",
        "en":"English"
    }
    return langMap[lang] || lang;
}