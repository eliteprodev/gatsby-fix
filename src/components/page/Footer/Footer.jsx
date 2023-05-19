import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import DiscordIcon from '../../../assets/svgs/discord.svg'
import MagicEdenIcon from '../../../assets/svgs/magic-eden.svg'
import TwitterIcon from '../../../assets/svgs/twitter.svg'
import { classNames } from '../../../utils/misc'

const Footer = ({ fillBackground, absolutelyPositioned }) => {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      allWp {
        nodes {
          acfOptionsSiteConfiguration {
            siteConfiguration {
              copyright
              twitter
              discord
              magicEden
            }
          }
        }
      }
    }
  `)
  const siteConfig =
    data.allWp.nodes[0].acfOptionsSiteConfiguration.siteConfiguration

  const copyright = siteConfig.copyright.replace(
    '[current-year]',
    new Date().getFullYear()
  )
  return (
    <footer>
      <div
        className={classNames(
          absolutelyPositioned && 'absolute inset-x-0 bottom-0'
        )}
      >
        <div
          className={classNames(
            'border-t border-brown-light border-opacity-50',
            fillBackground && 'bg-yellow'
          )}
        >
          <div className="container py-6">
            <div className="flex items-center text-white">
              <p className="text-base opacity-50">{copyright}</p>
              <div className="ml-auto flex space-x-6 items-center">
                <a href={siteConfig.discord} target="_blank">
                  <DiscordIcon className="w-7 h-7" />
                </a>
                <a href={siteConfig.twitter} target="_blank">
                  <TwitterIcon className="w-7 h-7" />
                </a>
                <a href={siteConfig.magicEden} target="_blank">
                  <MagicEdenIcon className="w-9" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
