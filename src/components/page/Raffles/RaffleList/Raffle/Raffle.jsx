import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { WalletDisconnectionError } from '@solana/wallet-adapter-base'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletModalButton } from '@solana/wallet-adapter-react-ui'
import { GatsbyImage } from 'gatsby-plugin-image'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import LoadingIcon from '../../../../../assets/svgs/loading.svg'
import { classNames, getImage } from '../../../../../utils/misc'
import ButtonPrimary from '../../../../global/ButtonPrimary'
import Countdown from '../../../../global/Countdown'
import { useTimeLeft } from '../../../../global/Countdown/hooks'
import * as styles from './styles.module.css'
import { useMyTokenAccount } from './utils/my-token-accounts'
import { AlertContext } from './utils/snackbar'
import { transferSplToken } from './utils/transfer-spl-token'
import { useMyTickets } from './utils/use-my-tickets'
import { useRaffleState } from './utils/use-raffle-state'

const tokenMint = '8t2JQrLWDN8HJ5jTNKzVYgJasmxpaqQW6yo6dx9M3BTK'

const Raffle = ({ raffle, onRaffleFinished }) => {
  const endDate = new Date(raffle.endDate)
  const { timeLeft, countdownCompleted } = useTimeLeft(endDate)
  if (raffle.live && countdownCompleted) {
    onRaffleFinished(raffle.title)
  }
  const [ticketsToPurchase, setTicketsToPurchase] = useState(1)
  const { connection } = useConnection()
  const raffleState = useRaffleState({
    live: raffle.live,
    treasuryWallet: raffle.treasuryWallet,
    tokenMint: tokenMint,
    maxTickets: raffle.maxTickets,
    pricePerTicket: raffle.pricePerTicket,
    participants: raffle.participants,
  })

  const userWallet = useAnchorWallet()
  const myTokenAccount = useMyTokenAccount(tokenMint)
  const [loading, setLoading] = useState(false)
  const myTickets = useMyTickets({
    raffleLive: raffle.live,
    tokenMint,
    pricePerTicket: raffle.pricePerTicket,
    treasuryWallet: raffle.treasuryWallet,
    myTokenAccount: myTokenAccount.address,
    startDate: new Date(raffle.startDate),
    endDate,
    participants: raffle.participants,
  })

  const ticketsSold = useMemo(() => {
    if (raffle.participants) {
      return raffle.participants.reduce(
        (prev, curr) => prev + curr.ticketsPurchased,
        0
      )
    } else {
      return undefined
    }
  }, [])

  const [items, setItems] = useState([
    {
      name: 'Ticket price',
      value: `${raffle.pricePerTicket} $MYTH`,
    },

    ...(raffle.live
      ? [
          {
            name: 'Closes at',
            value: endDate.toLocaleString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
          },
        ]
      : []),
    {
      name: 'Winners/NFTs available',
      value: raffle.numberOfWinners,
    },
    ...(raffle.live
      ? raffle.maxTickets
        ? [
            {
              name: 'Tickets remaining',
              value: undefined,
            },
          ]
        : [
            {
              name: 'Tickets sold',
              value: ticketsSold,
            },
          ]
      : [
          {
            name: 'Tickets sold',
            value: ticketsSold,
          },
        ]),
  ])

  useEffect(() => {
    setItems(
      items.map(item => {
        if (item.name === 'Tickets sold' && !raffle.participants) {
          return {
            ...item,
            value: raffleState.ticketsSold,
          }
        }
        if (item.name === 'Tickets remaining') {
          return {
            ...item,
            value: raffleState.ticketsRemaining,
          }
        }
        return item
      })
    )
    if (raffle.live && raffleState.ticketsRemaining === 0) {
      onRaffleFinished(raffle.title)
    }
  }, [raffleState.ticketsSold])

  useEffect(() => {
    const myTicketsExists = items.find(item => item.name === 'My tickets')
    if (myTicketsExists) {
      setItems(
        items.map(item => {
          if (item.name === 'My tickets') {
            return {
              ...item,
              value: myTickets.amount,
            }
          }
          if (item.name === 'Did I win?') {
            return {
              ...item,
              value: myTickets.didIWin ? 'Yes' : 'No',
            }
          }
          return item
        })
      )
    } else if (userWallet?.publicKey) {
      setItems([
        ...items,
        {
          name: 'My tickets',
          value: myTickets.amount,
        },
        ...(raffle.participants
          ? [
              {
                name: 'Did I win?',
                value: myTickets.didIWin ? 'Yes' : 'No',
              },
            ]
          : []),
      ])
    }
  }, [myTickets.amount, myTickets.didIWin, userWallet?.publicKey])

  useEffect(() => {
    let interval
    // Only ping for updates if raffle is live
    if (raffle.live) {
      interval = setInterval(raffleState.refresh, 10000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  const { setAlertState } = useContext(AlertContext)
  const onPurchaseTickets = async ticketsToPurchase => {
    try {
      if (!userWallet?.publicKey) {
        throw new WalletDisconnectionError()
      }
      setLoading(true)
      await transferSplToken({
        connection,
        wallet: userWallet,
        tokenMint: tokenMint,
        destinationWallet: raffle.treasuryWallet,
        amount: ticketsToPurchase * raffle.pricePerTicket,
      })
      setAlertState({
        open: true,
        message: `Success! ${ticketsToPurchase} ticket${
          ticketsToPurchase > 1 ? 's' : ''
        } purchased.`,
        severity: 'success',
      })
    } catch (error) {
      console.error(error)
      setAlertState({
        open: true,
        message: `Purchase failed! Check console for more details.`,
        severity: 'error',
      })
    } finally {
      setLoading(false)
      raffleState.refresh()
      myTokenAccount.refresh()
      myTickets.refresh()
    }
  }
  const participants = raffle.participants

  return (
    <div className="relative">
      <div className="lg:grid lg:grid-cols-12 gap-x-20">
        <div className="px-4 lg:col-span-4 2xl:col-span-3 flex justify-center lg:block">
          {raffle.imageType == 'normal' ? (
            <GatsbyImage
              image={getImage(raffle.image)}
              className={classNames(
                'w-full max-w-[500px] mx-auto lg:mx-0 h-auto border border-blue-light text-blue-light text-opacity-30',
                styles.glow
              )}
              alt=""
            />
          ) : (
            <img
              src={raffle.imageGif.publicUrl}
              className="w-full max-w-[500px] mx-auto lg:mx-0 h-auto border border-blue-light text-blue-light text-opacity-30"
            />
          )}
        </div>
        <div className="mt-8 sm:mt-12 lg:mt-0 lg:col-span-4">
          <div className="px-4 lg:mt-0">
            <h2 className="text-5xl font-header text-brown-light">
              {raffle.title}
            </h2>
            <p className="mt-4 text-white">{raffle.description}</p>
          </div>
          {raffle.live && raffle.maxTickets && (
            <>
              <p className="mt-6 text-center text-white text-sm">
                {raffleState?.ticketsSold ?? 0}/{raffle.maxTickets} tickets sold
              </p>
              <div className="mt-2 w-full bg-blue-dark rounded-full h-2.5">
                <div
                  className={classNames(
                    'bg-blue-light h-2.5 rounded-full',
                    styles.glow
                  )}
                  style={{
                    width: `${
                      ((raffleState?.ticketsSold ?? 0) / raffle.maxTickets) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </>
          )}

          <dl className="mt-8 divide-y divide-blue-dark text-white">
            {items.map(item => (
              <div key={item.name} className="py-3 px-3 flex">
                <dt className="text-sm font-medium ">{item.name}</dt>
                <dd
                  className={classNames(
                    'ml-auto text-sm',
                    typeof item.value === 'undefined' && 'loading'
                  )}
                >
                  {typeof item.value === 'undefined' ? '' : item.value}
                </dd>
              </div>
            ))}
          </dl>
          {raffle.participants && (
            <div className="px-4 sm:px-0 mt-4">
              {!userWallet?.publicKey && <WalletModalButton />}
            </div>
          )}
        </div>
        <div className="mt-8 lg:mt-0 lg:col-span-4 2xl:col-span-5 lg:flex lg:flex-col lg:items-center">
          {raffle.live && (
            <div className="px-4 flex flex-col items-center">
              <div className="text-brown-light">
                <Countdown timeLeft={timeLeft} labelColor="white" />
              </div>
              <input
                className={classNames(
                  'mt-12 block border border-white bg-transparent text-white rounded-md py-2 pl-4 pr-2 text-2xl appearance-none',
                  ticketsToPurchase < 100
                    ? ticketsToPurchase < 10
                      ? 'w-16'
                      : 'w-20'
                    : 'w-24'
                )}
                type="number"
                value={ticketsToPurchase}
                onChange={e => {
                  const newValue = e.target.value
                  if (newValue === '') {
                    setTicketsToPurchase(newValue)
                  } else if (newValue < 1) {
                    setTicketsToPurchase(1)
                  } else if (
                    raffleState?.ticketsRemaining &&
                    newValue > raffleState.ticketsRemaining
                  ) {
                    setTicketsToPurchase(raffleState.ticketsRemaining)
                  } else if (
                    typeof myTokenAccount.amount === 'number' &&
                    myTokenAccount.amount < newValue * raffle.pricePerTicket
                  ) {
                    setTicketsToPurchase(
                      Math.floor(myTokenAccount.amount / raffle.pricePerTicket)
                    )
                  } else if (!Number.isInteger(newValue)) {
                    setTicketsToPurchase(Math.floor(newValue))
                  } else {
                    setTicketsToPurchase(newValue)
                  }
                }}
              />
              <p className="mt-8 text-white text-sm">PRICE</p>
              <p className="mb-8 text-white text-2xl">
                {ticketsToPurchase * raffle.pricePerTicket} $MYTH
              </p>
              {userWallet ? (
                <>
                  <p className="text-white text-sm">YOUR BALANCE</p>
                  <p
                    className={classNames(
                      'mb-8 text-white text-2xl',
                      typeof myTokenAccount.amount === 'undefined' && 'loading'
                    )}
                  >
                    {typeof myTokenAccount.amount === 'number'
                      ? `${myTokenAccount.amount} $MYTH`
                      : ''}
                  </p>
                  <ButtonPrimary
                    as="button"
                    containerClassName="text-blue-light bg-blue-light"
                    bgClassName="bg-blue-dark"
                    className={classNames(
                      'text-brown-light',
                      !loading && 'group-hover:text-blue-dark'
                    )}
                    onClick={() => onPurchaseTickets(ticketsToPurchase)}
                    disabled={loading}
                    disableHoverAnimation={loading}
                  >
                    {loading ? (
                      <LoadingIcon className="w-8 h-8" />
                    ) : (
                      `Buy ${ticketsToPurchase} Ticket${
                        ticketsToPurchase > 1 ? 's' : ''
                      }`
                    )}
                  </ButtonPrimary>
                </>
              ) : (
                <>
                  <WalletModalButton>Connect Wallet</WalletModalButton>
                </>
              )}
            </div>
          )}
          {!raffle.live && (
            <>
              <h2 className="px-4 text-5xl font-header text-brown-light">
                Participants
              </h2>
              {raffle.participants ? (
                <div className="pr-2 flex-1 mt-6 lg:mt-8 w-full relative">
                  <div
                    className={classNames(
                      'lg:absolute lg:inset-0 lg:px-4 overflow-y-auto text-blue-light max-h-48 lg:max-h-full pr-2',
                      styles.scroll
                    )}
                  >
                    <table className="min-w-full divide-y divide-blue-dark">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white lg:pl-6"
                          >
                            Wallet
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                          >
                            Winner
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-dark">
                        {participants.map(participant => (
                          <tr key={participant.wallet}>
                            <td className=" break-all py-3 lg:py-4 px-3 lg:pl-6 text-sm font-medium text-white  overflow-hidden overflow-ellipsis select-all whitespace-nowrap w-full max-w-0">
                              {participant.wallet}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 lg:py-4 text-sm text-white">
                              {participant.winner ? (
                                <CheckIcon className="w-5 lg:w-6 h-5 lg:h-6 text-green-700" />
                              ) : (
                                <XIcon className="w-5 lg:w-6 h-5 lg:h-6 text-red-700" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="px-4 mt-8 lg:mt-16 lg:max-w-[80%] lg:mx-auto lg:text-center text-white">
                  Winners will be displayed here within 48 hours
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Raffle
