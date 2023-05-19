import { GatsbyImage } from 'gatsby-plugin-image'
import React, { useState } from 'react'
import SwiperCore, { Autoplay } from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { classNames, getImage } from '../../../utils/misc'
import * as styles from './styles.module.css'

SwiperCore.use([Autoplay])

const Showcase = ({ images, subtitle, title, description }) => {
  const [currentSlide, setCurrentSlide] = useState(1)
  return (
    <div id="showcase">
      <div className="relative py-12 sm:py-18 overflow-hidden">
        <div className="container-sm">
          <div className="lg:flex space-x-0 lg:space-x-12 space-y-12 lg:space-y-0">
            <div className="flex-1 py-[16%] sm:py-[5%] -mx-[40%] sm:mx-0">
              <div className="relative">
                <div className="w-[calc(100%/3)]">
                  <div className="pb-[126%]"></div>
                </div>
                <div className="absolute inset-0 flex items-center">
                  <Swiper
                    loop={true}
                    initialSlide={1}
                    spaceBetween={0}
                    slidesPerView={3}
                    autoplay={{
                      delay: 5000,
                    }}
                    onSlideChange={swiper => {
                      setCurrentSlide((swiper.realIndex + 1) % images.length)
                    }}
                  >
                    {images.map((image, i) => (
                      <SwiperSlide
                        key={i}
                        className={classNames(
                          'py-[10%] cursor-pointer',
                          i == currentSlide && 'z-10'
                        )}
                        style={{ width: 500 }}
                      >
                        <div className="relative pb-[126%]">
                          <div
                            className={classNames(
                              'absolute inset-0 border-2 border-yellow shadow-yellow transition-all',
                              styles.glow,
                              i == currentSlide && 'inset-[-20%]'
                            )}
                          >
                            <GatsbyImage
                              image={getImage(image)}
                              className={classNames('w-full h-full')}
                              alt=""
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
            <div className="lg:w-[36%] flex flex-col justify-center">
              <h2 className="mb-1 text-sm uppercase text-yellow">{subtitle}</h2>
              <p
                className="h2 font-header"
                dangerouslySetInnerHTML={{ __html: title }}
              />
              <div
                className="mt-2 space-y-1 text-base"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Showcase
