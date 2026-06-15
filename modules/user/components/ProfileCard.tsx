
"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/modules/auth/contexts/authContext"
import { Book, Flame, Languages, PencilLine, Sparkles } from "lucide-react"

type ProfileCardProps = {
    username: string
    isMe: boolean
}

const ProfileCard = ({ username, isMe }: ProfileCardProps) =>{
    const { user } = useAuth()
    const [bio, setBio] = useState("")
    const [savedBio, setSavedBio] = useState("")
    const [books, setBooks] = useState<any[]>([])

    useEffect(() => {
        const storedBio = localStorage.getItem(`profile-bio:${username}`)
        if (storedBio) {
            setBio(storedBio)
            setSavedBio(storedBio)
        } else {
            setBio(isMe ? "I read, translate, and build bilingual stories." : `${username} is exploring stories across Indian languages.`)
        }
    }, [isMe, username])

    useEffect(() => {
        const loadBooks = async () => {
            const response = await fetch("/api/v1/books")
            if (response.ok) {
                const data = await response.json()
                setBooks(Array.isArray(data) ? data : [])
            }
        }

        loadBooks()
    }, [])

    const profileBooks = useMemo(() => {
        const normalized = username.toLowerCase()
        return books.filter((book) => String(book.author || "").toLowerCase().includes(normalized))
    }, [books, username])

    const languages = user?.languages?.length
        ? user.languages.map((entry: { name?: string }) => entry.name).filter((language): language is string => Boolean(language))
        : ["Hindi", "English", "Marathi"]
    const stats = [
        { label: "Books", value: profileBooks.length || (isMe ? 3 : 1), icon: Book },
        { label: "Languages", value: languages.length, icon: Languages },
        { label: "Momentum", value: isMe ? "Active" : "Reading", icon: Flame },
    ]

    const saveBio = () => {
        localStorage.setItem(`profile-bio:${username}`, bio)
        setSavedBio(bio)
    }

    return (
        <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Profile</p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{username}</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{savedBio || bio}</p>
                    </div>
                    <div className="rounded-[1.75rem] bg-slate-950 px-5 py-4 text-white">
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Status</p>
                        <p className="mt-2 text-lg font-semibold">{isMe ? "Your public profile" : "Public reader profile"}</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {stats.map((item) => {
                        const Icon = item.icon

                        return (
                            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <Icon className="h-5 w-5 text-slate-500" />
                                <div className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</div>
                                <div className="text-sm text-slate-600">{item.label}</div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        {isMe ? "Edit your bio" : "About this reader"}
                    </div>
                    <textarea
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        className="mt-4 min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-300"
                        readOnly={!isMe}
                    />
                    {isMe ? (
                        <button onClick={saveBio} className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                            <PencilLine className="h-4 w-4" /> Save bio
                        </button>
                    ) : null}
                </div>
            </div>

            <aside className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Languages</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {languages.map((language) => (
                            <span key={language} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                {language}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Recent books</p>
                    <div className="mt-4 space-y-3">
                        {profileBooks.slice(0, 3).map((book) => (
                            <Link key={book.uuid} href={`/Books/${book.uuid}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
                                <div className="text-sm font-semibold text-slate-950">{book.title}</div>
                                <div className="mt-1 text-sm text-slate-600">{book.genre || book.originalLanguage}</div>
                            </Link>
                        ))}
                        {!profileBooks.length ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                                No books linked to this profile yet.
                            </div>
                        ) : null}
                    </div>
                </div>
            </aside>
        </section>
    )
}

export default ProfileCard