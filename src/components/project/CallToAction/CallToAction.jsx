import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import DiscordIcon from '../../../assets/svgs/discord.svg'
import ButtonPrimary from '../../global/ButtonPrimary'

const ProjectCallToAction = () => {
  const data = useStaticQuery(graphql`
    query ProjectCallToAction {
      wp {
        acfOptionsGlobalComponents {
          globalComponents {
            projectCallToAction {
              title
              description
              buttons {
                type
                text
                url
              }
            }
          }
        }
      }
    }
  `)
  const { title, description, buttons } =
    data.wp.acfOptionsGlobalComponents.globalComponents.projectCallToAction
  return (
    <section id="project-cta">
      <div className="bg-yellow">
        <div className="pt-9 sm:pt-11 pb-12 sm:pb-14 container 4k:max-w-[1612px]">
          <div className="md:flex md:items-center space-y-6 sm:space-y-8 md:space-y-0 md:space-x-16 lg:space-x-28 2xl:space-x-80 4k:space-x-40">
            <div className="flex-1 text-brown">
              <div className="max-w-[650px]">
                <h2 className="text-4xl sm:text-6xl 2xl:text-7xl 4k:text-8xl font-header">
                  {title}
                </h2>
                <p className="mt-2 lg:mt-0 text-base md:text-lg lg:text-xl 4k:text-3xl font-bold uppercase">
                  {description}
                </p>
              </div>
            </div>
            <div className="lg:flex-shrink-0 md:w-[300px] lg:w-auto space-y-2 lg:space-y-0 lg:flex lg:space-x-6">
              {buttons.map((button, i) => (
                <ButtonPrimary
                  key={i}
                  as="a"
                  target="_blank"
                  href={button.url}
                  {...(button.type === 'discord'
                    ? {
                        containerClassName:
                          'text-brown bg-[#F1DB60] bg-opacity-40 sm:w-full lg:w-auto',
                        bgClassName: '',
                        className: '',
                      }
                    : {
                        containerClassName:
                          'text-brown-light bg-brown-light sm:w-full lg:w-auto',
                      })}
                >
                  {button.type === 'discord' && (
                    <DiscordIcon className="w-6 h-6 twitch" />
                  )}
                  <span>{button.text}</span>
                </ButtonPrimary>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectCallToAction
