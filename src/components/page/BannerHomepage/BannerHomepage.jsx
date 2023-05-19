import { motion } from 'framer-motion'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import React, { useLayoutEffect, useRef, useState } from 'react'
import SwiperCore, { Autoplay, EffectFade } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { Swiper, SwiperSlide } from 'swiper/react'
import bgWhite from '../../../assets/images/bg-white.jpg'
import diamondYellowSmall from '../../../assets/images/diamond-yellow-small.png'
import DoubleArrowDownIcon from '../../../assets/svgs/double-arrow-down.svg'
import {
  classNames,
  getImage,
  useMediaQuery,
  useOnce,
} from '../../../utils/misc'
import BgBanner from '../../global/BgBanner'
import BgVideo from '../../global/BgVideo'
import ButtonPrimary from '../../global/ButtonPrimary'
import DiscordButton from '../../global/Buttons/DiscordButton'
import LineBreak from '../../global/LineBreak'
import './styles.css'

SwiperCore.use([EffectFade, Autoplay])

const defaultSlideIndex = 0

const godAnimation = {
  loading: { y: -200, opacity: 0 },
  loaded: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 1,
      ease: 'easeInOut',
    },
  },
}

const BannerHomepage = ({ title, domains }) => {
  const [bgSwiper, setBgSwiper] = useState(null) // eslint-disable-line
  const [swiper, setSwiper] = useState(null) // eslint-disable-line
  const [currentSlide, setCurrentSlide] = useState(defaultSlideIndex)

  const [imageLoadState, setImageLoadState] = useState('loading')
  const [descriptionHeight, setDescriptionHeight] = useState('auto')
  const isDesktop = useMediaQuery('(min-width: 64rem)')

  const descriptionRef = useRef(null)
  const maxLengthDescription = domains
    .map(domain => domain.shortDescription)
    .sort((a, b) => b.length - a.length)[0]
  useLayoutEffect(() => {
    if (descriptionRef?.current && isDesktop) {
      descriptionRef.current.innerText = maxLengthDescription
      setDescriptionHeight(descriptionRef.current.clientHeight)
    }
  }, [descriptionRef?.current])

  const data = useStaticQuery(graphql`
    query BannerHomepageQuery {
      wp {
        acfOptionsSiteConfiguration {
          siteConfiguration {
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
  const Component = useOnce('BannerHomepage') ? motion.div : 'div'
  return (
    <section id="banner-homepage">
      <div className="lg:h-screen relative">
        <img
          src={bgWhite}
          alt="Background white"
          className="absolute z-[-5] h-full lg:h-screen w-full object-cover"
        />
        <BgVideo />
        <div className="container lg:h-full pb-10 lg:pb-0">
          <div className="lg:h-full lg:flex">
            <div className="relative lg:static flex-1 lg:h-full lg:flex">
              <BgBanner hideOnMobile={false}>
                <Swiper
                  effect="fade"
                  fadeEffect={{
                    crossFade: true,
                  }}
                  onSwiper={setBgSwiper}
                  loop={true}
                  slidesPerView={1}
                  initialSlide={defaultSlideIndex}
                  className="h-full"
                >
                  {domains.map((domain, i) => (
                    <SwiperSlide key={i} className="relative">
                      <GatsbyImage
                        image={getImage(domain.exampleGod)}
                        className="h-full opacity-40 mix-blend-screen w-full"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-yellow lg:hidden"></div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </BgBanner>
              <div className="relative lg:w-[460px] 2xl:w-[543px] 4k:w-[720px] flex items-center pt-40 lg:pt-18">
                <div className="">
                  <h1
                    className="text-3xl sm:text-4xl 2xl:text-5xl 4k:text-6xl font-bold text-brown uppercase"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                  <div className="mt-6 space-y-2 sm:space-y-0 sm:flex sm:space-x-6">
                    <ButtonPrimary
                      as="a"
                      href={siteConfig.litepaper.localFile.localURL}
                      target="_blank"
                    >
                      Download litepaper
                    </ButtonPrimary>
                    <DiscordButton />
                  </div>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 mx-auto max-w-[300px] sm:max-w-md lg:max-w-full flex-1 relative sm:h-full">
                <Component
                  initial={isDesktop ? 'loading' : 'loaded'}
                  animate={imageLoadState}
                  variants={godAnimation}
                  className="lg:absolute lg:inset-0 z-[-1] flex items-end"
                >
                  <Swiper
                    allowTouchMove={false}
                    effect="fade"
                    fadeEffect={{
                      crossFade: true,
                    }}
                    autoplay={false}
                    onSwiper={setSwiper}
                    loop={true}
                    spaceBetween={50}
                    slidesPerView={1}
                    initialSlide={defaultSlideIndex}
                    onSlideChange={swiper => {
                      if (bgSwiper) {
                        bgSwiper.slideTo(swiper.activeIndex)
                      }
                      setCurrentSlide(swiper.realIndex)
                    }}
                  >
                    {domains.map((domain, i) => (
                      <SwiperSlide key={i}>
                        <GatsbyImage
                          image={getImage(domain.exampleGodNoBackground)}
                          className="w-full"
                          alt={`${domain.name} god`}
                          onLoad={() => {
                            if (i == defaultSlideIndex) {
                              setImageLoadState('loaded')
                              setTimeout(() => {
                                if (swiper.params) {
                                  swiper.params.autoplay.delay = 3000
                                } else {
                                  swiper.params = {
                                    autoplay: {
                                      delay: 3000,
                                    },
                                  }
                                }
                                swiper.autoplay.start()
                              }, 1000)
                            }
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Component>
              </div>
            </div>

            <div className="relative z-10 lg:h-full lg:w-[400px] 4k:w-[600px] mt-[-34px] lg:mt-0 lg:pt-6 flex items-center">
              <div className="text-brown flex flex-col lg:block">
                <div className="mt-4 sm:mt-0 order-3">
                  <div className="flex items-center space-x-4">
                    <GatsbyImage
                      image={getImage(domains[currentSlide].icon)}
                      className="w-16"
                      alt=""
                    />
                    <div>
                      <p className="text-sm uppercase">Domain</p>
                      <p className="text-xl font-bold uppercase">
                        {domains[currentSlide].name}
                      </p>
                    </div>
                  </div>
                  <p
                    className="mt-5 text-base"
                    ref={descriptionRef}
                    style={{ height: descriptionHeight }}
                  >
                    {domains[currentSlide].shortDescription}
                  </p>
                </div>
                <div className="lg:mt-3 flex items-center order-1">
                  <div className="flex-1 h-px bg-yellow"></div>
                  <img
                    src={diamondYellowSmall}
                    alt="Diamond yellow"
                    className="mt-px mx-[-14px]"
                  />
                  <div className="flex-1 h-px bg-yellow"></div>
                </div>
                <div className="mt-3 flex justify-center order-2 4k:justify-between">
                  {domains.map((domain, i) => (
                    <button
                      key={i}
                      onClick={() => swiper.slideTo(i + 1)}
                      onMouseEnter={() => swiper.slideTo(i + 1)}
                      className={classNames('relative flex-1 max-w-[64px]')}
                    >
                      <div
                        className={classNames(
                          'transition-transform transform hover:scale-100',
                          currentSlide == i ? 'scale-100' : 'scale-75'
                        )}
                      >
                        <GatsbyImage image={getImage(domain.icon)} alt="" />
                      </div>

                      <DoubleArrowDownIcon
                        className={classNames(
                          'absolute -top-5 w-4 h-4 left-1/2 -translate-x-1/2 transition-opacity duration-300',
                          currentSlide == i
                            ? 'opacity-100 lg:opacity-0'
                            : 'opacity-0'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <LineBreak />
      </div>
    </section>
  )
}

export default BannerHomepage
