import React from 'react'
import Footer from '../../page/Footer'
import BgLine from '../BgLine'
import Header from '../Header'

export const ThemeContext = React.createContext('yellow')

const Layout = ({ children, footer, pageLocation, theme }) => {
  return (
    <ThemeContext.Provider value={theme}>
      <div className="relative">
        <Header pageLocation={pageLocation} theme={theme} />
        <BgLine />
        <main>{children}</main>
        {footer && <Footer {...footer} />}
      </div>
    </ThemeContext.Provider>
  )
}

export default Layout
