import React from 'react'
import bgBlue from '../../../assets/images/bg-blue.jpg'
import diamondBlueSmall from '../../../assets/images/diamond-blue-small.png'
import GodzHeadSVG from '../../../assets/svgs/godz-head.svg'
import ButtonPrimary from '../../global/ButtonPrimary'
import LineBreak from '../../global/LineBreak'

const BannerIncubatorPage = ({ title, description, buttons }) => {
  return (
    <section id="banner-incubator-page">
      <div className="relative">
        <div className="absolute inset-0">
          <img src={bgBlue} alt="" className="w-full h-full object-cover" />
          <div className="absolute -top-1/2 bottom-[-20%] inset-x-0">
            <div className="h-full max-w-7xl mx-auto">
              <GodzHeadSVG className="opacity-[0.15] text-white mix-blend-overlay" />
            </div>
          </div>
        </div>
        <div className="relative pt-20 pb-72 min-h-screen flex justify-center items-center">
          <div className="container max-w-md flex flex-col items-center">
            <h1
              className="text-7xl sm:text-9xl font-header text-white text-center"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <div className="lg:mt-2.5 flex items-center w-full max-w-[195px]">
              <div className="flex-1 h-px bg-blue-light"></div>
              <img src={diamondBlueSmall} alt="" className="mt-px mx-[-14px]" />
              <div className="flex-1 h-px bg-blue-light"></div>
            </div>
            <p className="mt-4 text-white text-center">{description}</p>
            <div className="mt-9 space-y-3 sm:space-y-0 sm:flex sm:space-x-8">
              <ButtonPrimary
                as="a"
                href={buttons.primary.url}
                target="_blank"
                containerClassName="text-blue-light bg-blue-light"
                bgClassName="bg-blue-dark"
                className="text-brown-light group-hover:text-blue-dark"
              >
                {buttons.primary.text}
              </ButtonPrimary>
              <ButtonPrimary
                as="button"
                onClick={() =>
                  document
                    .getElementById('features')
                    .scrollIntoView({ behavior: 'smooth' })
                }
                containerClassName="text-brown-light bg-brown-light"
                bgClassName="bg-blue-dark"
                className="text-brown-light group-hover:text-blue-dark"
              >
                {buttons.secondary.text}
              </ButtonPrimary>
            </div>
          </div>
        </div>
        <LineBreak className=" bg-blue-light shadow-blue-light" />
      </div>
      <div className="absolute inset-0 -left-px bottom-0 z-[-1] bg-repeat tileable" />
    </section>
  )
}

export default BannerIncubatorPage
