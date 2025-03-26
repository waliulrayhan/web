import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-white text-black">
      <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Smart CV Screening Tool
          </h1>
          <p className="text-xl text-gray-600">
            Streamline your recruitment process with AI-powered CV analysis
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full my-12">
          {[
            {
              title: "CV Ranking",
              description: "Automatically rank CVs based on job requirements",
              icon: "📊",
            },
            {
              title: "ML-Powered",
              description: "Advanced machine learning algorithms for accurate matching",
              icon: "🤖",
            },
            {
              title: "Time-Saving",
              description: "Reduce screening time by up to 75%",
              icon: "⚡",
            },
          ].map((feature) => (
            <div key={feature.title} className="text-center p-6 rounded-lg border border-gray-200 bg-white shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/upload"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-lg h-14 px-8"
        >
          Start Screening
        </Link>
      </main>

      <footer className="row-start-3 text-center text-sm text-gray-600">
        Built with advanced ML algorithms for accurate candidate matching
      </footer>
    </div>
  );
}
