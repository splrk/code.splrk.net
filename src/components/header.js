import React from 'react';
import { Link } from 'gatsby';

export default class Header extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <header className="fixed pin-t pin-l pin-r bg-yellow p-4 shadow-md z-50">
        <h1 className="font-serif">
          <Link className="no-underline text-black shadow-none" to="/">
            { children }
          </Link>
        </h1>
      </header>
    );
  }
}

