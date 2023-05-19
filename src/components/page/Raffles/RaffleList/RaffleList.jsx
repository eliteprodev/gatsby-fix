import { graphql, useStaticQuery } from 'gatsby'
import React, { Fragment, useEffect, useState } from 'react'
import { classNames, combineFields } from '../../../../utils/misc'
import Raffle from './Raffle/Raffle'

const RaffleList = ({ title }) => {
  const data = useStaticQuery(graphql`
    query GetAllRaffles {
      allWpRaffle {
        nodes {
          databaseId
          title
          raffle {
            imageType
            image {
              localFile {
                childImageSharp {
                  gatsbyImageData(width: 500)
                }
              }
            }
            imageGif {
              publicUrl
            }
            description
            treasuryWallet
            pricePerTicket
            maxTickets
            numberOfWinners
            startDate
            endDate
            participants {
              wallet
              ticketsPurchased
              winner
            }
          }
        }
      }
    }
  `)
  const raffles = data.allWpRaffle.nodes.map(node =>
    combineFields(node, ['raffle'])
  )

  const [liveRaffles, setLiveRaffles] = useState([])
  const [finishedRaffles, setFinishedRaffles] = useState([])
  const [tabs, setTabs] = useState([
    { name: 'Live', count: '0', current: true },
    { name: 'Finished', count: '0', current: false },
  ])
  const currentTab = tabs.find(tab => tab.current)
  const currentRaffles =
    currentTab.name === 'Live' ? liveRaffles : finishedRaffles

  const changeTab = tabName => {
    setTabs(
      tabs.map(tab => ({
        ...tab,
        current: tabName === tab.name,
      }))
    )
  }
  const onRaffleFinished = raffleName => {
    setLiveRaffles(liveRaffles.filter(raffle => raffle.title !== raffleName))
    setFinishedRaffles([
      liveRaffles.find(raffle => raffle.title === raffleName),
      ...finishedRaffles,
    ])
  }

  useEffect(() => {
    const now = new Date()
    setLiveRaffles(
      raffles.filter(raffle => {
        const startDate = new Date(raffle.startDate)
        const endDate = new Date(raffle.endDate)
        return (
          now.getTime() > startDate.getTime() &&
          now.getTime() < endDate.getTime()
        )
      })
    )
    setFinishedRaffles(
      raffles.filter(raffle => {
        const startDate = new Date(raffle.startDate)
        const endDate = new Date(raffle.endDate)
        return (
          now.getTime() > startDate.getTime() &&
          now.getTime() > endDate.getTime()
        )
      })
    )
  }, [])

  useEffect(() => {
    setTabs(
      tabs.map(tab => ({
        ...tab,
        count:
          tab.name === 'Live' ? liveRaffles.length : finishedRaffles.length,
      }))
    )
  }, [liveRaffles, finishedRaffles])

  return (
    <div id="raffle-list">
      <div className="container">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="bg-transparent block w-full pl-3 pr-10 py-2 text-2xl border-blue-light focus:outline-none focus:ring-blue-light focus:border-blue-light rounded-md border text-blue-light font-header"
            defaultValue={tabs.find(tab => tab.current).name}
            onChange={e => changeTab(e.target.value)}
          >
            {tabs.map(tab => (
              <option
                key={tab.name}
                className="bg-blue-very-dark text-blue-light"
                value={tab.name}
              >
                {tab.name} ({tab.count})
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-blue-dark">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map(tab => (
                <button
                  key={tab.name}
                  className={classNames(
                    tab.current
                      ? 'border-blue-light text-blue-light'
                      : 'border-transparent text-white hover:text-blue-light',
                    'whitespace-nowrap font-header flex items-center py-4 px-1 border-b-2  text-2xl'
                  )}
                  onClick={() => changeTab(tab.name)}
                  aria-current={tab.current ? 'page' : undefined}
                >
                  {tab.name}
                  <span
                    className={classNames(
                      'bg-blue-dark text-blue-light hidden ml-3 py-0.5 px-2.5 rounded-full font-body text-xs font-medium md:inline-block'
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="mx-auto sm:px-6 lg:px-8 max-w-[1612px] 4k:max-w-[calc(100vw-308px)]">
        {[...currentRaffles].map(raffle => (
          <Fragment key={raffle.databaseId}>
            <div className="py-12 lg:py-8">
              <Raffle
                raffle={{ ...raffle, live: currentTab.name === 'Live' }}
                onRaffleFinished={onRaffleFinished}
              />
            </div>
            <div className="h-px bg-blue-light lg:bg-blue-dark -mx-4 lg:mx-0"></div>
          </Fragment>
        ))}
      </div>
      {currentRaffles.length === 0 && (
        <div className="container mt-8 space-y-4">
          <p className="font-header text-brown-light text-6xl">
            No {currentTab.name} raffles
          </p>
          {currentTab.name === 'Live' && (
            <>
              <p className="font-header text-brown-light text-4xl">
                This is so sad
              </p>
              <p className="font-header text-brown-light text-xl">
                Devs do something
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default RaffleList
