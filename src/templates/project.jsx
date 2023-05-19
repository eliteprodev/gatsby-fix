import { graphql } from 'gatsby'
import React from 'react'
import ProjectExpanded from '../components/project/ProjectExpanded'
import ProjectSimple from '../components/project/ProjectSimple'

const ProjectTemplate = pageProps => {
  const data = pageProps.data.wpProject
  return (
    <>
      {data.project.projectType == 'simple' ? (
        <ProjectSimple data={data} pageLocation={pageProps.location} />
      ) : (
        <ProjectExpanded data={data} pageLocation={pageProps.location} />
      )}
    </>
  )
}

export default ProjectTemplate

export const query = graphql`
  query ProjectQuery($id: String!) {
    wpProject(id: { eq: $id }) {
      title
      project {
        status
        launchDate
        shortDescription
        mint {
          goLiveDate
          showCandyMachine
          candyMachine {
            candyMachineId
            solanaNetwork
            mintWith
            tokenName
            artificiallyIncreaseTotalAndRedeemedBy
          }
        }
        projectType
        simple {
          title
          description
          mediaType
          image {
            localFile {
              childImageSharp {
                gatsbyImageData(width: 800)
              }
            }
          }
          imageGif {
            localFile {
              publicURL
            }
          }
          video {
            width
            height
            localFile {
              publicURL
            }
          }
          socials {
            type
            url
          }
        }
        expanded {
          banner {
            backgroundImage {
              localFile {
                childImageSharp {
                  gatsbyImageData(layout: FULL_WIDTH)
                }
              }
            }
          }
          socials {
            type
            url
          }
          roadmap {
            milestones {
              milestone
            }
          }
          nftShowcase {
            gallery {
              localFile {
                childImageSharp {
                  gatsbyImageData(width: 500)
                }
              }
            }
            subtitle
            title
            description
          }
          faq {
            title
            description
            qnas {
              question
              answer
            }
          }
        }
      }
    }
  }
`
