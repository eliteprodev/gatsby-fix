import React from 'react'
import Faq from '../../global/Faq'

const PageFaq = props => {
  return (
    <section id="faq">
      <div className="pt-8 sm:pt-32 pb-36 sm:pb-44">
        <Faq {...props} />
      </div>
    </section>
  )
}

export default PageFaq
