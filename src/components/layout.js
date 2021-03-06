import React from "react"
import Header from './header.js';
import { Link } from 'gatsby';

class Layout extends React.Component {
  render() {
    const { title, children, description, className } = this.props
    
    return (
      <div className="pin g-radial-light-br">
        <div className="ml-auto mr-auto max-w-xl pl-3 pr-3">
          <Header>
            <h1 className="font-serif">
              <Link className="no-underline text-black shadow-none" to="/">
                { title }
              </Link>
            </h1>
            <h5>
              { description }
            </h5>
          </Header>
          <main className={ `font-sans leading-normal pt-24 ${className}` }>
            {children}
          </main>
          <footer className="pin-l pin-r bg-blue-darker absolute text-white">
            <div className="ml-auto mr-auto max-w-xl p-3">
              © {new Date().getFullYear()}, Built with
              {` `}
              <a className="text-grey-light underline hover:text-grey-dark" href="https://www.gatsbyjs.org">Gatsby</a>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

export default Layout
