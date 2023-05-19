import { graphql, useStaticQuery } from 'gatsby'
import React, { useEffect, useRef, useState } from 'react'
import { classNames, useMediaQuery } from '../../../utils/misc'
import BgBanner from '../../global/BgBanner'
import BgVideo from '../../global/BgVideo'
import ButtonPrimary from '../../global/ButtonPrimary'
import LineBreak from '../../global/LineBreak'
import bgNavy from './assets/bg-navy.png'
import diamondWhiteSolidSmall from './assets/diamond-white-solid-small.png'
import diamondWhiteSolid from './assets/diamond-white-solid.png'
import diamondWhite from './assets/diamond-white.png'
import diamondYellowSmall from './assets/diamond-yellow-small.png'
import diamondYellowSolidSmall from './assets/diamond-yellow-solid-small.png'
import diamondYellowSolid from './assets/diamond-yellow-solid.png'
import diamondYellow from './assets/diamond-yellow.png'
import * as styles from './styles.module.css'

const white = {
  normal: diamondWhite,
  solid: diamondWhiteSolid,
  solidSmall: diamondWhiteSolidSmall,
}

const yellow = {
  normal: diamondYellow,
  solid: diamondYellowSolid,
  solidSmall: diamondYellowSolidSmall,
}

const Roadmap = ({ title, phases }) => {
  const data = useStaticQuery(graphql`
    query RoadmapQuery {
      wp {
        acfOptionsSiteConfiguration {
          siteConfiguration {
            discord
            litepaper {
              localFile {
                localURL
              }
            }
          }
        }
      }
    }
  `)
  const siteConfig = data.wp.acfOptionsSiteConfiguration.siteConfiguration

  const phaseTitleRefs = useRef([])
  const featureRefs = useRef([])
  const descriptionRefs = useRef([])
  const [phaseTitleWidth, setPhaseTitleWidth] = useState(undefined)
  const [heights, setHeights] = useState([])
  const isScreenLargerThan1080p = useMediaQuery('(min-width: 1920px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isBrowser = typeof window !== 'undefined'
  useEffect(() => {
    if (typeof phaseTitleWidth === 'undefined' && isDesktop) {
      const widths = phaseTitleRefs.current.map(ref => ref.clientWidth)
      const maxWidth = Math.max(...widths)
      setPhaseTitleWidth(maxWidth)
    }
  }, [phaseTitleWidth])
  useEffect(() => {
    if (heights.length == 0 && isDesktop) {
      const maxHeights = descriptionRefs.current.map((descriptionRef, i) => {
        const featureRef = featureRefs.current[i]
        return Math.max(descriptionRef.clientHeight, featureRef.clientHeight)
      })
      setHeights(maxHeights)
    }
  }, [heights])
  useEffect(() => {
    const onResize = () => {
      setPhaseTitleWidth(undefined)
      setHeights([])
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section id="roadmap">
      <div className="relative">
        <BgBanner />
        <BgVideo className={`z-[-4] ${styles.fadeUp}`} />
        <img
          src={bgNavy}
          alt="Navy Background"
          className="absolute z-[-5] h-full w-full object-cover"
        />
        {/* Gatsby freaks out if this ternary isn't wrapped with something */}
        <div>
          {!isBrowser ? (
            <></>
          ) : isDesktop ? (
            <div className="relative">
              <div className="relative h-[48px] xl:h-[60px] 2xl:h-[72px] 4k:h-[96px]">
                <BgBanner>
                  <h2 className="text-3xl sm:text-5xl lg:text:text-4xl xl:text-6xl 2xl:text-7xl 4k:text-8xl font-header text-brown text-center">
                    {title}
                  </h2>
                </BgBanner>
              </div>
              <div className="space-y-20 mt-14">
                {phases.map((phase, i) => {
                  const diamond = phase.complete ? yellow : white
                  return (
                    <div key={i} className="relative">
                      <BgBanner>
                        <div
                          className="px-10 text-brown"
                          ref={el => (descriptionRefs.current[i] = el)}
                          style={{
                            height: heights.length > 0 ? heights[i] : undefined,
                          }}
                        >
                          <p className="text-sm">{phase.date}</p>
                          <div
                            className="mt-10 4k:mt-7 text-base"
                            dangerouslySetInnerHTML={{
                              __html: phase.description,
                            }}
                          />
                        </div>
                      </BgBanner>
                      <div className="container">
                        <div className="flex">
                          <div className="flex-1 flex items-start">
                            <div className="flex items-center w-[calc(70%)]">
                              <div
                                className={classNames(
                                  'flex items-center min-w-[64px]  -ml-4 2xl:-ml-8 ',
                                  isScreenLargerThan1080p
                                    ? 'w-[15%]'
                                    : ' w-[calc((100vw-1612px)/2)]'
                                )}
                              >
                                <div
                                  className={classNames(
                                    'flex-1 h-px',
                                    phase.complete ? 'bg-yellow' : 'bg-white'
                                  )}
                                />
                                <img
                                  src={diamond.solidSmall}
                                  alt=""
                                  className="-ml-3.5"
                                />
                              </div>
                              <p
                                className={classNames(
                                  'text-2xl font-header text-white whitespace-nowrap',
                                  phase.complete ? 'text-yellow' : 'text-white'
                                )}
                                ref={el => (phaseTitleRefs.current[i] = el)}
                                style={{
                                  width: phaseTitleWidth,
                                }}
                              >
                                {phase.title}
                              </p>
                              <img
                                src={diamond.normal}
                                alt=""
                                className="mt-px ml-5 2xl:ml-14"
                              />
                              <div className="-ml-3.5 -mr-3.5 flex-1 h-px bg-white sm:w-[50%] lg:w-[35%]"></div>
                              <img src={diamond.solid} alt="" className="" />
                            </div>
                            <div
                              ref={el => (featureRefs.current[i] = el)}
                              className="w-[30%]"
                              style={{
                                height:
                                  heights.length > 0 ? heights[i] : undefined,
                              }}
                            >
                              <div className="pt-6 text-white">
                                <p className="text-2xl font-header">
                                  {phase.mainFeature}
                                </p>
                                <OtherFeatures phase={phase} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="py-16 relative">
                <div className="h-[50px]"></div>
                <BgBanner above={true}>
                  <div className="h-full flex items-center justify-center">
                    <ButtonPrimary
                      as="a"
                      href={siteConfig.litepaper.localFile.localURL}
                      target="_blank"
                    >
                      Download litepaper
                    </ButtonPrimary>
                  </div>
                </BgBanner>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="space-y-10">
                {phases.map((phase, i) => {
                  const diamond = phase.complete ? yellow : white
                  return (
                    <div key={i}>
                      <div className="flex items-center">
                        <div className="flex items-center w-[187px]">
                          <div
                            className={classNames(
                              'flex-1 h-px',
                              phase.complete ? 'bg-yellow' : 'bg-white'
                            )}
                          />
                          <img
                            src={diamond.solidSmall}
                            alt=""
                            className="-ml-3.5"
                          />
                        </div>
                        <p
                          className={classNames(
                            'text-2xl font-header text-white whitespace-nowrap',
                            phase.complete ? 'text-yellow' : 'text-white'
                          )}
                        >
                          {phase.title}
                        </p>
                      </div>
                      <div className="mt-5 container">
                        <p className="text-sm text-yellow">{phase.date}</p>
                        <div
                          className="mt-2.5 text-base text-white"
                          dangerouslySetInnerHTML={{
                            __html: phase.description,
                          }}
                        />
                        <div className="-ml-4 sm:-ml-6 mt-7 flex items-center">
                          <img src={diamond.solid} alt="" className="" />
                          <p className="text-2xl font- text-white">
                            {phase.mainFeature}
                          </p>
                        </div>
                        <OtherFeatures className="mt-1" phase={phase} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="py-16 container">
                <ButtonPrimary
                  as="a"
                  href={siteConfig.litepaper.localFile.localURL}
                  target="_blank"
                >
                  Download litepaper
                </ButtonPrimary>
              </div>
            </div>
          )}
        </div>
        <LineBreak className="bg-yellow shadow-yellow -mb-3" />
      </div>
    </section>
  )
}

export default Roadmap

const OtherFeatures = ({ phase, className }) => {
  return (
    <ul className={className}>
      {phase.otherFeatures.map((row, i) => (
        <li key={i} className="flex space-x-1">
          <div className="relative w-[32px] h-[32px] overflow-hidden flex-shrink-0">
            <div className="absolute top-1/2 left-1/2 w-[calc((100%-12px)*2.421)] h-[calc((100%-12px)*2.421)] -translate-y-1/2 -translate-x-1/2">
              <img src={diamondYellowSmall} alt="Diamond yellow small" />
            </div>
          </div>
          <span className="mt-[3px] 4k:mt-0 text-base flex-shrink text-white">
            {row.feature}
          </span>
        </li>
      ))}
    </ul>
  )
}
