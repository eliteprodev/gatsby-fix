import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import React from 'react'
import bgWhite from '../../../assets/images/bg-white.jpg'
import conceptArt from '../../../assets/images/concept-art.png'
import { classNames, getImage } from '../../../utils/misc'
import BgBanner from '../../global/BgBanner'
import BgVideo from '../../global/BgVideo'
import Countdown from '../../global/Countdown'
import { useTimeLeft } from '../../global/Countdown/hooks'
import MintContainer from '../../global/Mint/components/MintContainer'
import WalletProviders from '../../global/Mint/components/WalletProviders'
import Socials from '../../global/Socials'
import Marquee from './Marquee'

// const now = new Date()
// now.setSeconds(now.getSeconds() + 5)

const Mint = ({ mintDate, title, description, backgroundColumns }) => {
  const data = useStaticQuery(graphql`
    query MintQuery {
      wp {
        acfOptionsSiteConfiguration {
          siteConfiguration {
            discord
            twitter
            magicEden
          }
        }
      }
    }
  `)
  const theMintDate = new Date(mintDate)

  const { timeLeft, countdownCompleted } = useTimeLeft(theMintDate)
  const siteConfig = data.wp.acfOptionsSiteConfiguration.siteConfiguration
  return (
    <section id="mint">
      <div className="relative">
        <img
          src={bgWhite}
          alt="Background white"
          className="absolute w-full h-full z-[-5] object-cover"
        />
        <BgVideo />
        <BgBanner>
          <img
            src={conceptArt}
            alt="Concept art"
            className="w-full h-full opacity-50 mix-blend-soft-light object-cover"
          />
          <div className="absolute inset-0 left-[-35%] grid grid-cols-3 gap-x-4">
            {backgroundColumns.map((column, i) => (
              <div key={i} className={classNames('relative h-full')}>
                <Marquee
                  duration={90000}
                  height="100%"
                  width="100%"
                  axis="Y"
                  align="center"
                  pauseOnHover={false}
                  reverse={i % 2 === 1}
                >
                  {column.images.map((image, j) => (
                    <div className="py-2" key={j}>
                      <GatsbyImage key={j} image={getImage(image)} alt="" />
                    </div>
                  ))}
                </Marquee>
              </div>
            ))}
          </div>
        </BgBanner>
        <div className="relative min-h-screen flex items-center pt-36 pb-28 lg:py-0">
          <div className="container w-full lg:flex">
            <div className="lg:w-[65%]"></div>
            <div className="flex-1 text-brown">
              {countdownCompleted ? (
                <p className="h1">Mint live!</p>
              ) : (
                <>
                  <p className="mb-4 text-3xl sm:text-4xl 2xl:text-5xl 4k:text-7xl font-header">
                    {title}
                  </p>
                  <Countdown timeLeft={timeLeft} labelColor="white" />
                  <p className="mt-2">
                    Mint starts{' '}
                    {theMintDate.toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}{' '}
                    (in your timezone)
                  </p>
                </>
              )}

              <div className="mt-4">
                <WalletProviders network="mainnet-beta">
                  <MintContainer
                    showMintButton={countdownCompleted}
                    candyMachineId="CsdL66FHGmx7JwP1hqb8EqbE5rqM5wKAo3FYEj6aMLC1"
                  />
                </WalletProviders>
              </div>

              {!countdownCompleted && (
                <p className="mt-4 text-xl font-bold">{description}</p>
              )}

              <div className="mt-8">
                <Socials
                  socials={[
                    { type: 'discord', url: siteConfig.discord },
                    { type: 'twitter', url: siteConfig.twitter },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mint
