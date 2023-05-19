module.exports = () => {
  return `
    title
    phases {
      complete
      title
      date
      description
      mainFeature
      otherFeatures {
        feature
      }
    }
  `
}
