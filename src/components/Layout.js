import Sidebar from "./Sidebar";

import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-row justify-start">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto  ">{children}</main>
    </div>
  );
};

export default Layout;
