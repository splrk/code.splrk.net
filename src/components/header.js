import React from 'react';

export default class Header extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <header className="fixed pin-t pin-l pin-r bg-yellow p-4 shadow-md z-50">
        { children }
      </header>
    );
  }
}

