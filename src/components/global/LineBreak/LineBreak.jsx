import React from 'react'
import { classNames } from '../../../utils/misc'
import * as styles from './styles.module.css'

const LineBreak = ({ className = 'bg-yellow shadow-yellow' }) => {
  return (
    <div
      className={classNames(
        'h-3 relative lg:absolute lg:inset-x-0 lg:bottom-0',
        styles.glow,
        className
      )}
    />
  )
}

export default LineBreak
