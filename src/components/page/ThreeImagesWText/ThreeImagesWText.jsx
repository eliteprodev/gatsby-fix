import React from 'react'
import BgBanner from '../../global/BgBanner'
import Showcase from '../../global/Showcase'
import bgNavy from './bg-navy.jpg'

const ThreeImagesWText = props => {
  return (
    <section id="three-images-w-text">
      <div className="relative text-white">
        <BgBanner />
        <img
          src={bgNavy}
          alt="Navy Background"
          className="absolute z-[-5] h-full w-full object-cover"
        />
        <Showcase {...props} />
      </div>
    </section>
  )
}

export default ThreeImagesWText
