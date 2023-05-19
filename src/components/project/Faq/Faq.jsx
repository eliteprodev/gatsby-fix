import React from 'react'
import Faq from '../../global/Faq'
import LineBreak from '../../global/LineBreak'

const ProjectFaq = props => {
  return (
    <section id="project-faq">
      <div className="relative">
        <div className="pt-10 pb-20 sm:pt-24 sm:pb-40">
          <Faq {...props} />
        </div>
        <LineBreak />
      </div>
    </section>
  )
}

export default ProjectFaq
