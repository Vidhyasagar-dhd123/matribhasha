import { BookOpenText, GitBranch, Languages, LayoutDashboard, Sparkles, Workflow } from "lucide-react"

const Features = () =>{
     const features = [
    {
      title: "Translation",
      description: "Seamlessly translate using both local Indic models and third-party APIs without vendor lock-in.",
      icon: Languages,
    },
    {
      title: "Personal Dashboard",
      description: "Track your translation activity, books translated, and language stats in a single dashboard.",
      icon: LayoutDashboard,
    },
    {
      title: "Collaborative Workspace",
      description: "Work on original texts and their translations side-by-side with real-time editing tools.",
      icon: Workflow,
    },
    {
      title: "AI Integration",
      description: "Use LLM-backed assistance to draft, refine, and accelerate translation work.",
      icon: Sparkles,
    },
    {
      title: "Vivar",
      description: "Read scroll-based short stories in multiple languages to promote culture and literacy.",
      icon: BookOpenText,
    },
    {
      title: "Versioning",
      description: "Maintain multiple page revisions so creators can revisit and compare content safely.",
      icon: GitBranch,
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Platform features</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Everything Matribhasha is building
          </h2>
          <p className="text-base leading-7 text-slate-600">
            The homepage now reflects the full feature set described in the README, including translation, AI assistance, Vivar, and page versioning.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <div
                key={idx}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-700 transition group-hover:bg-emerald-100">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-slate-950">
                  {feature.title}
                </h3>
                <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default Features