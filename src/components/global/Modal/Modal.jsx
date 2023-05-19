import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { classNames } from '../../../utils/misc'

const Modal = ({ show, close, children, className }) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-20 inset-0 overflow-y-auto p-4 flex justify-center items-center"
        onClose={close}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="absolute inset-0 transition-opacity bg-white bg-opacity-50 backdrop-blur-[2px]" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            className={classNames(
              'py-8 sm:py-10 px-4 sm:px-14 transform transition-all sm:my-8 max-w-[536px] 4k:max-w-[655px] backdrop-blur-2xl bg-white bg-opacity-50',
              className
            )}
          >
            {children}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
