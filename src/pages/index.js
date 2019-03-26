import React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle} className="md:flex md:flex-row-reverse">
        <SEO
          title="All posts"
          keywords={[`blog`, `javascript`]}
        />
        <Bio />
        <div>
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          const tags = node.frontmatter.tags || [];
          return (
            <div key={node.fields.slug} className="border-b border-grey mb-16">
              <h2 className="mb-0 font-serif inline-block mr-1">
                <Link to={node.fields.slug} className="text-black no-underline">
                  {title}
                </Link>
              </h2>
                { tags.map(tag => (
                  <small class="inline-block text-white bg-blue py-1 px-2 ml-1 rounded align-text-bottom">
                    { tag }
                  </small>
                ))}
              <div className="mb-4 block">
                <small>{node.frontmatter.date}</small>
              </div>
              <p
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
                className="mb-4"
              />
            </div>
          )
        })}
        </div>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description,
            tags
          }
        }
      }
    }
  }
`
