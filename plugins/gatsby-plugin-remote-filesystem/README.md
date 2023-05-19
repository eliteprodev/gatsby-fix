# gatsby-transformer-remote-filesystem

A Gatsby transformer plugin for copying remote `File` node content
to the `/static/` folder and exposing the path via `localURL`.

This is useful when you all your content is sourced through
a remote source (i.e. `gatsby-source-contentful`, `gatsby-source-wordpress`).

With this plugin, you no longer have to install `gatsby-source-filesystem`
if all of your data is remote. Bye-bye unneccesary dependencies and `gatsby-node` logic!
See https://github.com/gatsbyjs/gatsby/issues/4993 for a discussion of this issue.

This plugin also includes extra options for fingerprinting the parent directory
instead of the file name, as well as a mime-type filter.

## Install

`npm install --save gatsby-transformer-remote-filesystem`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    // By default, this mimics the behavior of gatsby-source-filesystem
    // with the exception of exposing the path via `localURL` instead of
    // `publicURL`.
    `gatsby-plugin-remote-filesystem`
  ],
}
```

## Options

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-remote-filesystem`,
      options: {
        // If true, fingerprint the directory instead of the filename
        // (as `gatsby-transformer-sharp` does).
        // For example, /static/my_file-1234asdf.pdf will become
        // /static/1324asdf/my_file.pdf.
        // Consider the SEO implications if your site is already published.
        fingerprintDirectory : true,

        // If included, only copies `File`s where `internal.mediaType` matches.
        // If option is not included, will copy all `File`s.
        // If you only need images, consider using `gatsy-transformer-sharp`
        // instead of this plugin.
        mediaTypes: ['application/pdf'],
      }
    }
  ],
}
```

## How to query

You can query file nodes like the following:

```graphql
{
  allFile {
    edges {
      node {
        localURL
      }
    }
  }
}
```
## Contributing

This plugin only implements a single `gatsby-node` function so its pretty
easy to grok. Feel free to send a PR!

The logic is from [gatsby-source-filesystem](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-filesystem/src/extend-file-node.js), I just added some options.