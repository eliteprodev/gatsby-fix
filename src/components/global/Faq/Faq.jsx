import React, { useState } from 'react'
import { classNames } from '../../../utils/misc'
import DiscordButton from '../../global/Buttons/DiscordButton'
import ButtonPrimary from '../ButtonPrimary'
import diamondWhiteSolid from './assets/diamond-white-solid.png'
import DoubleArrowSVG from './assets/double-arrow.svg'

const Faq = ({ title, description, qnas }) => {
  return (
    <div className="container">
      <div className="lg:flex">
        <div className="lg:w-[500px]">
          <p className="text-2xl text-yellow font-header uppercase">
            Frequently Asked Questions
          </p>
          <p className="mt-3 text-3xl sm:text-4xl lg:text-5xl text-brown-light uppercase">
            {title}
          </p>
          <p className="mt-4 text-brown-light">{description}</p>
          <div className="mt-8 sm:flex space-y-4 sm:space-y-0 sm:space-x-8">
            <DiscordButton
              containerClassName="text-yellow"
              className="text-brown-light"
            />
            <ButtonPrimary
              as="a"
              href="https://forms.gle/rFyrSGjGFtJUL6dE6"
              target="_blank"
              containerClassName="text-blue-light bg-blue-light"
              bgClassName="bg-blue-dark"
              className="text-brown-light group-hover:text-blue-dark"
            >
              Apply Now
            </ButtonPrimary>
          </div>
        </div>
        <div className="lg:w-[11%]"></div>
        <div className="mt-12 lg:mt-0 flex-1 space-y-8">
          {qnas.map((qna, i) => (
            <Qna key={i} {...qna} startOpen={i === 0 ? true : false} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Faq

const Qna = ({ question, answer, startOpen = false }) => {
  const [open, setOpen] = useState(startOpen)
  return (
    <div className="bg-blue-dark border border-white py-4">
      <button
        onClick={() => setOpen(!open)}
        className="relative block w-full text-left pl-4 pr-12 sm:px-20 py-3"
      >
        <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-1">
          <img src={diamondWhiteSolid} alt="" />
        </div>
        <span className="text-sm lg:text-xl uppercase font-bold text-blue-light">
          {question}
        </span>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6">
          <DoubleArrowSVG
            className={classNames('text-blue-light', open && 'rotate-180')}
          />
        </div>
      </button>
      {open && (
        <div className="px-4 sm:px-20 pb-3">
          <div
            className="mt-2 prose max-w-sm sm:max-w-prose text-brown-light"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        </div>
      )}
    </div>
  )
}
