import Link from "next/link"

const Hero = () =>{
    return (
        <section className="relative overflow-hidden px-6 py-16 sm:px-8 lg:px-12">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-emerald-50 to-amber-50" />
            <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_65%)]" />

            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white/80 px-4 py-1 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur">
                        Inclusive translation for Indian languages
                    </div>
                    <div className="space-y-4">
                        <h1 className='max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl'>
                            Welcome to Matribhasha
                        </h1>
                        <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Democratizing knowledge for everyone by everyone with AI-assisted translation, collaborative writing, and multilingual reading experiences.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link href="/Signup" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                            Get Started
                        </Link>
                        <Link href="/Books" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50">
                            Explore Books
                        </Link>
                        <Link href="/Vivar" className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100">
                            Read Vivar
                        </Link>
                    </div>
                    <div className="grid gap-4 pt-4 sm:grid-cols-3">
                        {[
                            ["AI assisted", "Translation support across workflows"],
                            ["Multilingual", "Read and publish across Indian languages"],
                            ["Versioned", "Track page history and revisions"],
                        ].map(([label, detail]) => (
                            <div key={label} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                                <div className="text-sm font-semibold text-slate-950">{label}</div>
                                <div className="mt-1 text-sm leading-6 text-slate-600">{detail}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur">
                    <div className="space-y-4">
                        <div className="rounded-2xl bg-slate-950 p-5 text-white">
                            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Live platform snapshot</p>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                {[
                                    ["Profile", "Personalized identity and social presence"],
                                    ["Workspace", "Create and translate in one place"],
                                    ["Dashboard", "Track activity and progress"],
                                    ["Vivar", "Short stories built for multilingual reading"],
                                ].map(([title, detail]) => (
                                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="text-sm font-semibold">{title}</div>
                                        <div className="mt-1 text-sm leading-6 text-slate-300">{detail}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero