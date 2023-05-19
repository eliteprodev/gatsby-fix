import React from 'react'
import Countdown from '../../global/Countdown'
import { useTimeLeft } from '../../global/Countdown/hooks'
import MintContainer from '../../global/Mint/components/MintContainer'
import WalletProviders from '../../global/Mint/components/WalletProviders'

const ProjectMint = ({ goLiveDate, showCandyMachine, candyMachine }) => {
  const theGoLiveDate = new Date(goLiveDate)
  const { timeLeft, countdownCompleted } = useTimeLeft(theGoLiveDate)
  return (
    <section id="project-mint">
      <div className="text-brown-light">
        <div>
          {countdownCompleted ? (
            <p className="h1">Live</p>
          ) : (
            <>
              <Countdown timeLeft={timeLeft} />
              <p className="mt-2">
                Mint starts{' '}
                {theGoLiveDate.toLocaleString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}{' '}
                (in your timezone)
              </p>
            </>
          )}
        </div>
        {showCandyMachine && (
          <div className="mt-4">
            <WalletProviders network={candyMachine.solanaNetwork}>
              <MintContainer
                artificallyIncreaseTotalAndRedeemedBy={
                  candyMachine.artificiallyIncreaseTotalAndRedeemedBy ??
                  undefined
                }
                showMintButton={countdownCompleted}
                candyMachineId={candyMachine.candyMachineId}
                tokenName={candyMachine.tokenName}
              />
            </WalletProviders>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectMint
