import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import DiscordIcon from '../../../../assets/svgs/discord.svg'
import ButtonPrimary from '../../ButtonPrimary'
import './styles.css'

const DiscordButton = ({
  containerClassName = 'text-brown',
  className = 'backdrop-blur-[32px] text-brown',
}) => {
  const data = useStaticQuery(graphql`
    query DiscordButtonQuery {
      wp {
        acfOptionsSiteConfiguration {
          siteConfiguration {
            discord
          }
        }
      }
    }
  `)
  const siteConfig = data.wp.acfOptionsSiteConfiguration.siteConfiguration
  return (
    <ButtonPrimary
      containerClassName={containerClassName}
      bgClassName=""
      className={className}
      as="a"
      href={siteConfig.discord}
      target="_blank"
    >
      <DiscordIcon className="w-6 h-6 twitch" />
      <span>Join discord</span>
    </ButtonPrimary>
  )
}

export default DiscordButton
