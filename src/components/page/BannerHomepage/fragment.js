module.exports = () => {
  return `
    title
    domains {
      name
      icon {
        localFile {
          childImageSharp {
            gatsbyImageData(width: 64, quality: 100, placeholder: BLURRED)
          }
        }
      }
      exampleGodNoBackground {
        localFile {
          childImageSharp {
            gatsbyImageData(width: 1247, quality: 100, placeholder: NONE)
          }
        }
      }
      exampleGod {
        localFile {
          childImageSharp {
            gatsbyImageData(width: 647, quality: 100, placeholder: NONE)
          }
        }
      }
      shortDescription
    }
  `
}
