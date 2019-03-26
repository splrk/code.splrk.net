import React from "react"
import Header from './header.js';

class Layout extends React.Component {
  render() {
    const { title, children } = this.props
    
    return (
      <div className="ml-auto mr-auto max-w-xl pt-24 pl-3 pr-3">
        <Header>{ title }</Header>
        <main className="font-sans leading-normal md:flex md:flex-row-reverse">
          {children}
        </main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    )
  }
}

export default Layout
