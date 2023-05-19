import React from 'react'
import fireAndSmokeMp4 from '../../../assets/video/fire-and-smoke.mp4'
import fireAndSmokeWebm from '../../../assets/video/fire-and-smoke.webm'
import { classNames } from '../../../utils/misc'

const BgVideo = ({ className = '' }) => {
  return (
    <video
      className={classNames(
        'absolute pointer-events-none top-0 left-0 w-full h-full object-cover mix-blend-screen',
        className
      )}
      autoPlay
      loop
      muted
    >
      <source src={fireAndSmokeWebm} type="video/webm" />
      <source src={fireAndSmokeMp4} type="video/mp4" />
    </video>
  )
}

export default BgVideo
