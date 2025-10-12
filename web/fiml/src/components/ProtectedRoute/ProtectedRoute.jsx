// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate, useLocation } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useSelector(state => state.auth);
//   const location = useLocation();

//   // Nếu chưa đăng nhập, chuyển hướng đến trang login
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // Nếu đã đăng nhập, cho phép truy cập
//   return children;
// };

// export default ProtectedRoute;
// components/ProtectedRoute/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null, adminOnly = false }) => {
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Chưa đăng nhập
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin role
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h1>⛔ Truy cập bị từ chối</h1>
          <p>Bạn không có quyền truy cập trang này.</p>
          <button onClick={() => window.history.back()}>Quay lại</button>
        </div>
      </div>
    );
  }

  // Check specific role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h1>⛔ Truy cập bị từ chối</h1>
          <p>Bạn cần quyền {requiredRole} để truy cập trang này.</p>
          <button onClick={() => window.history.back()}>Quay lại</button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;