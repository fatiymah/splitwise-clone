// Layout.js
import React from 'react';
import LogoutButton from './Logout';

const Layout = ({ children }) => {
  return (
    <div>
      {/* Include the LogoutButton component */}
      <LogoutButton />
      
      {/* Render the children components */}
      {children}
    </div>
  );
};

export default Layout;
