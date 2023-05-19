import React from 'react'

const BgLine = () => {
  return (
    <div className="absolute inset-0 z-[-1] hidden lg:block">
      <div className="relative container h-full">
        <div className="absolute left-4 2xl:left-0 top-0 w-px h-full bg-brown-light bg-opacity-50"></div>
      </div>
    </div>
  )
}

export default BgLine
