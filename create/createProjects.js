module.exports.createProjects = async gatsbyUtilities => {
  const projects = await getProjects(gatsbyUtilities)
  await createProjects(projects, gatsbyUtilities)
}

const getProjects = async ({ graphql }) => {
  const query = `
    query GetAllProjects {
      allWpProject {
        nodes {
          id
          uri
          project {
            createPageForThisProject
          }
        }
      }
    }
  `
  const graphqlResult = await graphql(query)
  if (graphqlResult.errors) {
    console.error(graphqlResult.errors)
    throw new Error('GraphQL query failed')
  }

  const projects = graphqlResult.data['allWpProject'].nodes.filter(
    node => node.project.createPageForThisProject
  )

  return projects
}

const createProjects = async (projects, { actions }) => {
  return Promise.all(
    projects.map(project => {
      return actions.createPage({
        path: project.uri,
        component: require.resolve('../src/templates/project.jsx'),
        context: {
          id: project.id,
        },
      })
    })
  )
}
