import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import '../../../i18n';

const menuItems = [
  {
    icon: <FaHome />,
    label: "sidebar.home",
    tabId: "home"
  },
  {
    icon: <FaCog />,
    label: "sidebar.manufacture",
    children: [
      { icon: <FaCog />, label: "sidebar.manufactureList", tabId: "manufacture-list" },
      { icon: <FaCog />, label: "sidebar.manufactureCreate", tabId: "manufacture-create" }
    ]
  },
  {
    icon: <FaCog />,
    label: "sidebar.models",
    children: [
      { icon: <FaCog />, label: "sidebar.modelsList", tabId: "models-list" },
      { icon: <FaCog />, label: "sidebar.modelsCreate", tabId: "models-create" }
    ]
  },
  {
    icon: <FaCog />,
    label: "sidebar.parts",
    children: [
      { icon: <FaCog />, label: "sidebar.partsList", tabId: "parts-list" },
      { icon: <FaCog />, label: "sidebar.partsCreate", tabId: "parts-create" }
    ]
  },
  {
    icon: <FaUser />,
    label: "sidebar.profiles",
    children: [
      { icon: <FaUser />, label: "sidebar.profilesList", tabId: "profiles-list" },
      { icon: <FaUser />, label: "sidebar.profilesCreate", tabId: "profiles-create" }
    ]
  },
  {
    icon: <FaSignOutAlt />,
    label: "sidebar.logout",
    tabId: "logout"
  }
];
const iconBgColors = ["#f5a623", "#f8e71c", "#7ed321", "#50e3c2", "#4a90e2", "#9013fe"];

const SidebarMenu = ({ items, open, expandedMenus, toggleMenu, level = 0, onMenuClick }) => {
  const { t } = useTranslation();
  return (
    <ul style={{ listStyle: "none", paddingLeft: level === 0 ? 0 : 16, margin: 0 }}>
      {items.map((item, idx) => (
        <li key={item.label + idx} style={{ marginBottom: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: item.children ? "pointer" : "default",
              background: "#232629",
              color: "#f5f6fa",
              padding: "10px 18px",
              fontSize: 17,
              fontWeight: 600,
              borderRadius: 0,
              transition: "background 0.2s",
              marginLeft: level > 0 ? 8 : 0,
              gap: 12
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
            {open && <span>{t(item.label)}</span>}
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
};

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
                color: "#f5f6fa",
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