
const Features = () =>{
     const features = [
    {
      title: "Translation",
      description: "Seamlessly translate using both local Indic models and third-party APIs without vendor lock-in.",
    },
    {
      title: "Personal Dashboard",
      description: "Track your translation activity, books translated, and language stats in a single dashboard.",
    },
    {
      title: "Collaborative Workspace",
      description: "Work on original texts and their translations side-by-side with real-time editing tools.",
    },
    {
      title: "Community Profiles",
      description: "Showcase your profile, books, short stories (Vivar), followers, and bookmarks.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
         Top Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features