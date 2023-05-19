import React from 'react'
import WalletProviders from '../../global/Mint/components/WalletProviders'
import RaffleList from './RaffleList'
import { MyTokenAccountsProvider } from './RaffleList/Raffle/utils/my-token-accounts'
import { SnackbarProvider } from './RaffleList/Raffle/utils/snackbar'

const Raffles = () => {
  return (
    <WalletProviders network="mainnet-beta">
      <MyTokenAccountsProvider>
        <SnackbarProvider>
          <section id="raffles">
            <div className="relative pt-40 pb-32 sm:pb-40 min-h-screen">
              <div className="absolute inset-0 -left-px bottom-0 z-[-1] bg-repeat tileable" />
              <div className="container max-w-md flex flex-col items-center mb-12">
                <h1 className="text-7xl sm:text-9xl font-header text-center text-blue-light text-glow">
                  Rafflez
                </h1>
              </div>
              <RaffleList />
            </div>
          </section>
        </SnackbarProvider>
      </MyTokenAccountsProvider>
    </WalletProviders>
  )
}

export default Raffles
