require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-wordpress`,
      options: {
        url: process.env.WPGRAPHQL_URL || `https://content.godz.io/graphql`,//`http://www.godz.local/graphql`,
        type: {
          MediaItem: {
            localFile: {
              maxFileSizeBytes: 83886080, // 80Mb
            },
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-remote-filesystem`,
      options: {
        fingerprintDirectory: true,
        mediaTypes: ['application/pdf'],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets`, // this needs to include a path with atleast 1 file
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-react-svg`,
  ],
}
