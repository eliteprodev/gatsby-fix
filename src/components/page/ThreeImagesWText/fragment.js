module.exports = () => {
  return `
    images {
      localFile {
        childImageSharp {
          gatsbyImageData(width: 500)
        }
      }
    }
    subtitle
    title
    description
  `
}
