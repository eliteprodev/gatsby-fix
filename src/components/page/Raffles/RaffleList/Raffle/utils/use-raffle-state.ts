import { useEffect, useState } from 'react'
import { useTokenAccount } from './use-token-account'

interface Raffle {
  live: boolean
  tokenMint: string
  treasuryWallet: string
  pricePerTicket: number
  maxTickets?: number
  participants: Participant[] | null
}

interface Participant {
  wallet: string
  ticketsPurchased: number
  winner: boolean
}

interface RaffleState {
  ticketsSold?: number
  ticketsRemaining?: number
}

export const useRaffleState = (raffle: Raffle) => {
  const treasuryTokenAccount = useTokenAccount({
    wallet: raffle.participants ? '' : raffle.treasuryWallet,
    tokenMint: raffle.tokenMint,
  })
  const [raffleState, setRaffleState] = useState<RaffleState>({
    ticketsSold: undefined,
    ticketsRemaining: undefined,
  })

  useEffect(() => {
    if (raffle.participants) {
      const ticketsSold = raffle.participants.reduce(
        (prev, curr) => prev + curr.ticketsPurchased,
        0
      )
      const ticketsRemaining = raffle.maxTickets
        ? raffle.maxTickets - ticketsSold
        : undefined
      setRaffleState({
        ticketsSold,
        ticketsRemaining,
      })
    } else {
      if (typeof treasuryTokenAccount.amount === 'number') {
        const treasuryWalletBalance = treasuryTokenAccount.amount
        const ticketsSold = Math.min(
          raffle.maxTickets ?? Infinity,
          Math.floor(treasuryWalletBalance / raffle.pricePerTicket)
        )
        const ticketsRemaining = raffle.maxTickets
          ? raffle.maxTickets - ticketsSold
          : undefined

        setRaffleState({
          ticketsSold,
          ticketsRemaining,
        })
      }
    }
  }, [treasuryTokenAccount.amount])

  return {
    ticketsSold: raffleState.ticketsSold,
    ticketsRemaining: raffleState.ticketsRemaining,
    refresh: treasuryTokenAccount.refresh,
  }
}
