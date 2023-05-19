import { Link } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import React from 'react'
import { classNames, getImage } from '../../../utils/misc'
import Status from './Status'
import * as styles from './styles.module.css'

const ProjectsPreview = ({ title, projects }) => {
  return (
    <section id="projects-preview">
      <div className="relative -mt-60 container pb-14 sm:pb-28">
        <p className="text-2xl font-header text-yellow">{title}</p>
        <div className="mt-4 grid md:grid-cols-3 gap-10 2xl:gap-20">
          {projects.map((row, i) => {
            const project = row.project.project
            project.title = row.project.title
            const to = row.project.uri
            const renderLink = row.project.project.createPageForThisProject
            return (
              <div key={i}>
                {renderLink ? (
                  <Link to={to}>
                    <ProjectPreview project={project} />
                  </Link>
                ) : (
                  <ProjectPreview project={project} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const ProjectPreview = ({ project }) => {
  return (
    <div className="group">
      <div
        className={classNames(
          'relative border border-blue-light text-blue-light text-opacity-30',
          styles.glow
        )}
      >
        <div className="aspect-w-1 aspect-h-1">
          <div>
            {project.previewImageType === 'gif' ? (
              <img
                src={project.previewImageGif.localFile.publicURL}
                className="w-full h-full"
              />
            ) : (
              <GatsbyImage
                image={getImage(project.previewImage)}
                sizes="(min-width: 2560px) calc((100vw - 308px) / 3), (min-width: 1612px) calc(1612px / 3), (min-width: 768px) calc(100vw / 3), 100vw"
                className="w-full h-full"
              />
            )}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Status status={project.status} />
        </div>
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t  from-blue-very-dark">
          <h2 className="text-4xl sm:text-3xl lg:text-5xl text-white">
            {project.title}
          </h2>
          {project.createPageForThisProject && (
            <div className="lg:h-0 transition-all lg:group-hover:h-12 overflow-hidden">
              <p className="pt-4 font-header text-yellow text-2xl">
                View project →
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="py-4">
        <p className="text-sm text-yellow uppercase">
          Launch date: {project.launchDate}
        </p>
        <p className="mt-2 text-white font-bold">{project.shortDescription}</p>
      </div>
    </div>
  )
}

export default ProjectsPreview
