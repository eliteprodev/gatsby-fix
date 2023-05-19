import React from 'react'
import { classNames } from '../../../utils/misc'

const BgBanner = ({ title, children, hideOnMobile = true, above = false }) => {
  return (
    <div
      className={classNames(
        'absolute inset-0 ',
        hideOnMobile && 'hidden lg:block',
        !above && 'z-[-1]'
      )}
    >
      <div className="container h-full">
        <div className="relative h-full">
          <div className="absolute left-[25%] sm:left-[40%] lg:left-[24.5%] w-[70%] sm:w-[50%] lg:w-[35%] h-full bg-yellow">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BgBanner
