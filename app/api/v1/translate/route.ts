

export async function POST(request: Request) {
    const { translate } = await import('@/app/api/translation/services/translate.service');
    const req = await request.json();
    const { text, srcLang, tgtLang, vendor } = req;
    if (!text || !srcLang || !tgtLang || !vendor) {
        return new Response(JSON.stringify({ message: "Some values are missing." }), { status: 400 });
    }
    try {
        const translatedText = await translate(text, srcLang, tgtLang, vendor);
        return new Response(JSON.stringify({ translatedText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}