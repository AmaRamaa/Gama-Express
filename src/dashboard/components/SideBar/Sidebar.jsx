import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";

const menuItems = [
  {
    icon: <FaHome />,
    label: "Home",
    tabId: "home"
  },
  {
    icon: <FaCog />,
    label: "Manufacture",
    children: [
      { icon: <FaCog />, label: "List", tabId: "manufacture-list" },
      { icon: <FaCog />, label: "Create", tabId: "manufacture-create" }
    ]
  },
  {
    icon: <FaCog />,
    label: "Models",
    children: [
      { icon: <FaCog />, label: "List", tabId: "models-list" },
      { icon: <FaCog />, label: "Create", tabId: "models-create" }
    ]
  },
  {
    icon: <FaCog />,
    label: "Parts",
    children: [
      { icon: <FaCog />, label: "List", tabId: "parts-list" },
      { icon: <FaCog />, label: "Create", tabId: "parts-create" }
    ]
  },
  {
    icon: <FaUser />,
    label: "Profiles",
    children: [
      { icon: <FaUser />, label: "List", tabId: "profiles-list" },
      { icon: <FaUser />, label: "Create", tabId: "profiles-create" }
    ]
  },
  {
    icon: <FaSignOutAlt />,
    label: "Logout",
    tabId: "logout"
  }
];
const iconBgColors = ["#f5a623", "#f8e71c", "#7ed321", "#50e3c2", "#4a90e2", "#9013fe"];

const SidebarMenu = ({ items, open, expandedMenus, toggleMenu, level = 0, onMenuClick }) => (
  <ul style={{ listStyle: "none", paddingLeft: level === 0 ? 0 : 16, margin: 0 }}>
    {items.map((item, idx) => (
      <li key={item.label + idx} style={{ marginBottom: 2 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            cursor: item.children ? "pointer" : "default",
            background: "#232629",
            color: "#f5f6fa", // lighter text
            padding: "10px 18px", // more padding
            fontSize: 17, // larger font
            fontWeight: 600, // bolder
            borderRadius: 0,
            transition: "background 0.2s",
            marginLeft: level > 0 ? 8 : 0,
            gap: 12 // more gap
          }}
          onClick={() => {
            if (item.children) toggleMenu(item.label);
            else if (onMenuClick && item.tabId) onMenuClick(item.tabId);
          }}
          onMouseOver={e => e.currentTarget.style.background = "#313438"}
          onMouseOut={e => e.currentTarget.style.background = "#232629"}
        >
          <span style={{
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: iconBgColors[(idx + level) % iconBgColors.length],
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 4,
            fontSize: 20,
            marginRight: open ? 10 : 0
          }}>
            {item.icon}
          </span>
          {open && <span>{item.label}</span>}
          {item.children && open && (
            <span style={{ marginLeft: "auto" }}>
              {expandedMenus[item.label] ? <FaChevronDown /> : <FaChevronRight />}
            </span>
          )}
        </div>
        {item.children && expandedMenus[item.label] && open && (
          <SidebarMenu
            items={item.children}
            open={open}
            expandedMenus={expandedMenus}
            toggleMenu={toggleMenu}
            level={level + 1}
            onMenuClick={onMenuClick}
          />
        )}
      </li>
    ))}
  </ul>
);

const Sidebar = ({ onMenuClick }) => {
    const [open, setOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (label) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    return (
        <nav
            style={{
                width: open ? 220 : 60,
                background: "#232629",
                color: "#f5f6fa", // lighter text
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                borderRight: "1px solid #232629",
                transition: "width 0.2s",
                zIndex: 100
            }}
        >
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: open ? "space-between" : "center",
                padding: "14px 18px",
                background: "#232629",
                borderBottom: "1px solid #313438"
            }}>
                {open && <span style={{ fontWeight: 700, fontSize: 20, color: "#fff" }}>GAMA EXPRESS</span>}
                <button
                    style={{
                        background: "none",
                        border: "none",
                        color: "#fff",
                        fontSize: 22,
                        cursor: "pointer",
                        marginLeft: open ? 8 : 0
                    }}
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle sidebar"
                >
                    <FaBars />
                </button>
            </div>
            <SidebarMenu
                items={menuItems}
                open={open}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
                onMenuClick={onMenuClick}
            />
        </nav>
    );
};

export default Sidebar;