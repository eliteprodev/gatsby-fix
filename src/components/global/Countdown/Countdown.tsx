import React, { FC } from 'react'
import { classNames } from '../../../utils/misc'
import { TimeLeft } from './hooks'

interface CountdownProps {
  timeLeft: TimeLeft
  labelColor?: 'white' | 'yellow'
}

const Countdown: FC<CountdownProps> = ({ timeLeft, labelColor = 'white' }) => {
  return (
    <div className="flex space-x-2">
      <div className="flex flex-col items-center">
        <span className="h1">{timeLeft.days}</span>
        <span
          className={classNames(
            'text-sm uppercase',
            labelColor == 'yellow' && 'text-yellow',
            labelColor == 'white' && 'text-white'
          )}
        >
          Days
        </span>
      </div>
      <span className="h1">:</span>
      <div className="flex flex-col items-center">
        <span className="h1">{timeLeft.hours}</span>
        <span
          className={classNames(
            'text-sm uppercase',
            labelColor == 'yellow' && 'text-yellow',
            labelColor == 'white' && 'text-white'
          )}
        >
          Hours
        </span>
      </div>
      <span className="h1">:</span>
      <div className="flex flex-col items-center">
        <span className="h1">{timeLeft.minutes}</span>
        <span
          className={classNames(
            'text-sm uppercase',
            labelColor == 'yellow' && 'text-yellow',
            labelColor == 'white' && 'text-white'
          )}
        >
          Mins
        </span>
      </div>
      <span className="h1">:</span>
      <div className="flex flex-col items-center">
        <span className="h1">{timeLeft.seconds}</span>
        <span
          className={classNames(
            'text-sm uppercase',
            labelColor == 'yellow' && 'text-yellow',
            labelColor == 'white' && 'text-white'
          )}
        >
          Secs
        </span>
      </div>
    </div>
  )
}

export default Countdown
