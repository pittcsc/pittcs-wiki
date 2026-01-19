import Breadcrumb from "@/components/Breadcrumb"

export const metadata = {
  title: "Projects We're Working On | Pitt CSC",
  description: "Active DevLab projects that Pitt CSC students are building.",
}

type Project = {
  title: string
  description: string
  tags: string[]
  formLink: string
}

const ProjectCard = ({ title, description, tags, formLink }: Project) => (
  <div className="mb-8 border border-transparent border-b-gray-200 dark:border-b-gray-800 pb-8 last:border-0 hover:bg-gray-50 dark:hover:bg-transparent dark:hover:border-[#ffb81c] -mx-4 px-4 py-6 rounded-2xl transition-all duration-200">
    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
      {title}
    </h3>
    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
      {description}
    </p>
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs font-medium px-2.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        >
          {tag}
        </span>
      ))}
    </div>
    <a
      href={formLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-sm font-semibold text-[#243e8b] dark:text-[#ffb81c] hover:underline"
    >
      Join this project
      <svg
        className="ml-1 w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </a>
  </div>
)

export default function ProjectsWereWorkingOnPage() {
  const projects: Project[] = [
    {
      title: "Pittfluence",
      description:
        "Building the future of DevLab's knowledge sharing, Pittfluence is an open-source documentation platform inspired by Confluence. Designed to give organizations a powerful, self-hosted Single Source of Truth repository for docs, meetings notes, and other institutional knowledge, this app will be a tool that any Pitt club or organization can deploy to preserve their work across graduating classes and teams.",
      tags: ["Documentation", "Knowledge Base", "Open Source", "React"],
      formLink:
        "https://docs.google.com/forms/d/e/1FAIpQLSeHj91HPT_wQV0j4Ho8NjFXjCte_Vy2JwKWtZr8J-DE5JfYMg/viewform?usp=sharing&ouid=104601442510228100749",
    },
    {
      title: "Pitt Campus Dine Optimizer",
      description:
        "Meal plans are expensive, and maximizing them is an art. Build a tool that scrapes or uses the DineOnCampus API to show what's serving where, but with a twist: optimize for nutritional value or specific dietary restrictions. It could also track current meal swipe usage and predict if a student will run out or have too many swipes left by the end of the semester.",
      tags: [
        "Web Scraping",
        "Data Analytics",
        "Nutrition",
        "APIs",
        "UI/UX",
        "Databases",
        "Web Development",
      ],
      formLink:
        "https://docs.google.com/forms/d/e/1FAIpQLSeHj91HPT_wQV0j4Ho8NjFXjCte_Vy2JwKWtZr8J-DE5JfYMg/viewform?usp=sharing&ouid=104601442510228100749",
    },
  ]

  return (
    <div className="article-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb slug="guides/skills/csc-dev-lab/projects-were-working-on" />

      <main className="mt-8">
        {/* Header */}
        <div className="mb-16 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Projects We&apos;re Working On
            <span className="block text-[#ffb81c] text-lg sm:text-xl font-medium mt-2 tracking-normal">
              Spring 2026
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
            These are active projects that DevLab teams are currently building.
            Each project has room for new contributors - whether you&apos;re
            looking to code, design, or help with project management.
          </p>
        </div>

        {/* Project List */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 border-b-4 border-[#ffb81c] inline-block pb-2 text-gray-900 dark:text-white">
            Active Projects
          </h2>
          <div className="space-y-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Want to Help Section */}
        <section className="bg-[#243e8b] rounded-2xl p-8 sm:p-12 text-center text-white mb-32">
          <h2 className="text-3xl font-bold mb-4">Want to help?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            All of our projects welcome new contributors. Click &quot;Join this
            project&quot; on any project above to express your interest, and
            we&apos;ll reach out with next steps.
          </p>
        </section>
      </main>
    </div>
  )
}
