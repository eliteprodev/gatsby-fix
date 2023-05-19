module.exports = () => {
  return `
    mintDate
    title
    description
    backgroundColumns {
      images {
        localFile {
          childImageSharp {
            gatsbyImageData(width: 500)
          }
        }
      }
    }
  `
}
