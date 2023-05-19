import { GlobeAltIcon as WebsiteIcon } from '@heroicons/react/outline'
import React, { FC } from 'react'
import DiscordIcon from '../../../assets/svgs/discord.svg'
import TwitterIcon from '../../../assets/svgs/twitter.svg'

type SocialType = 'discord' | 'twitter' | 'website'

interface SocialsProps {
  socials: {
    type: SocialType
    url: string
  }[]
}

interface SocialMap {
  icons: {
    [type in SocialType]:
      | React.FunctionComponent<React.SVGAttributes<SVGElement>>
      | ((props: React.ComponentProps<'svg'>) => JSX.Element)
  }
  text: {
    [type in SocialType]: string
  }
}
const map: SocialMap = {
  icons: {
    discord: DiscordIcon,
    twitter: TwitterIcon,
    website: WebsiteIcon,
  },
  text: {
    discord: 'Join Discord',
    twitter: 'Follow Twitter',
    website: 'View Website',
  },
}

const Socials: FC<SocialsProps> = ({ socials }) => {
  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-6 xl:space-x-12 sm:items-center">
      {socials.map((social, i) => {
        const Icon = map.icons[social.type]

        return (
          <a
            key={i}
            href={social.url}
            target="_blank"
            className="flex items-center space-x-3 4k:space-x-4"
          >
            <Icon className="w-7 h-7" />
            <span className="text-2xl 4k:text-3xl font-header">
              {map.text[social.type]}
            </span>
          </a>
        )
      })}
    </div>
  )
}

export default Socials
