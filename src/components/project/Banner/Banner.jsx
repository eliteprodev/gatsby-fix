import { GatsbyImage } from 'gatsby-plugin-image'
import React from 'react'
import { getImage } from '../../../utils/misc'
import LineBreak from '../../global/LineBreak'
import Socials from '../../global/Socials'
import Status from '../../page/ProjectsPreview/Status'
import monolith from '../../../assets/video/monolith.webm'
import { classNames } from '../../../utils/misc'

const ProjectBanner = ({
  image,
  status,
  title,
  launchDate,
  shortDescription,
  socials,
}) => {
  return (
    <section id="project-banner">
      <div className="relative pb-[50%] lg:pb-0 lg:h-[calc(100vh-190px)]">
        <div className="absolute inset-0">
         
          {/* <GatsbyImage image={getImage(image)} className="h-full" alt="" /> */}
          <video
            className={classNames(
              'absolute pointer-events-none top-0 left-0 w-full h-full object-cover mix-blend-screen',
            )}
            autoPlay
            loop
            muted
          >
            <source src={monolith} type="video/webm" />
          </video>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgba(0,0,0,0.9)] to-transparent" />
          <LineBreak className="h-1 bg-blue-light shadow-blue-light" />
        </div>
      </div>
      <div className="container py-10 lg:flex">
        <div className="flex-1">
          <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Status status={status} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl 4k:text-7xl text-brown-light uppercase">
              {title}
            </h1>
          </div>
          <div className="mt-8 text-brown-light">
            <Socials socials={socials} />
          </div>
        </div>
        {/* <div className="mt-10 lg:mt-0 lg:w-[450px] 4k:w-[800px]">
          <p className="text-base 4k:text-2xl text-yellow uppercase">
            Launch Date: {launchDate}
          </p>
          <p className="mt-2 text-base 4k:text-2xl text-brown-light">
            {shortDescription}
          </p>
        </div> */}
      </div>
    </section>
  )
}

export default ProjectBanner
