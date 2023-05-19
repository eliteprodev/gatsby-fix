import { graphql, useStaticQuery } from 'gatsby'
import addToMailchimp from 'gatsby-plugin-mailchimp'
import React, { useState } from 'react'
import DiscordIcon from '../../../assets/svgs/discord.svg'
import LoadingIcon from '../../../assets/svgs/loading.svg'
import ButtonPrimary from '../../global/ButtonPrimary'
import Modal from '../../global/Modal'
import * as styles from './styles.module.css'

const EmailSignup = () => {
  const data = useStaticQuery(graphql`
    query EmailSignupQuery {
      wp {
        acfOptionsGlobalComponents {
          globalComponents {
            emailSignup {
              title
              description
              modal {
                title
                description
                buttonText
              }
            }
          }
        }
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
  const { title, description, modal } =
    data.wp.acfOptionsGlobalComponents.globalComponents.emailSignup
  const siteConfig = data.wp.acfOptionsSiteConfiguration.siteConfiguration

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mcData, setMcData] = useState(undefined)

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)
    addToMailchimp(email).then(data => {
      setMcData(data)
      setLoading(false)
    })
  }
  return (
    <section id="email-signup">
      <div className="bg-yellow">
        <div className="pt-9 sm:pt-11 pb-12 sm:pb-14 container 4k:max-w-[1612px]">
          <div className="md:flex md:items-center space-y-6 sm:space-y-8 md:space-y-0 md:space-x-16 lg:space-x-28 2xl:space-x-80 4k:space-x-40">
            <div className="flex-1 text-brown">
              <h2 className="h2">{title}</h2>
              <p className="mt-2 lg:mt-0 text-base md:text-lg lg:text-xl 4k:text-3xl font-bold uppercase">
                {description}
              </p>
            </div>
            <div className="lg:flex-shrink-0 md:w-[300px] lg:w-auto space-y-2 lg:space-y-0 lg:flex lg:space-x-6">
              <ButtonPrimary
                containerClassName="text-brown-light bg-brown-light sm:w-full lg:w-auto"
                onClick={() => setOpen(true)}
              >
                Join Mailing List
              </ButtonPrimary>
              <ButtonPrimary
                containerClassName="text-brown bg-[#F1DB60] bg-opacity-40 sm:w-full lg:w-auto"
                bgClassName=""
                className=""
                as="a"
                href={siteConfig.discord}
                target="_blank"
              >
                <DiscordIcon className="w-6 h-6 twitch" />
                <span>Join discord</span>
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={open}
        close={() => setOpen(false)}
        className={`border border-yellow shadow-yellow ${styles.glow}`}
      >
        <form className="text-brown" onSubmit={handleSubmit}>
          <p className="h1">{modal.title}</p>
          <p className="mt-1 text-base">{modal.description}</p>
          <label htmlFor="email" className="mt-6 block text-sm uppercase">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 block w-full py-3 px-4 shadow-sm placeholder:text-gray-600 border border-yellow backdrop-blur-xl bg-transparent focus:outline-none"
            placeholder="Enter your email address"
            onChange={e => setEmail(e.target.value)}
          />
          <ButtonPrimary
            containerClassName="mt-8 text-yellow bg-yellow !w-full"
            onClick={handleSubmit}
            bgClassName="bg-red"
            className="text-brown-light group-hover:text-brown"
          >
            {loading ? (
              <LoadingIcon className="w-6 h-6" />
            ) : (
              <span>Subscribe Now</span>
            )}
          </ButtonPrimary>
          {mcData &&
            (mcData.result === 'success' ? (
              <p className="mt-2 text-green-600">
                Success! Thank you for subscribing :)
              </p>
            ) : (
              <p class="mt-2 text-red">
                {mcData.msg.includes('is already subscribed')
                  ? 'You are already subscribed (thanks)!'
                  : 'Oops! Something went wrong :('}
              </p>
            ))}
        </form>
      </Modal>
    </section>
  )
}

export default EmailSignup
