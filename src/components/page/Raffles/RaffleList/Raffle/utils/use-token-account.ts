import {
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import { ConnectionContext } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useContext, useEffect, useState } from 'react'

interface UseTokenBalanceOptions {
  wallet?: string
  tokenMint: string
}

export const useTokenAccount = ({
  wallet,
  tokenMint,
}: UseTokenBalanceOptions) => {
  const { connection } = useContext(ConnectionContext)
  const [tokenBalance, setTokenBalance] = useState<number | undefined>(
    undefined
  )
  const [tokenAccountAddress, setTokenAccountAddress] = useState<
    undefined | PublicKey
  >(undefined)

  const update = async () => {
    if (wallet) {
      try {
        let theTokenAccountAddress = tokenAccountAddress
        if (!theTokenAccountAddress) {
          theTokenAccountAddress = await getAssociatedTokenAddress(
            new PublicKey(tokenMint),
            new PublicKey(wallet)
          )
          setTokenAccountAddress(theTokenAccountAddress)
        }
        const tokenAccount = await getAccount(
          connection,
          theTokenAccountAddress,
          'confirmed'
        )
        setTokenBalance(Number(tokenAccount.amount))
      } catch (err: any) {
        if (
          err instanceof TokenAccountNotFoundError ||
          err.message == 'Invalid public key input'
        ) {
          setTokenBalance(0)
        } else {
          console.error(err)
        }
      }
    }
  }

  useEffect(() => {
    update()
  }, [wallet])

  return {
    amount: tokenBalance,
    address: tokenAccountAddress,
    refresh: () => {
      update()
    },
  }
}
