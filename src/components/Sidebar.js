import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { createClient } from "../utils/supabase/component";

import {
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
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
