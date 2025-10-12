import React from 'react'
import { NavLink } from 'react-router-dom'
// import './AdminSidebar.css'

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/films', icon: '🎬', label: 'Quản lý phim' },
    { path: '/admin/showtime', icon: '👥', label: 'Xuất chiếu' },
    { path: '/admin/bookings', icon: '🎫', label: 'Đơn đặt vé' },
    { path: '/admin/users', icon: '👥', label: 'Người dùng' },
  ]

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>🎭 Cinema Admin</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default AdminSidebar