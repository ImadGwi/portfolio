// src/components/project/ProjectsSection.jsx
import ScrollFloat from '@/components/motion/ScrollFloat';
import ProjectCard from '@/components/project/ProjectCard';
import { getProjects } from '@/components/main/mainApi';

export default async function ProjectsSection() {
  const { projects } = await getProjects();
  // console.log(projects);


  return (
    <section className="px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-widest mb-8" style={{ color: 'var(--chrome)' }}>
          [ {projects?.length ?? 0}  PROJECTS ]
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects?.map((project) => (
            // <ScrollFloat
            //   key={project.id}
            //   animationDuration={1}
            //   ease="back.inOut(2)"
            //   scrollStart="center bottom+=50%"
            //   scrollEnd="bottom bottom-=40%"
            //   stagger={0.03}
            // >
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}