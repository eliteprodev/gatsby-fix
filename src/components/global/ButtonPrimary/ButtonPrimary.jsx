import React from 'react'
import { classNames } from '../../../utils/misc'
import './styles.css'

const triangleWidth = 10

const triangles = {
  topLeft: {
    className: 'border-t-current',
    style: {
      top: 0,
      left: 0,
      borderTopWidth: triangleWidth,
      borderRightWidth: triangleWidth,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
    },
  },
  topRight: {
    className: 'border-r-current',
    style: {
      top: 0,
      right: 0,
      borderTopWidth: 0,
      borderRightWidth: triangleWidth,
      borderBottomWidth: triangleWidth,
      borderLeftWidth: 0,
    },
  },
  bottomRight: {
    className: 'border-b-current',
    style: {
      bottom: 0,
      right: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: triangleWidth,
      borderLeftWidth: triangleWidth,
    },
  },
  bottomLeft: {
    className: 'border-l-current',
    style: {
      bottom: 0,
      left: 0,
      borderTopWidth: triangleWidth,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderLeftWidth: triangleWidth,
    },
  },
}

const ButtonPrimary = ({
  containerClassName = 'text-brown-light bg-brown-light',
  bgClassName = 'bg-brown',
  className = 'text-brown-light group-hover:text-brown',
  as = 'button',
  disableHoverAnimation = false,
  children,
  ...props
}) => {
  const Component = as
  return (
    <Component
      className={classNames(
        'relative inline-flex justify-center border-4 border-current shadow-md w-full sm:w-auto group transition-colors duration-200',
        containerClassName
      )}
      {...props}
    >
      <div
        className={classNames(
          'absolute inset-0 transition-all',
          bgClassName,
          !disableHoverAnimation &&
            'group-hover:top-[78%] group-hover:bottom-[18%] group-hover:sm:inset-x-6 group-hover:2xl:inset-x-8 group-hover:inset-x-4'
        )}
      ></div>
      <div
        className={classNames(
          'relative inline-flex w-full sm:w-auto justify-center items-center space-x-3 h-full py-2 px-4 sm:px-6 2xl:px-8 font-header text-center text-2xl whitespace-nowrap',
          className
        )}
      >
        {children}
      </div>
      {Object.values(triangles).map((triangle, i) => (
        <div
          key={i}
          className={classNames(
            'absolute border-transparent',
            triangle.className
          )}
          style={triangle.style}
        ></div>
      ))}
    </Component>
  )
}

export default ButtonPrimary
