import { graphql, useStaticQuery } from 'gatsby'
import React from 'react'
import { Helmet } from 'react-helmet'

const Seo = ({ title, description, image }) => {
  const data = useStaticQuery(graphql`
    query SeoQuery {
      wp {
        generalSettings {
          title
          description
        }
        acfOptionsSiteConfiguration {
          siteConfiguration {
            favicon16: favicon {
              localFile {
                childImageSharp {
                  gatsbyImageData(layout: FIXED, width: 16, height: 16)
                }
              }
            }
            favicon32: favicon {
              localFile {
                childImageSharp {
                  gatsbyImageData(layout: FIXED, width: 32, height: 32)
                }
              }
            }
          }
        }
      }
    }
  `)
  const siteTitle = data.wp.generalSettings.title
  const siteDescription = description ?? data.wp.generalSettings.description
  const siteConfig = data.wp.acfOptionsSiteConfiguration.siteConfiguration

  return (
    <Helmet
      defaultTitle={siteTitle}
      titleTemplate={`%s - ${siteTitle}`}
      title={title}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <meta name="description" content={siteDescription} />
      {siteConfig.favicon16 && (
        <link
          rel="icon"
          type="image/png"
          href={
            siteConfig.favicon16.localFile.childImageSharp.gatsbyImageData
              .images.fallback.src
          }
          sizes="16x16"
        />
      )}
      {siteConfig.favicon32 && (
        <link
          rel="icon"
          type="image/png"
          href={
            siteConfig.favicon32.localFile.childImageSharp.gatsbyImageData
              .images.fallback.src
          }
          sizes="32x32"
        />
      )}
      {image && <meta name="og:image" content={image} />}
    </Helmet>
  )
}

export default Seo
