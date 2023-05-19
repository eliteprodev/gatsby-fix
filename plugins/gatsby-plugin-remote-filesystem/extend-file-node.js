const { GraphQLString } = require('gatsby/graphql')
const fs = require('fs-extra')
const path = require('path')

module.exports = (
  { type, getNodeAndSavePathDependency, pathPrefix = '' },
  pluginOptions
) => {
  if (type.name !== 'File') {
    return {}
  }

  return {
    localURL: {
      type: GraphQLString,
      args: {},
      description: 'Copy file to static directory and return public url to it',
      resolve: (file, fieldArgs, context) => {
        const details = getNodeAndSavePathDependency(file.id, context.path)
        const parentDir = pluginOptions.fingerprintDirectory
          ? file.internal.contentDigest
          : ''
        const fileName = pluginOptions.fingerprintDirectory
          ? `${file.name}${details.ext}`
          : `${file.name}-${file.internal.contentDigest}${details.ext}`

        const dirPath = path.join(process.cwd(), 'public', 'static', parentDir)
        const publicPath = path.join(dirPath, fileName)
        const shouldProcess = pluginOptions.mediaTypes
          ? pluginOptions.mediaTypes.includes(file.internal.mediaType)
          : true

        if (shouldProcess && !fs.existsSync(publicPath)) {
          fs.ensureDirSync(dirPath)
          fs.copy(details.absolutePath, publicPath, err => {
            if (err) {
              console.error(
                `error copying file from ${details.absolutePath} to ${publicPath}`,
                err
              )
            }
          })
        } else if (!shouldProcess) {
          return null
        }

        return pluginOptions.fingerprintDirectory
          ? `${pathPrefix}/static/${parentDir}/${fileName}`
          : `${pathPrefix}/static/${fileName}`
      },
    },
  }
}
