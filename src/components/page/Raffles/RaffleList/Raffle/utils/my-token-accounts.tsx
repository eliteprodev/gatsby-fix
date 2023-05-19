import {
  getAccount,
  getAssociatedTokenAddress,
  TokenAccountNotFoundError,
} from '@solana/spl-token'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import React, { useContext, useEffect, useState } from 'react'
import { FCWithChildren } from '../../../../../../utils/react'

interface Accounts {
  [tokenMint: string]: {
    tokenAccountAddress: PublicKey | undefined
    tokenAmount: number | undefined
  }
}

interface MyTokenAccounts {
  accounts: Accounts
  addAccount: (tokenMint: string) => void
  refreshAccount: (tokenMint: string) => () => void
}

const MyTokenAccountsContext = React.createContext<MyTokenAccounts>({
  accounts: {},
  addAccount: () => {},
  refreshAccount: () => () => {},
})

let tokenMintsBeingRefreshed: string[] = []

export const MyTokenAccountsProvider: FCWithChildren<{}> = ({ children }) => {
  const [accounts, setAccounts] = useState<Accounts>({})
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const refreshAccountAsync = async (tokenMint: string) => {
    if (wallet?.publicKey) {
      if (!tokenMintsBeingRefreshed.includes(tokenMint)) {
        tokenMintsBeingRefreshed.push(tokenMint)
        let theTokenAccountAddress = accounts[tokenMint]?.tokenAccountAddress
        if (!theTokenAccountAddress) {
          theTokenAccountAddress = await getAssociatedTokenAddress(
            new PublicKey(tokenMint),
            wallet.publicKey
          )
        }
        try {
          const tokenAccount = await getAccount(
            connection,
            theTokenAccountAddress,
            'confirmed'
          )
          setAccounts({
            ...accounts,
            [tokenMint]: {
              tokenAccountAddress: theTokenAccountAddress,
              tokenAmount: Number(tokenAccount.amount),
            },
          })
        } catch (err: any) {
          if (err instanceof TokenAccountNotFoundError) {
            setAccounts({
              ...accounts,
              [tokenMint]: {
                tokenAccountAddress: theTokenAccountAddress,
                tokenAmount: 0,
              },
            })
          } else {
            throw err
          }
        }

        tokenMintsBeingRefreshed = tokenMintsBeingRefreshed.filter(
          mint => mint !== tokenMint
        )
      }
    }
  }

  const refreshAccount = (tokenMint: string) => () => {
    refreshAccountAsync(tokenMint)
  }

  const addAccount = (tokenMint: string) => {
    if (!(tokenMint in accounts)) {
      setAccounts({
        ...accounts,
        [tokenMint]: {
          tokenAccountAddress: undefined,
          tokenAmount: undefined,
        },
      })
    }
    refreshAccountAsync(tokenMint)
  }

  useEffect(() => {
    if (wallet?.publicKey) {
      for (const [tokenMint, obj] of Object.entries(accounts)) {
        if (!obj.tokenAccountAddress) {
          refreshAccountAsync(tokenMint)
        }
      }
    }
  }, [wallet?.publicKey])

  return (
    <MyTokenAccountsContext.Provider
      value={{
        accounts,
        addAccount,
        refreshAccount,
      }}
    >
      {children}
    </MyTokenAccountsContext.Provider>
  )
}

export const useMyTokenAccount = (tokenMint: string) => {
  const myTokenAccounts = useContext(MyTokenAccountsContext)

  useEffect(() => {
    myTokenAccounts.addAccount(tokenMint)
  }, [])

  return {
    address: myTokenAccounts.accounts[tokenMint]?.tokenAccountAddress,
    amount: myTokenAccounts.accounts[tokenMint]?.tokenAmount,
    refresh: myTokenAccounts.refreshAccount(tokenMint),
  }
}
