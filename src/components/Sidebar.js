import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import { createClient } from "../utils/supabase/component";

import {
  PieChartOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const menuItems = [
  { id: 1, label: "Dashboard", icon: PieChartOutlined, link: "/" },
  {
    id: 2,
    label: "Manajemen Kamar",
    icon: HomeOutlined,
    link: "/management-kamar",
  },
  {
    id: 3,
    label: "Manajemen Santri",
    icon: TeamOutlined,
    link: "/management-santri",
  },
];

const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const activeMenu = useMemo(
    () => menuItems.find((menu) => menu.link === router.pathname),
    [router.pathname]
  );

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-light flex justify-between flex-col",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-light-lighter absolute right-0",
    {
      "rotate-180": toggleCollapse,
    }
  );

  const getNavItemClasses = (menu) => {
    return classNames(
      "flex items-center cursor-pointer hover:bg-light-lighter rounded w-full overflow-hidden whitespace-nowrap",
      {
        ["bg-light-lighter"]: activeMenu && activeMenu.id === menu.id,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut().then(() => router.push("/login"));
  };

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <img
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGHQRR2c8nisud_vFQL5YJwiQOJt_2MzNJqspRgvAzir2NcI20WRlekz2JHcaY0m-SgG1ti-PlgiALpJRRWbNpRgtPAKZ2PKEU7v0wsXuBMfBJOuz6RgGUX9Lf5T0tPVZU-K38E_N1scTU/s320/alhasan.png"
              alt="Logo"
              className="h-8 w-8"
            />
            <span
              className={classNames("mt-2 text-lg font-medium text-text", {
                hidden: toggleCollapse,
              })}
            >
              AL HASAN
            </span>
          </div>
          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              {toggleCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24">
          {menuItems.map(({ icon: Icon, ...menu }) => {
            const classes = getNavItemClasses(menu);
            return (
              <Link href={menu.link} key={menu.id}>
                <div className={classes}>
                  <div className="flex py-4 px-3 items-center w-full h-full">
                    <div style={{ width: "2.5rem" }}>
                      <Icon />
                    </div>
                    {!toggleCollapse && (
                      <span
                        className={classNames(
                          "text-md font-medium text-text-light"
                        )}
                      >
                        {menu.label}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={`${getNavItemClasses({})} px-3 py-4`}>
        <div style={{ width: "2.5rem" }}>
          <LogoutOutlined />
        </div>
        {!toggleCollapse && (
          <button
            type="button"
            onClick={handleLogout}
            className={classNames("text-md font-medium text-text-light")}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { createClient } from "../utils/supabase/component";
// import {
//   PieChartOutlined,
//   TeamOutlined,
//   LogoutOutlined,
//   CloseOutlined,
//   MenuOutlined,
//   HomeOutlined,
// } from "@ant-design/icons";

// export default function Sidebar() {
//   const router = useRouter();
//   const supabase = createClient();
//   const [isOpen, setIsOpen] = useState(false);
//   const [closeTimeout, setCloseTimeout] = useState(null);

//   const handleToggleSidebar = () => {
//     setIsOpen(!isOpen);
//     if (!isOpen) {
//       const timeout = setTimeout(() => {
//         setIsOpen(false);
//       }, 3000);
//       setCloseTimeout(timeout);
//     } else {
//       clearTimeout(closeTimeout);
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut().then(() => router.push("/login"));
//   };

//   useEffect(() => {
//     return () => {
//       if (closeTimeout) {
//         clearTimeout(closeTimeout);
//       }
//     };
//   }, [closeTimeout]);

//   return (
//     <>
//       <div className="text-left py-6 px-4">
//         <button
//           type="button"
//           data-drawer-target="drawer-navigation"
//           data-drawer-show="drawer-navigation"
//           aria-controls="drawer-navigation"
//           onClick={handleToggleSidebar}
//         >
//           <MenuOutlined style={{ fontSize: "1.5rem" }} />
//         </button>
//       </div>

//       <div
//         id="drawer-navigation"
//         className={`fixed top-0 left-0 z-20 w-50 h-screen p-2 overflow-y-auto transition-transform ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } bg-blue-300 dark:bg-gray-800`}
//         tabIndex="-1"
//         aria-labelledby="drawer-navigation-label"
//       >
//         <h5
//           className="text-base font-semibold text-gray-800 uppercase dark:text-gray-400"
//           id="drawer-navigation-label"
//         >
//           ALFURQON
//         </h5>
//         <button
//           type="button"
//           data-drawer-hide="drawer-navigation"
//           aria-controls="drawer-navigation"
//           className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
//           onClick={handleToggleSidebar}
//         >
//           <CloseOutlined style={{ fontSize: "1rem" }} />
//         </button>
//         <div className="py-4 overflow-y-auto">
//           <ul className="space-y-2 font-medium">
//             <li>
//               <Link
//                 href="/dashboard"
//                 className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <span className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
//                   <PieChartOutlined style={{ color: "#000000" }} />
//                 </span>
//                 <span className="ms-3">Dashboard</span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/management-kamar"
//                 className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <span className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
//                   <HomeOutlined style={{ color: "#000000" }} />
//                 </span>
//                 <span className="flex-1 ms-3 whitespace-nowrap">
//                   Management Kamar
//                 </span>
//               </Link>
//             </li>
//             <li>
//               <Link
//                 href="/management-santri"
//                 className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <span className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
//                   <TeamOutlined style={{ color: "#000000" }} />
//                 </span>
//                 <span className="flex-1 ms-3 whitespace-nowrap">
//                   Management Santri
//                 </span>
//               </Link>
//             </li>

//             <li>
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <span className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
//                   <LogoutOutlined style={{ color: "#000000" }} />
//                 </span>
//                 <span className="flex-1 ms-3 whitespace-nowrap ">Log Out</span>
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// }
