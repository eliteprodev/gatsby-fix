/* eslint react/jsx-no-target-blank: 0 */
import { Menu, Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import { graphql, Link, useStaticQuery } from 'gatsby'
import React, { Fragment, useContext, useState } from 'react'
import discord from '../../../assets/images/discord.png'
import magicEden from '../../../assets/images/magic-eden.png'
import twitter from '../../../assets/images/twitter.png'
import LogoBannerBlueSVG from '../../../assets/svgs/logo-banner-blue.svg'
import LogoBannerYellowSVG from '../../../assets/svgs/logo-banner-yellow.svg'
import {
  arrayToTree,
  classNames,
  getLinkProps,
  useOnce,
} from '../../../utils/misc'
import { ThemeContext } from '../Layout/Layout'

const icons = [
  {
    graphqlName: 'twitter',
    image: twitter,
  },
  {
    graphqlName: 'discord',
    image: discord,
  },
  {
    graphqlName: 'magicEden',
    image: magicEden,
  },
]

const themeColors = {
  yellow: {
    mobileMenu: {
      divide: 'divide-brown',
      close: 'text-brown',
      bg: 'from-white to-brown-light',
      iconsBg: 'bg-brown',
      item: {
        normal: 'text-brown-medium hover:text-brown',
        active: 'text-brown',
      },
    },
    desktopMenu: {
      item: {
        normal: 'text-brown-light hover:text-brown',
        active: 'text-brown',
      },
    },
  },
  blue: {
    mobileMenu: {
      divide: 'divide-white',
      close: 'text-white',
      bg: 'from-blue-very-dark to-blue-dark',
      iconsBg: '',
      item: {
        normal: 'text-white hover:text-blue-light',
        active: 'text-blue-light',
      },
    },
    desktopMenu: {
      item: {
        normal: 'text-white hover:text-blue-light',
        active: 'text-blue-light',
      },
    },
  },
}

const Header = ({ pageLocation }) => {
  const theme = useContext(ThemeContext)
  const data = useStaticQuery(graphql`
    query HeaderMenu {
      wpMenu(locations: { eq: HEADER }) {
        menuItems {
          nodes {
            id
            label
            path
            parentId
          }
        }
      }
      wp {
        acfOptionsSiteConfiguration {
          siteConfiguration {
            twitter
            discord
            magicEden
          }
        }
      }
    }
  `)
  const siteConfig = data.wp.acfOptionsSiteConfiguration.siteConfiguration
  console.log("menu ", data)
  const rawNavData = data.wpMenu.menuItems.nodes
  const navData = arrayToTree(rawNavData, getLinkProps(pageLocation.pathname))
  const Component = useOnce('Header') ? motion.div : 'div'
  return (
    <header>
      <div className="absolute z-30 inset-x-0">
        <div className="container py-5 sm:py-7 flex w-full">
          <Link
            to="/"
            className="absolute top-0 w-[70px] lg:w-[90px] 2xl:w-[134px] "
          >
            <div className="pb-[208%]">
              <Component
                className="absolute inset-0 overflow-hidden"
                initial={{ bottom: '100%' }}
                animate={{
                  bottom: 0,
                  transition: {
                    delay: 1,
                    duration: 0.5,
                    ease: 'easeInOut',
                  },
                }}
              >
                <div className="absolute h-0 w-full top-0 left-0 pb-[208%]">
                  {theme === 'yellow' && (
                    <LogoBannerYellowSVG className="absolute inset-0" />
                  )}
                  {theme === 'blue' && (
                    <LogoBannerBlueSVG className="absolute inset-0" />
                  )}
                </div>
              </Component>
            </div>
          </Link>
          <div className="ml-auto">
            <DesktopMenu navData={navData} siteConfig={siteConfig} />
            <MobileMenu
              navData={navData}
              siteConfig={data.wp.acfOptionsSiteConfiguration.siteConfiguration}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

const DesktopMenu = ({ navData, siteConfig }) => {
  const theme = useContext(ThemeContext)
  const buttonClass = 'p-2 text-2xl font-header transition-colors'
  return (
    <Popover.Group className="hidden lg:flex items-center space-x-5 sm:space-x-10">
      <div className="flex space-x-0 sm:space-x-6 ">
        {navData.map(item =>
          item.children ? (
            <Menu as="div" key={item.name} className="relative">
              <Menu.Button
                className={`${buttonClass} flex items-center space-x-2`}
              >
                <span>{item.name}</span>
                <ChevronDownIcon className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Menu.Items className="absolute transform z-20 w-screen max-w-[250px] left-auto right-0 2xl:left-1/2 2xl:-translate-x-1/2 2xl:right-auto">
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden py-3">
                    {item.children.map(childItem => (
                      <Menu.Item key={childItem.name}>
                        <DesktopMenuSubMenuItem item={childItem} />
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link
              key={item.name}
              to={item.to}
              state={item.state}
              className={classNames(
                buttonClass,
                themeColors[theme].desktopMenu.item[
                  item.active ? 'active' : 'normal'
                ]
              )}
            >
              {item.name}
            </Link>
          )
        )}
        <div className="flex space-x-2">
          {icons.map((icon, i) => (
            <a
              key={i}
              href={siteConfig[icon.graphqlName]}
              className="relative w-[52px] h-[52px]"
              target="_blank"
            >
              <div className="absolute top-1/2 left-1/2 w-[calc((100%-4px)*1.5625)] h-[calc((100%-4px)*1.5625)] -translate-y-1/2 -translate-x-1/2">
                <img src={icon.image} alt={icon.graphqlName} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </Popover.Group>
  )
}

const DesktopMenuSubMenuItem = ({ item, depth = 0 }) => {
  let pl, weight
  if (depth === 0) {
    pl = 'pl-5'
    weight = 'font-medium'
  } else if (depth === 1) {
    pl = 'pl-8'
  } else if (depth > 1) {
    pl = 'pl-11'
  }
  return (
    <>
      <Link
        key={item.name}
        to={item.to}
        className={`block ${pl} pr-5 py-2 ${weight} text-blue-600 hover:text-white hover:bg-blue-600`}
      >
        <span>{item.name}</span>
      </Link>
      {item.children &&
        item.children.map(childItem => (
          <DesktopMenuSubMenuItem
            key={childItem.name}
            item={childItem}
            depth={depth + 1}
          />
        ))}
    </>
  )
}

const mobileNavItemClass = 'block px-2 py-3 text-xl font-header'

const MobileMenu = ({ navData, siteConfig }) => {
  const theme = useContext(ThemeContext)
  return (
    <Popover>
      <Popover.Button className="block lg:hidden font-medium text-white focus-white">
        <span className="sr-only">Open main menu</span>
        <MenuIcon className="h-8 w-8" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute z-20 top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden"
        >
          <div
            className={classNames(
              'relative rounded-lg shadow-md ring-1 ring-black ring-opacity-5 overflow-hidden bg-gradient-to-bl',
              themeColors[theme].mobileMenu.bg
            )}
          >
            <Popover.Button
              className={classNames(
                'absolute z-10 op-0 right-0 box-content p-3 inline-flex items-center justify-center focus-white',
                themeColors[theme].mobileMenu.close
              )}
            >
              <span className="sr-only">Close main menu</span>
              <XIcon className="h-8 w-8" aria-hidden="true" />
            </Popover.Button>

            <div className="relative pt-10">
              <div
                className={classNames(
                  'px-5 divide-y',
                  themeColors[theme].mobileMenu.divide
                )}
              >
                {navData.map(item => (
                  <Fragment key={item.name}>
                    {item.children ? (
                      <MobileMenuParentItem item={item} />
                    ) : (
                      <Link
                        to={item.to}
                        state={item.state}
                        className={classNames(
                          mobileNavItemClass,
                          themeColors[theme].mobileMenu.item[
                            item.active ? 'active' : 'normal'
                          ]
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </Fragment>
                ))}
              </div>
              <div
                className={classNames(
                  'py-4 px-5 flex space-x-3',
                  themeColors[theme].mobileMenu.iconsBg
                )}
              >
                {icons.map((icon, i) => (
                  <a
                    key={i}
                    href={siteConfig[icon.graphqlName]}
                    className="relative w-11 h-11"
                    target="_blank"
                  >
                    <div className="absolute top-1/2 left-1/2 w-[calc((100%-4px)*1.5625)] h-[calc((100%-4px)*1.5625)] -translate-y-1/2 -translate-x-1/2">
                      <img src={icon.image} alt={icon.graphqlName} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

const MobileMenuParentItem = ({ item }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className={classNames(
          mobileNavItemClass,
          'font-medium flex w-full text-left items-center space-x-2'
        )}
        onClick={() => setOpen(!open)}
      >
        <span>{item.name}</span>
        <ChevronDownIcon
          className={classNames('w-5 h-5 transform', open && 'rotate-180')}
        />
      </button>
      {open &&
        item.children.map(childItem => (
          <MobileMenuSubItem key={childItem.name} item={childItem} />
        ))}
    </>
  )
}

const MobileMenuSubItem = ({ item, depth = 0 }) => {
  let pl
  if (depth === 0) {
    pl = 'pl-5'
  } else if (depth === 1) {
    pl = 'pl-8'
  } else if (depth > 1) {
    pl = 'pl-11'
  }
  return (
    <>
      <Link
        key={item.name}
        to={item.to}
        state={item.state}
        className={classNames(mobileNavItemClass, pl)}
      >
        {item.name}
      </Link>
      <>
        {item.children &&
          item.children.map(childItem => (
            <MobileMenuSubItem
              key={childItem.name}
              item={childItem}
              depth={depth + 1}
            />
          ))}
      </>
    </>
  )
}
