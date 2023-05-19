// See .cache/page-templates after running dev/build
// to understand how this file ends up looking

import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/global/Layout'
import Seo from '../components/global/Seo'
import { contains } from '../utils/misc'

// ### COMPONENT IMPORTS ### DO NOT MODIFY OR MOVE THIS COMMENT ###

const PageTemplate = pageProps => {
  let data, components
  // ### COMPONENTS VARIABLE ### DO NOT MODIFY OR MOVE THIS COMMENT ###
  components = components.map(component => {
    return {
      name: component.__typename.split('_').pop(),
      data: component,
    }
  })
  let footer = undefined
  for (let i = 0; i < components.length; i++) {
    if (components[i].name === 'Footer') {
      footer = components[i].data
      components.splice(i, 1)
      break
    }
  }

  const componentNames = components.map(c => c.name)
  return (
    <Layout
      footer={footer}
      pageLocation={pageProps.location}
      theme={pageProps.pageContext.theme}
    >
      <Seo title={data.title} />
      {components.map((component, index) => {
        // ### COMPONENT RENDERING ### DO NOT MODIFY OR MOVE THIS COMMENT ###
        return <div>Error: The component {component.name} was not found</div>
      })}
    </Layout>
  )
}

export default PageTemplate

// ### PAGE QUERY ### DO NOT MODIFY OR MOVE THIS COMMENT ###
