import { GatewayProvider } from '@civic/solana-gateway-react'
import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import * as anchor from '@project-serum/anchor'
import {
  ConnectionContext,
  useAnchorWallet,
} from '@solana/wallet-adapter-react'
import {
  WalletDisconnectButton,
  WalletModalButton,
} from '@solana/wallet-adapter-react-ui'
import { LAMPORTS_PER_SOL, ParsedAccountData, PublicKey } from '@solana/web3.js'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { classNames } from '../../../../../utils/misc'
import { FCWithChildren } from '../../../../../utils/react'
import { ThemeContext } from '../../../Layout/Layout'
import {
  shortenAddress,
} from '../../utils/candy-machine'
import { AlertState, getAtaForMint } from '../../utils/misc'
import MintButton from '../MintButton'
// @ts-ignore
import * as styles from './styles.module.css'
import { CandyMachine, DefaultCandyGuardSettings, Metaplex, SolAmount,walletAdapterIdentity } from '@metaplex-foundation/js'
import 'swiper/css'
// const txTimeout = 120 * 1000 // milliseconds (confirm this works for your project)

interface MintContainerProps {
  artificallyIncreaseTotalAndRedeemedBy?: number
  showMintButton: boolean
  candyMachineId: string
  tokenName?: string
}

interface PublicSale{
  solPrice: number
}

interface WLSale{
  solPrice: number,
  burnAmount: number,
  burnTokenDecimal: number,
  burnTokenMintAddress: PublicKey|undefined
}

