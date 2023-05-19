import React from 'react'
import GodzLogoSVG from '../../../assets/svgs/logo.svg'
import { normalize } from '../../../utils/misc'
import ButtonPrimary from '../../global/ButtonPrimary'
import diamondBlueHollow from './assets/diamond-blue-hollow.png'
import diamondBlueSolid from './assets/diamond-blue-solid.png'
import diamondWhiteHollow from './assets/diamond-white-hollow.png'

const Features = ({ subtitle, title, features, description }) => {
  return (
    <section id="features">
      <div className="pt-8 pb-14">
        <div className="container">
          <div className="relative py-8 sm:py-20">
            <div className="absolute inset-0 hidden md:block">
              <GodzLogoSVG className="text-white opacity-30 mix-blend-overlay" />
            </div>
            <div className="relative">
              <p className="text-2xl text-yellow font-header text-center">
                {subtitle}
              </p>
              <h2 className="mt-1.5 text-4xl sm:text-5xl uppercase text-white text-center">
                {title}
              </h2>
              <div className="mt-11 grid md:grid-cols-5 gap-10 md:gap-20">
                {features.map((row, i) => {
                  const normalized = normalize(i, features.length)
                  return (
                    <div key={i}>
                      <div className="flex justify-center">
                        {normalized === 0 && (
                          <img src={diamondWhiteHollow} alt="" />
                        )}
                        {normalized === 1 && (
                          <img src={diamondBlueHollow} alt="" />
                        )}
                        {normalized === 2 && (
                          <img src={diamondBlueSolid} alt="" />
                        )}
                      </div>
                      <p className="mt-2 md:mt-8 max-w-[250px] mx-auto text-white text-center font-bold">
                        {row.feature}
                      </p>
                    </div>
                  )
                })}
              </div>

              <p className="mt-16 text-center max-w-3xl mx-auto text-blue-light">
                {description}
              </p>

              <div className="mt-8 flex justify-center">
                <ButtonPrimary
                  as="a"
                  href="https://forms.gle/rFyrSGjGFtJUL6dE6"
                  target="_blank"
                  containerClassName="text-blue-light bg-blue-light"
                  bgClassName="bg-blue-dark"
                  className="text-brown-light group-hover:text-blue-dark"
                >
                  Apply Now
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
