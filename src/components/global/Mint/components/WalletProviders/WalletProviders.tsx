import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import React, { useMemo } from 'react'
import { FCWithChildren } from '../../../../../utils/react'

require('@solana/wallet-adapter-react-ui/styles.css')

type NetworkMap = Record<WalletAdapterNetwork, string>

const dev = process.env.NODE_ENV !== 'production'
const map: NetworkMap = {
  devnet: 'https://api.devnet.solana.com',
  'mainnet-beta':
    'https://autumn-wispy-forest.solana-mainnet.quiknode.pro/9df0b2e72ee22da25d7be7cc97fb85656e938255',
  testnet: '',
}

interface WalletProvidersProps {
  network: WalletAdapterNetwork
}

export const MintContext = React.createContext({
  rpcUrl: map.devnet,
})

const WalletProviders: FCWithChildren<WalletProvidersProps> = ({
  children,
  network,
}) => {
  const rpcUrl = map[network]
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  )

  return (
    <ConnectionProvider endpoint={rpcUrl}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider className="svg-auto">
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

// const LoadableMintProviders = Loadable(() => import('./MintProviders'), {
//   ssr: false,
// }) as FC

export default WalletProviders
