import { TranslationFunction } from "./utils";

const localTranslate: TranslationFunction = async (text, srcLang, tgtLang) => {
    const params = new URLSearchParams({
        text: text
    });

    if (srcLang) {
        params.append("source_lang", srcLang);
    }

    if (tgtLang) {
        params.append("target_lang", tgtLang);
    }
    try{
        const response = await fetch(`http://127.0.0.1:8000/api/translate/?${params.toString()}`, {
            method: "GET"
        });
        const data = await response.json();
        return data.translated_text;
    }
    catch(err){
        console.error("Error in local translation:", err);
        throw err;
    }
}

export default localTranslate