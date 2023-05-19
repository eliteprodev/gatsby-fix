module.exports = () => {
  return `
    title
    projects {
      project {
        __typename
        ... on WpProject {
          title
          uri
          project {
            createPageForThisProject
            status
            previewImageType
            previewImage {
              localFile {
                childImageSharp {
                  gatsbyImageData(width: 680)
                }
              }
            }
            previewImageGif {
              localFile {
                publicURL
              }
            }
            launchDate
            shortDescription
          }
        }
      }
    }
  `
}
