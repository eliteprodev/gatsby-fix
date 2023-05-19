import React, { FC } from 'react'
import { classNames } from '../../../../utils/misc'
import * as styles from './styles.module.css'

type StatusEnum = 'live' | 'coming-soon' | 'in-negotiation'

interface StatusProps {
  status: StatusEnum
}

const getText = (status: StatusEnum): string => {
  return {
    live: 'Live',
    'coming-soon': 'Coming Soon',
    'in-negotiation': 'In Negotiation',
  }[status]
}

const getBgClass = (status: StatusEnum): string => {
  return {
    live: 'bg-green shadow-green',
    'coming-soon': 'bg-blue-light shadow-blue-light',
    'in-negotiation': 'bg-yellow shadow-yellow',
  }[status]
}

const Status: FC<StatusProps> = ({ status }) => {
  return (
    <div
      className={classNames(
        'inline-flex items-center py-1 lg:py-2 px-4 lg:px-8 font-header text-xl lg:text-2xl 4k:text-3xl text-white',
        getBgClass(status),
        styles.glow
      )}
    >
      {getText(status)}
    </div>
  )
}

export default Status
