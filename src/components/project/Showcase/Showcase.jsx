import React from 'react'
import Showcase from '../../global/Showcase'

const ProjectShowcase = props => {
  return (
    <section id="project-showcase">
      <div className="text-brown-light">
        <Showcase {...props} />
      </div>
    </section>
  )
}

export default ProjectShowcase
