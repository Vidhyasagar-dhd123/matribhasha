
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
    <section className="py-16 ">
      <div className="max-w-6xl mx-auto px-6 ">
        <h2 className=" md: font-bold mb-12 ">
         Top Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className=" rounded-2xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className=" font-semibold  mb-3">
                {feature.title}
              </h3>
              <p className=" ">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features