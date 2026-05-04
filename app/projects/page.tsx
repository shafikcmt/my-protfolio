import SectionTitle from '@/components/SectionTitle'
import ProjectCard from '@/components/ProjectCard'
import { PROJECT_LIST } from '@/lib/constants'

export default function ProjectsPage() {
  return (
    <div className="container-custom py-24">
      <SectionTitle title="Projects" subtitle="Explore signature projects from LMS platforms to eCommerce systems and enterprise tracking solutions." eyebrow="Projects" />
      <div className="grid gap-6 xl:grid-cols-2">
        {PROJECT_LIST.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </div>
  )
}
