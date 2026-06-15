"use client"

import Link from "next/link"
import { useState } from "react"

const stories = [
  {
    title: "A train through the monsoon",
    language: "Hindi + English",
    excerpt:
      "A commuter story about rain, rhythm, and the way a single scene can feel different when read in two languages.",
  },
  {
    title: "River songs at dusk",
    language: "Bengali + Odia",
    excerpt:
      "A short cultural sketch designed for slow scrolling, letting readers move through the translation one beat at a time.",
  },
  {
    title: "Market day memories",
    language: "Tamil + Malayalam",
    excerpt:
      "A reflective slice-of-life story that pairs regional vocabulary with a calm reading flow for multilingual learning.",
  },
]

const VivarPage = () => {
  const [activeStory, setActiveStory] = useState(stories[0])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_42%),linear-gradient(180deg,#f8fafc_0%,#eefbf5_100%)] px-6 py-16 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-3xl space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Vivar</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Scroll-based short stories for multilingual reading
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            Vivar turns reading into a calm, vertical experience. Each story is written to support language discovery, cultural context, and easy translation while keeping the pace natural on mobile and desktop.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/Books"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore Books
            </Link>
            <Link
              href="/Signup"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Join the Platform
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-100 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Featured story</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{activeStory.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{activeStory.language}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stories.map((story) => (
                <button
                  key={story.title}
                  onClick={() => setActiveStory(story)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeStory.title === story.title ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  {story.title}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
            {activeStory.excerpt} The layout keeps the reading rhythm slow and vertical, which is useful for multilingual comparison and cultural context.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Reading mode</p>
                <h2 className="mt-3 text-2xl font-semibold">Made for quiet scrolling</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Story cards are arranged to feel like a feed, but with stronger language cues, translation-friendly spacing, and a focus on culture-first storytelling.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Multilingual", "Alternate between source and translated text."],
                  ["Culture first", "Stories can reflect regional voices and traditions."],
                  ["Mobile friendly", "Designed for vertical reading and long-form focus."],
                  ["Learning ready", "Supports repetition, comparison, and vocabulary building."],
                ].map(([title, detail]) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-950">{title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">{detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {stories.map((story, index) => (
              <article
                key={story.title}
                onClick={() => setActiveStory(story)}
                className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Story {index + 1}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">{story.title}</h3>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {story.language}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">{story.excerpt}</p>
                <div className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Tap to feature this story
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default VivarPage