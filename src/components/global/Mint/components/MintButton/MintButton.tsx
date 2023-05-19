import { GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import { ConnectionContext } from '@solana/wallet-adapter-react'
import React, { useContext, useEffect, useState } from 'react'
import LoadingIcon from '../../../../../assets/svgs/loading.svg'
import { classNames } from '../../../../../utils/misc'
import ButtonPrimary from '../../../ButtonPrimary'
import { calculateTimeLeft } from '../../../Countdown/hooks'
import { ThemeContext } from '../../../Layout/Layout'
import { CandyMachine, DefaultCandyGuardSettings } from '@metaplex-foundation/js'
// import { CandyMachine } from '../../utils/candy-machine'

const MintButton = ({
  onMint,
  candyMachine,
  isMinting,
  whiteList,
}: {
  onMint: () => Promise<void>
  candyMachine: CandyMachine<DefaultCandyGuardSettings> | undefined
  isMinting: boolean
  whiteList: boolean
}) => {
  const theme = useContext(ThemeContext)
  const [publicSaleGoLiveDate, setPublicSaleGoLiveDate] = useState(new Date())
  const timeLeft = calculateTimeLeft(publicSaleGoLiveDate, false).timeLeft
  const { requestGatewayToken, gatewayStatus } = useGateway()
  const [clicked, setClicked] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [canMint, setCanMint] = useState(false) // Must be public sale or have whitelist tokens for presale
  const { connection } = useContext(ConnectionContext)
  useEffect(() => {
if (candyMachine) {
  setPublicSaleGoLiveDate(new Date(candyMachine.candyGuard?.groups[0].guards.startDate as unknown as Date)??new Date())
}
  }, [candyMachine])
  // const hasWhitelistTokens = whitelistTokenBalance > 0

  // useEffect(() => {
  //   if (typeof candyMachine !== 'undefined') {
  //     ;(async function () {
  //       const whitelistPresaleEnabled =
  //         candyMachine.state.whitelistMintSettings?.presale === true
  //       const now = new Date()
  //       const epoch = await connection.getEpochInfo()
  //       const blockTime = (await connection.getBlockTime(
  //         epoch.absoluteSlot
  //       )) as number
  //       const timeDelta = candyMachine.state.goLiveDate.toNumber() - blockTime
  //       const goLiveDate = new Date(now.getTime() + timeDelta * 1000)
  //       setPublicSaleGoLiveDate(goLiveDate)
  //       const publicSaleIsLive = now.getTime() - goLiveDate.getTime() >= 0
  //       setCanMint(
  //         publicSaleIsLive
  //           ? true
  //           : whitelistPresaleEnabled && hasWhitelistTokens
  //       )
  //     })()
  //   }
  // }, [whitelistTokenBalance, candyMachine])
  // useEffect(() => {
  //   setIsVerifying(false)
  //   if (
  //     gatewayStatus === GatewayStatus.COLLECTING_USER_INFORMATION &&
  //     clicked
  //   ) {
  //     // when user approves wallet verification txn
  //     setIsVerifying(true)
  //   } else if (gatewayStatus === GatewayStatus.ACTIVE && clicked) {
  //     console.log('Verified human, now minting...')
  //     onMint()
  //     setClicked(false)
  //   }
  // }, [gatewayStatus, clicked, setClicked, onMint])

  // const cmExists = candyMachine
  // const cmSoldOut = candyMachine?.state.isSoldOut
  // const showButton = cmExists && !cmSoldOut && canMint
  const isLoading = isMinting //|| isVerifying
  return (
    <>
      {candyMachine && candyMachine.itemsRemaining.toNumber()>0 ? (
        <ButtonPrimary
          containerClassName={classNames(
            theme === 'yellow' && 'text-brown-light bg-brown-light',
            theme === 'blue' && 'text-blue-light bg-blue-light'
          )}
          bgClassName={classNames(
            theme === 'yellow' && 'bg-brown',
            theme === 'blue' && 'bg-blue-dark'
          )}
          className={classNames(
            theme === 'yellow' && 'text-brown-light group-hover:text-brown',
            theme === 'blue' && 'text-brown-light group-hover:text-blue-dark'
          )}
          disabled={isLoading || !candyMachine || candyMachine && candyMachine.itemsLoaded - candyMachine.itemsMinted.toNumber() ==0 }
          disableHoverAnimation={isLoading}
          onClick={async () => {
            if (candyMachine){
              console.log('Minting...')
              await onMint()
            } 
          }}
          variant="contained"
        >
          {isLoading ? (
            <LoadingIcon
              className={classNames(
                'w-8 h-8',
                theme === 'yellow' && 'text-brown-light',
                theme === 'blue' && 'text-brown-light'
              )}
            />
          ) : whiteList ? (
            'MINT (WHITELIST)'
          ) : (
            'MINT'
          )}
        </ButtonPrimary>
      ) : (
        <>
          <h2
            className={classNames(
              'text-2xl font-body font-bold uppercase',
              !candyMachine && 'loading'
            )}
          >
            {candyMachine
              ? candyMachine.itemsLoaded - candyMachine.itemsRemaining.toNumber()==0
                ? 'Sold out'
                : 'You have no whitelist tokens'
              : 'Connecting'}
          </h2>
          {/* {candyMachine && candyMachine.itemsLoaded - candyMachine.itemsRemaining.toNumber()>0 && (
            <p>
              Public sale starts in {timeLeft.days}d {timeLeft.hours}h{' '}
              {timeLeft.minutes}m
            </p>
          )} */}
        </>
      )}
    </>
  )
}

export default MintButton
