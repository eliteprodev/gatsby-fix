import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { GatsbyImage } from 'gatsby-plugin-image'
import React, { Fragment } from 'react'
import { classNames, getImage } from '../../../utils/misc'
import Countdown from '../../global/Countdown'
import { useTimeLeft } from '../../global/Countdown/hooks'
import Layout from '../../global/Layout'
import MintContainer from '../../global/Mint/components/MintContainer'
import WalletProviders from '../../global/Mint/components/WalletProviders'
import Socials from '../../global/Socials'
import * as styles from './styles.module.css'

const now = new Date(Date.now() + 10000)

const ProjectSimple = ({ data, pageLocation }) => {
  const simple = data.project.simple
  const mint = data.project.mint
  const video = simple.video
  const goLiveDate = new Date(mint.goLiveDate)
  const { timeLeft, countdownCompleted } = useTimeLeft(
    mint.showCandyMachine
      ? mint.candyMachine.solanaNetwork === 'devnet'
        ? now
        : goLiveDate
      : goLiveDate
  )
  return (
    <WalletProviders
      key="project-simple"
      network={mint.candyMachine.solanaNetwork}
    >
      <Layout
        footer={{ fillBackground: false, absolutelyPositioned: true }}
        theme="blue"
        pageLocation={pageLocation}
      >
        <div className="relative">
          <div className="absolute inset-0 -left-px bottom-0 z-[-1] bg-repeat tileable" />
          <div className="relative container pt-48 pb-36 sm:py-48 lg:py-40 lg:h-full lg:min-h-screen">
            <div className="grid lg:grid-cols-2 lg:h-full gap-x-16 4k:gap-x-32 gap-y-8 sm:gap-y-16">
              <div className="order-2 lg:order-1 lg:h-full flex items-start lg:items-center justify-start 4k:justify-end lg:pl-32 2xl:pl-48">
                <div className="text-brown-light w-full max-w-md 4k:max-w-lg">
                  <p className="mb-4 text-3xl sm:text-4xl 2xl:text-5xl 4k:text-7xl font-header">
                    {simple.title + (countdownCompleted ? ' - Mint Live!' : '')}
                  </p>
                  {!countdownCompleted && (
                    <>
                      <Countdown timeLeft={timeLeft} labelColor="white" />
                      <p className="mt-2">
                        Mint starts{' '}
                        {goLiveDate.toLocaleString('en-US', {
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
                  <Description description={simple.description} />
                  {mint.showCandyMachine && (
                    <div className="mt-6">
                      <MintContainer
                        artificallyIncreaseTotalAndRedeemedBy={
                          mint.candyMachine
                            .artificiallyIncreaseTotalAndRedeemedBy ?? undefined
                        }
                        showMintButton={countdownCompleted}
                        candyMachineId={mint.candyMachine.candyMachineId}
                      />
                    </div>
                  )}
                  {simple.socials && (
                    <div className="mt-8">
                      <Socials socials={simple.socials} />
                    </div>
                  )}
                </div>
              </div>
              <div className="order-1 lg:order-2 lg:h-full">
                <div className="h-full max-h-[50vh] lg:max-h-[75vh]">
                  {simple.mediaType === 'video' && (
                    <video
                      className={classNames(
                        'w-auto max-h-full border border-blue-light text-blue-light text-opacity-30',
                        styles.glow
                      )}
                      width={video.width}
                      height={video.height}
                      autoPlay
                      loop
                      muted
                    >
                      <source src={video.localFile.publicURL} />
                    </video>
                  )}
                  {simple.mediaType === 'normal_image' && (
                    <GatsbyImage
                      image={getImage(simple.image)}
                      className="h-full"
                      imgClassName={classNames(
                        '!w-auto max-h-full border border-blue-light text-blue-light text-opacity-30',
                        styles.glow
                      )}
                      alt=""
                    />
                  )}
                  {simple.mediaType === 'gif_image' && (
                    <img
                      src={simple.imageGif.localFile.publicURL}
                      className={classNames(
                        'w-auto max-h-full border border-blue-light text-blue-light text-opacity-30',
                        styles.glow
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </WalletProviders>
  )
}

export default ProjectSimple

const Description = ({ description }) => {
  const wallet = useAnchorWallet()
  if (!wallet) {
    return (
      <div
        key="my-description"
        className="mt-4 text-brown-light font-bold prose"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    )
  }
  return <Fragment key="my-description-fragment" />
}
