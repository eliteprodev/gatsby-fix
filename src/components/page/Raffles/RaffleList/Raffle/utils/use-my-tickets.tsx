import { getAssociatedTokenAddress } from '@solana/spl-token'
import {
  ConnectionContext,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import {
  ConfirmedSignatureInfo,
  Connection,
  ParsedInstruction,
  PublicKey,
} from '@solana/web3.js'
import { useContext, useEffect, useState } from 'react'

interface Participant {
  wallet: string
  ticketsPurchased: number
  winner: boolean
}

interface UseMyTicketsOptions {
  raffleLive: string
  tokenMint: string
  pricePerTicket: number
  myTokenAccount: PublicKey | undefined
  treasuryWallet: string
  startDate: Date
  endDate: Date
  participants: Participant[] | null
}

export const useMyTickets = ({
  raffleLive,
  tokenMint,
  pricePerTicket,
  myTokenAccount,
  treasuryWallet,
  startDate,
  endDate,
  participants,
}: UseMyTicketsOptions) => {
  const { connection } = useContext(ConnectionContext)
  const userWallet = useAnchorWallet()
  const [myTickets, setMyTickets] = useState<number | undefined>(undefined)
  const [didIWin, setDidIWin] = useState<boolean>(false)
  const [treasuryWalletTokenAccount, setTreasuryWalletTokenAccount] = useState<
    undefined | string
  >(undefined)

  const update = async () => {
    if (!participants) {
      let theTreasuryWalletTokenAccount = treasuryWalletTokenAccount
      if (!theTreasuryWalletTokenAccount) {
        const ata = await getAssociatedTokenAddress(
          new PublicKey(tokenMint),
          new PublicKey(treasuryWallet)
        )
        theTreasuryWalletTokenAccount = ata.toBase58()
        setTreasuryWalletTokenAccount(theTreasuryWalletTokenAccount)
      }
      if (myTokenAccount) {
        const signatures = await getSignaturesBetween(
          connection,
          myTokenAccount,
          startDate,
          endDate
        )
        const tokensTransferred = await getTokensTransfered(
          connection,
          signatures,
          tokenMint,
          myTokenAccount.toBase58(),
          theTreasuryWalletTokenAccount
        )
        setMyTickets(Math.floor(tokensTransferred / pricePerTicket))
      }
    } else if (userWallet?.publicKey) {
      const myWallet = userWallet.publicKey.toBase58()
      const me = participants.find(p => p.wallet === myWallet)
      if (me) {
        setMyTickets(me.ticketsPurchased)
        setDidIWin(me.winner)
      } else {
        setMyTickets(0)
      }
    } else {
      setMyTickets(0)
    }
  }
  useEffect(() => {
    update()
  }, [myTokenAccount])

  return {
    amount: myTickets,
    didIWin: didIWin,
    refresh: update,
  }
}

const toUnixTimestamp = (date: Date): number => {
  return Math.floor(date.getTime() / 1000)
}

type ConfirmedSignatureWithBlockTime = ConfirmedSignatureInfo & {
  blockTime: number
}

const getSignaturesBetween = async (
  connection: Connection,
  account: PublicKey,
  startDate: Date,
  endDate: Date
): Promise<string[]> => {
  const startDateUnixTs = toUnixTimestamp(new Date(startDate))
  // Add 5 minutes to end date in case transactions were sent right before the end date and are taking some time to process
  const endDateUnixTs = toUnixTimestamp(new Date(endDate)) + 5 * 60

  let allRelevantTransactionsFound = false
  let allSignatures: ConfirmedSignatureWithBlockTime[] = []
  let before: string | undefined = undefined
  do {
    const signatures = await connection.getSignaturesForAddress(
      account,
      {
        before,
        limit: 1000,
      },
      'confirmed'
    )
    const validSignatures = signatures.filter(
      s => !s.err && s.blockTime
    ) as ConfirmedSignatureWithBlockTime[]
    allSignatures = allSignatures.concat(validSignatures)
    if (allSignatures.length == 0) {
      return []
    }
    const lastSignature = allSignatures[allSignatures.length - 1]
    if (
      lastSignature.blockTime > startDateUnixTs &&
      validSignatures.length > 0
    ) {
      before = lastSignature.signature
    } else {
      allRelevantTransactionsFound = true
    }
  } while (!allRelevantTransactionsFound)

  const signaturesWithinTimeRange = allSignatures
    .filter(s => s.blockTime > startDateUnixTs && s.blockTime < endDateUnixTs)
    .map(s => s.signature)

  return signaturesWithinTimeRange
}

const getTokensTransfered = async (
  connection: Connection,
  signatures: string[],
  tokenMint: string,
  source: string,
  destination: string
): Promise<number> => {
  if (signatures.length == 0) {
    return 0
  }

  const transactions = await connection.getParsedTransactions(signatures)
  let tokensTransferred = 0
  for (const transaction of transactions) {
    if (transaction) {
      const parsedInstructions =
        transaction!.transaction.message.instructions.filter(
          // @ts-ignore
          i => !!i.parsed
        ) as ParsedInstruction[]
      for (const instruction of parsedInstructions) {
        if (
          instruction.parsed.type === 'transferChecked' &&
          instruction.parsed.info.mint === tokenMint &&
          instruction.parsed.info.source === source &&
          instruction.parsed.info.destination === destination
        ) {
          tokensTransferred += instruction.parsed.info.tokenAmount.uiAmount
        }
      }
    }
  }
  return tokensTransferred
}