const MintContainer: FCWithChildren<MintContainerProps> = ({
  showMintButton = false,
  artificallyIncreaseTotalAndRedeemedBy = 0,
  candyMachineId,
  tokenName,
  children,
}) => {
  const theme = useContext(ThemeContext)
  const candyMachinePublicKey = useMemo(
    () => new anchor.web3.PublicKey(candyMachineId),
    [candyMachineId]
  )
  const { connection } = useContext(ConnectionContext)
  const [balance, setBalance] = useState<number>(0)
  const [tokenBalance, setTokenBalance]= useState<number>(0)
  const [whitelistPricePerNFT, setWhitelistPricePerNFT] = useState<
    null | number
  >(null)
  const [publicPricePerNFT, setPublicPricePerNFT] = useState(0)
  const [isMinting, setIsMinting] = useState(false) // true when user got to press MINT
  const [mintingWithSol, setMintingWithSol] = useState(true)
  const currency = mintingWithSol ? 'SOL' : tokenName
  const [itemsAvailable, setItemsAvailable] = useState(0)
  const [itemsRedeemed, setItemsRedeemed] = useState(0)
  const [itemsMinted, setItemsMinted] = useState(0)
  const [whitelistEnabled, setWhitelistEnabled] = useState(false)
  const [whitelistTokenBalance, setWhitelistTokenBalance] = useState(0)

  const [publicSaleData , setPublicSaleData ] = useState<PublicSale>()
  const [wlSaleData , setWlSaleData ] = useState<WLSale>()

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined,
  })

  const wallet = useAnchorWallet()
  const [candyMachine, setCandyMachine] = useState<CandyMachine<DefaultCandyGuardSettings>>()

  const refreshCandyMachineState = async () => {
    let cndy;

    if (!wallet) {
      const METAPLEX = Metaplex.make(connection);//.use(keypairIdentity(WALLET));
      cndy = await METAPLEX
          .candyMachines()
          .findByAddress({ address: new PublicKey(candyMachineId) });
        setCandyMachine(cndy)
      return
    } else {
      const METAPLEX = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
      cndy = await METAPLEX
          .candyMachines()
          .findByAddress({ address: new PublicKey(candyMachineId) });
        setCandyMachine(cndy)
    }

    // const cndy = await getCandyMachineState(
    //   wallet as anchor.Wallet,
    //   candyMachinePublicKey,
    //   connection
    // )
    setCandyMachine(cndy)
    
    if (cndy.candyGuard?.groups) {
      for (let i=0;i<cndy.candyGuard?.groups.length;i++) {
        if (
          cndy.candyGuard && cndy.candyGuard?.groups[i].label == "WLs" && 
          cndy.candyGuard?.groups[i].guards.solPayment?.amount.basisPoints.toNumber() && 
        cndy.candyGuard?.groups[i].guards.tokenBurn && 
        cndy.candyGuard?.groups[i].guards.tokenBurn?.mint
        ) {
          let decimal = 9;
          if (
            cndy.candyGuard && 
            cndy.candyGuard.groups[i].guards && 
            cndy.candyGuard.groups[i].guards.tokenBurn && 
            cndy.candyGuard.groups[i].guards.tokenBurn !== null &&
            cndy.candyGuard.groups[i].guards.tokenBurn !== undefined &&
            cndy.candyGuard.groups[i].guards.tokenBurn?.mint
            ){
            if ( cndy.candyGuard.groups[i].guards.tokenBurn?.mint){

              let mint = await connection.getParsedAccountInfo(
            (cndy.candyGuard?.groups[i].guards.tokenBurn as any).mint
            )
            decimal = (mint?.value?.data as ParsedAccountData).parsed.info.decimals;
            }
          }
          // setWhitelistPricePerNFT(cndy.candyGuard?.groups[0].guards.solPayment?.amount.basisPoints.toNumber())
          console.log(">>>", cndy)
          setWlSaleData({
            solPrice: cndy.candyGuard?.groups[i].guards.solPayment?.amount.basisPoints.toNumber()??0,
            burnAmount: cndy.candyGuard?.groups[i].guards.tokenBurn?.amount.basisPoints.toNumber()??0,
            burnTokenDecimal: decimal,
            burnTokenMintAddress: cndy.candyGuard?.groups[i].guards.tokenBurn?.mint
          })

          await refreshBalance(cndy, cndy.candyGuard?.groups[i].guards.tokenBurn?.mint)

        } else if (cndy.candyGuard?.groups[i].label == "Public" && cndy.candyGuard?.groups[i].guards.solPayment?.amount.basisPoints.toNumber()) {
          setPublicSaleData({solPrice: cndy.candyGuard?.groups[i].guards.solPayment?.amount.basisPoints.toNumber()??0})

          await refreshBalance(cndy)

        }
      }

      
      // if (cndy.state.whitelistMintSettings?.discountPrice) {
      //   setWhitelistPricePerNFT(
      //     cndy.state.whitelistMintSettings.discountPrice.toNumber()
      //   )
      // }
      // setMintingWithSol(false)
    } else {
      // setPublicPricePerNFT(cndy.candyGuard?.guards.solPayment?.amount.        )
      // if (cndy.state.whitelistMintSettings?.discountPrice) {
      //   setWhitelistPricePerNFT(
      //     cndy.state.whitelistMintSettings.discountPrice.toNumber() /
      //       LAMPORTS_PER_SOL
      //   )
      // }
      // setMintingWithSol(true)
    }
    setItemsAvailable(
      cndy.itemsLoaded
    )
    setItemsMinted(cndy.itemsMinted.toNumber())
    // setItemsRedeemed(
    //   cndy.state.itemsRedeemed + artificallyIncreaseTotalAndRedeemedBy
    // )

    // fetch whitelist token balance
    // if (cndy.state.whitelistMintSettings) {
    //   setWhitelistEnabled(true)
    //   let balance = 0
    //   try {
    //     const tokenBalance = await connection.getTokenAccountBalance(
    //       (
    //         await getAtaForMint(
    //           cndy.state.whitelistMintSettings.mint,
    //           wallet.publicKey
    //         )
    //       )[0]
    //     )

    //     balance = tokenBalance?.value?.uiAmount || 0
    //   } catch (e) {
    //     balance = 0
    //   }

    //   setWhitelistTokenBalance(balance)
    // } else {
    //   setWhitelistEnabled(false)
    // }
  }

  const onMint = async () => {
    try {
      setIsMinting(true)
      document.getElementById('#identity')?.click()
      if (wallet && wlSaleData && publicSaleData) {
        
        const METAPLEX = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
        const candyMachine = await METAPLEX
            .candyMachines()
            .findByAddress({ address: new PublicKey(candyMachineId) });
        let userBalance = {
          solBalance: balance,
          tokenBalance: tokenBalance
        }
        
        if (tokenBalance == 0) {
          let userBalancTmp = await refreshBalance(candyMachine, wlSaleData.burnTokenMintAddress)
          if (userBalancTmp) {
            userBalance = userBalancTmp
          } else {
            setAlertState({
              open: true,
              message: "Network Error!",
              severity:"error"
            })
            return;
          }
        }

        const permission = userBalance.tokenBalance * Math.pow(10, wlSaleData.burnTokenDecimal)>wlSaleData.burnAmount?"WLs":"Public"
        console.log("userBalance ", userBalance)
        console.log("wlSale data ", wlSaleData)
        console.log("public sale date ", publicSaleData)

        // return;
        if (
          permission == "WLs" && userBalance.solBalance<wlSaleData.solPrice ||
          permission == "Public" && userBalance.solBalance<publicSaleData?.solPrice
        ) {
          
        }
        console.log("permission, ", permission)
        let result = await METAPLEX.candyMachines().mint({ candyMachine, collectionUpdateAuthority: candyMachine.authorityAddress, group: permission })
        console.log("result ", result)
        // const mintTxId = (await mintOneToken(candyMachine, wallet.publicKey))[0]
        if (result.nft && result.response.signature) {
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
          })
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error',
          })
        }        
      } else {
        setAlertState({
          open: true,
          message: "Network Error! Try again later",
          severity: 'error',
        })
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!'
      // let errKeys = Object.keys(error as object);
      
      // console.log(">>>>> ", typeof(error), error)
      // console.log(">>>>>> ", errKeys)
      // console.log("error.error ", error.error)
      // console.log("error.name ", error.name)
      // console.log("error.source", typeof(error.source), error.source);
      // console.log("error.sourceDetails", typeof(error.sourceDetails), error.sourceDetails);
      // console.log("error.cause", typeof(error.cause), error.cause);0

      message = (error.error && error.error.message) ?error.error.message: error.name;

      if (error.name="FailedToConfirmTransactionError" && error.source == "rpc" && Object.keys(error).includes("sourceDetails") && !error.sourceDetails) {
        setAlertState({
          open: true,
          message: 'Congratulations! Mint succeeded!',
          severity: 'success',
        })
      } else {
        setAlertState({
          open: true,
          message,
          severity: 'error',
        })
      }
      
    } finally {
      setIsMinting(false)
      refreshCandyMachineState()
    }
  }

  const refreshBalance = async (cndy: CandyMachine, burnTokenMint?: PublicKey) => {
    if (wallet) {
      // if (cndy && cndy.state.tokenMint) {
      //   let balance = 0
      //   try {
      //     const tokenBalance = await connection.getTokenAccountBalance(
      //       (
      //         await getAtaForMint(cndy.state.tokenMint, wallet.publicKey)
      //       )[0]
      //     )
      //     balance = tokenBalance?.value?.uiAmount || 0
      //   } catch (e) {
      //     console.error(e)
      //     balance = 0
      //   }
      //   setBalance(balance)
      // } else {
        const balance = await connection.getBalance(wallet.publicKey)
        setBalance(balance)

        if (burnTokenMint) {
          console.log(" wl token ",burnTokenMint.toBase58() );
          let tBalance = "0"
          try {
            tBalance = (await connection.getTokenAccountBalance((await getAtaForMint(burnTokenMint, wallet.publicKey))[0])).value.uiAmountString??"0"
            setTokenBalance(parseInt(tBalance??"0"));
          } catch (e) {
            console.log(e)
            setTokenBalance(0)
          }
          console.log(" tBalance ", tBalance)
          return {
            solBalance: balance,
            tokenBalance: parseInt(tBalance??"0")
          }
        } else {
          return {
            solBalance: balance,
            tokenBalance: 0
          }
        }
      // }
    }
  }

  const accountChangeListner = () => {
    let id = connection.onAccountChange(new PublicKey(candyMachineId), () => {
      refreshCandyMachineState()
    })
    return id
  }

  useEffect(() => {
    setCandyMachine(undefined)
    refreshCandyMachineState()
    let cndyEventListener = accountChangeListner()
    return () => {
      connection.removeAccountChangeListener(cndyEventListener)
    }
  }, [wallet, candyMachineId, showMintButton])

  return (
    <div>
      
      {wallet ? (
        <>
          <WalletDisconnectButton />
          <div
            className={classNames(
              'mt-6 inline-block  border-2 rounded-md  text-brown-light p-4',
              theme === 'blue' &&
                'bg-blue-dark border-blue-light shadow-blue-light',
              theme === 'yellow' && 'bg-brown border-yellow shadow-yellow',
              styles.glow
            )}
          >
            <p>Wallet {shortenAddress(wallet.publicKey.toBase58() || '')}</p>
            <p>
              SOL Balance: {(balance/LAMPORTS_PER_SOL).toFixed(2)} SOL
            </p>
            <p>
              {tokenName} Balance: {
                tokenBalance.toFixed(2)
              }
            </p>
            
            <p>
              {
                
                wlSaleData && wlSaleData.burnAmount && tokenBalance * Math.pow(10, wlSaleData.burnTokenDecimal) > wlSaleData?.burnAmount ? 
              <>
              {
                
                'Whitelist Price '+ (wlSaleData.solPrice/ LAMPORTS_PER_SOL) + " SOL ("+
                (wlSaleData.burnAmount/Math.pow(10, wlSaleData.burnTokenDecimal)).toFixed(2)
                +" "+tokenName+")" 
              }
              </>: publicSaleData ?
              <>
              {
                
                'Public Price ' +(publicSaleData.solPrice/ LAMPORTS_PER_SOL)+" SOL "
              }
              </>:<></>
              }
            </p>
            {/* {whitelistPricePerNFT && (
              <p>
                Whitelist price: {whitelistPricePerNFT} {currency}
              </p>
            )} */}

            <p>Total Available: {itemsAvailable}</p>
            {/* <p>Redeemed: {itemsRedeemed}</p> */}
            <p>Minted: {itemsMinted}</p>
            {/* {
            
            wlSaleData && tokenBalance && wlSaleData?.burnAmount < tokenBalance  * Math.pow(10, wlSaleData.burnTokenDecimal) && false &&
              <p>Your whitelist tokens: 
                {
                (tokenBalance).toFixed(2)
                }
                </p>
            } */}
          </div>
          {showMintButton && itemsAvailable> 0 && itemsAvailable - itemsMinted>0 &&
          (wlSaleData?.burnAmount && tokenBalance * Math.pow(10, wlSaleData.burnTokenDecimal)>wlSaleData?.burnAmount && balance > wlSaleData.solPrice || publicSaleData && balance > publicSaleData?.solPrice) &&
          (
            <div className="mt-6">
              {/* {candyMachine?. .state.gatekeeper &&
              wallet.publicKey &&
              wallet.signTransaction ? (
                <GatewayProvider
                  wallet={{
                    publicKey:
                      wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
                    //@ts-ignore
                    signTransaction: wallet.signTransaction,
                  }}
                  // // Replace with following when added
                  // gatekeeperNetwork={candyMachine.state.gatekeeper_network}
                  gatekeeperNetwork={
                    candyMachine?.candyGuard?.guards.gatekeeper
                  } // This is the ignite (captcha) network
                  /// Don't need this for mainnet
                  clusterUrl={connection.rpcEndpoint}
                  options={{ autoShowModal: false }}
                >
                  <MintButton
                    candyMachine={candyMachine}
                    isMinting={isMinting}
                    onMint={onMint}
                    whitelistTokenBalance={whitelistTokenBalance}
                  />
                </GatewayProvider>
              ) : (
                )} */}
                <MintButton
                  candyMachine={candyMachine}
                  isMinting={isMinting}
                  onMint={onMint}
                  whiteList={wlSaleData && wlSaleData?.burnAmount && tokenBalance * Math.pow(10, wlSaleData.burnTokenDecimal)>wlSaleData?.burnAmount && balance > wlSaleData.solPrice?true:false }
                />
            </div>
          )}
        </>
      ) : (
        <>
          <WalletModalButton>Connect Wallet</WalletModalButton>
          {children}
        </>
      )}
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

// const LoadableMintContainer = Loadable(() => import('./MintContainer'), {
//   ssr: false,
// }) as FC

export default MintContainer
