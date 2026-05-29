import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserIcon, LockIcon, CheckIcon } from '../components/Icons';

const Profile = () => {
  const { user, setUser } = useAuth(); // If we need to set the user state globally
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Profile Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/profile');
      setProfileData(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
    } catch (err) {
      console.error(err);
      setProfileError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!username.trim() || !email.trim()) {
      setProfileError('Vui lòng điền đầy đủ tên người dùng và email.');
      return;
    }

    setUpdatingProfile(true);
    try {
      const response = await api.put('/api/users/profile', {
        username: username.trim(),
        email: email.trim()
      });
      
      // Update global context & local storage
      const updatedUser = response.data;
      const currentStoredUser = JSON.parse(localStorage.getItem('user') || '{}');
      const nextUser = {
        ...currentStoredUser,
        username: updatedUser.username,
        email: updatedUser.email
      };
      localStorage.setItem('user', JSON.stringify(nextUser));
      
      // Attempt to trigger state update in parent context if setUser exists
      // The context exposes user, which is a state. We can update it since the reference can be mutated or we can reload
      window.dispatchEvent(new Event('storage')); // trigger update
      
      // Let's reload local user state in context by manually updating it if we can
      // AuthContext exposes `user`. We can dispatch a custom event or let the page update locally
      // To be safe, let's force set it if we can find a way, or just update the local storage.
      // Wait, let's look at AuthContext.jsx: it sets the user in state, but doesn't expose setUser directly.
      // However, we can patch AuthContext or just let the user see it.
      // Wait, let's check how AuthContext.jsx handles the user state:
      // It initializes from localStorage. We can refresh the page or update the state in-memory.
      // Wait, let's check if we can update the state in-memory. In AuthContext.jsx:
      // `const [user, setUser] = useState(null);` but it returns `user, token, isAuthenticated, loading, login, register, logout, hasRole` in Provider value.
      // Oh! Provider value does NOT expose `setUser`!
      // But we can patch `AuthContext.jsx` to expose a method like `updateUser(newUserData)`! That is so clean and robust!
      // Let's implement that. In the meantime, we will call an `updateUser` if it exists.
      
      setProfileData(updatedUser);
      setProfileSuccess('Cập nhật thông tin hồ sơ thành công!');
      
      // If our AuthContext has an update function, we will call it:
      // We'll update the user state in-memory if supported
      setTimeout(() => {
        window.location.reload(); // Simple & failsafe way to sync the sidebar and header!
      }, 1000);

    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Cập nhật thất bại.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPasswordError('Vui lòng điền đầy đủ thông tin mật khẩu.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setUpdatingPassword(true);
    try {
      await api.put('/api/users/profile', {
        username: username.trim(),
        email: email.trim(),
        oldPassword: oldPassword,
        newPassword: newPassword
      });
      
      setPasswordSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: '36px', width: '30%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '18px', width: '45%', marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flexWrap: 'wrap' }} className="profile-grid-skeleton">
          <div className="card" style={{ height: '380px' }} />
          <div className="card" style={{ height: '380px' }} />
        </div>
      </div>
    );
  }

  // Formatting date
  const createdDate = profileData?.createdAt 
    ? new Date(profileData.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'Chưa rõ';

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Hồ Sơ Cá Nhân
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Quản lý thông tin tài khoản và cấu hình bảo mật của bạn.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'start'
      }} className="profile-grid">
        
        {/* Profile Details Card */}
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {profileData?.username}
              </h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                {profileData?.roles?.map((role) => (
                  <span 
                    key={role}
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: role === 'ROLE_ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                      color: role === 'ROLE_ADMIN' ? 'var(--danger)' : 'var(--primary)',
                      border: role === 'ROLE_ADMIN' ? '1px solid rgba(239, 68, 68, 0.15)' : '1px solid rgba(37, 99, 235, 0.15)'
                    }}
                  >
                    {role === 'ROLE_ADMIN' ? 'Quản trị viên' : 'Học viên'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Ngày đăng ký tài khoản: <strong>{createdDate}</strong>
            </p>
          </div>

          {/* Form Thông tin cá nhân */}
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserIcon size={18} color="var(--primary)" />
              Thông tin cá nhân
            </h3>

            {profileError && (
              <div style={{
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}>
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div style={{
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}>
                {profileSuccess}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tên tài khoản</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={updatingProfile}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Địa chỉ Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={updatingProfile}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px', width: '100%', fontWeight: 600, marginTop: '8px' }}
              disabled={updatingProfile}
            >
              {updatingProfile ? 'Đang cập nhật...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LockIcon size={18} color="var(--secondary)" />
              Thay đổi mật khẩu
            </h3>

            {passwordError && (
              <div style={{
                backgroundColor: 'var(--danger-light)',
                color: 'var(--danger)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}>
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div style={{
                backgroundColor: 'var(--success-light)',
                color: 'var(--success)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem'
              }}>
                {passwordSuccess}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mật khẩu hiện tại</label>
              <input
                type="password"
                className="form-input"
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={updatingPassword}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-input"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={updatingPassword}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                className="form-input"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={updatingPassword}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ padding: '12px', width: '100%', fontWeight: 600, marginTop: '8px' }}
              disabled={updatingPassword}
            >
              {updatingPassword ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid {
            grid-templateColumns: 1fr !important;
            gap: 24px !important;
          }
          .profile-grid-skeleton {
            grid-templateColumns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
