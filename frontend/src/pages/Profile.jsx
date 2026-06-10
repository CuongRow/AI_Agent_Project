import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserIcon, LockIcon } from '../components/Icons';
import ThemeToggleSwitch from '../components/ThemeToggleSwitch';

const EyeIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeOffIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className} style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M21 21l-3.486-3.486m0 0a9 9 0 0 1-12.728 0M18.514 15.02c.545-.882.9-1.885 1.022-2.957a1.01 1.01 0 0 0 0-.639C18.25 7.088 14.226 3.9 12 3.9c-1.397 0-2.715.35-3.87 1.002M3 3l18 18M9 9l3.486 3.486" />
  </svg>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'security', 'settings'

  // Personal Info Form States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Password Visibility States
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Avatar Upload States
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

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

      const updatedUser = response.data;
      updateUser({
        username: updatedUser.username,
        email: updatedUser.email
      });

      setProfileData(updatedUser);
      setProfileSuccess('Cập nhật thông tin hồ sơ thành công!');
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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Kích thước tệp không được vượt quá 5MB!');
      return;
    }

    // Validate format
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setProfileError('Chỉ cho phép các định dạng ảnh JPEG, PNG, GIF, và WEBP!');
      return;
    }

    // Client-side preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setProfileError('');
      setProfileSuccess('');
      
      const response = await api.put('/api/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser = response.data;
      
      // Update global context user
      updateUser({ avatarUrl: updatedUser.avatarUrl });
      setProfileData(updatedUser);
      setProfileSuccess('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Cập nhật ảnh đại diện thất bại.');
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: '36px', width: '30%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '18px', width: '45%', marginBottom: '32px' }} />
        <div className="card" style={{ height: '380px' }} />
      </div>
    );
  }

  const createdDate = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : 'Chưa rõ';

  const passwordsMatch = newPassword && confirmPassword ? newPassword === confirmPassword : null;

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Hồ Sơ Cá Nhân
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Quản lý thông tin tài khoản và cấu hình hệ thống của bạn.
        </p>
      </div>

      {/* Profile Info Details Header */}
      <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }} className="avatar-container">
          {avatarPreview || profileData?.avatarUrl ? (
            <img 
              src={avatarPreview || profileData.avatarUrl} 
              alt="Avatar" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }} 
            />
          ) : (
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700
            }}>
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          {/* Hover Camera Overlay */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            className="avatar-hover-overlay"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#ffffff" style={{ width: '24px', height: '24px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleAvatarChange} 
            disabled={uploading} 
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {profileData?.username}
            {uploading && (
              <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}>
                (Đang tải tệp lên...)
              </span>
            )}
          </h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            {profileData?.roles?.map((role) => (
              <span
                key={role}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: role === 'ROLE_ADMIN' ? 'rgba(239, 68, 68, 0.1)' : role === 'ROLE_INSTRUCTOR' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                  color: role === 'ROLE_ADMIN' ? 'var(--danger)' : role === 'ROLE_INSTRUCTOR' ? 'var(--success)' : 'var(--primary)',
                  border: role === 'ROLE_ADMIN' ? '1px solid rgba(239, 68, 68, 0.15)' : role === 'ROLE_INSTRUCTOR' ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(37, 99, 235, 0.15)'
                }}
              >
                {role === 'ROLE_ADMIN' ? 'Quản trị viên' : role === 'ROLE_INSTRUCTOR' ? 'Giảng viên' : 'Học viên'}
              </span>
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Ngày tham gia: <strong>{createdDate}</strong>
          </p>
        </div>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveTab('personal')}
          style={{
            padding: '12px 16px',
            borderBottom: activeTab === 'personal' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'personal' ? 'var(--primary)' : 'var(--text-muted)',
            background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition-fast)'
          }}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '12px 16px',
            borderBottom: activeTab === 'security' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)',
            background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition-fast)'
          }}
        >
          Bảo mật
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '12px 16px',
            borderBottom: activeTab === 'settings' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
            background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            fontWeight: 600, cursor: 'pointer', transition: 'all var(--transition-fast)'
          }}
        >
          Cài đặt hệ thống
        </button>
      </div>

      {/* Global Alerts */}
      {profileError && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '20px'
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
          fontSize: '0.85rem',
          marginBottom: '20px'
        }}>
          {profileSuccess}
        </div>
      )}

      {/* Tab Panels */}
      {activeTab === 'personal' && (
        <div className="card glass animate-fade-in-up">
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <UserIcon size={20} color="var(--primary)" />
              Cập nhật thông tin tài khoản
            </h3>

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
              style={{ padding: '12px 24px', fontWeight: 600, width: '100%', maxWidth: '200px', alignSelf: 'flex-start', marginTop: '10px' }}
              disabled={updatingProfile}
            >
              {updatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card glass animate-fade-in-up">
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <LockIcon size={20} color="var(--secondary)" />
              Đổi mật khẩu bảo mật
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

            {/* Mật khẩu cũ */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mật khẩu hiện tại</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={updatingPassword}
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showOldPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>

            {/* Mật khẩu mới */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mật khẩu mới</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={updatingPassword}
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showNewPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Xác nhận mật khẩu mới</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={updatingPassword}
                  required
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showConfirmPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              
              {/* Passwords Match Visual Indicator */}
              {passwordsMatch !== null && (
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginTop: '8px',
                  color: passwordsMatch ? 'var(--success)' : 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: passwordsMatch ? 'var(--success)' : 'var(--danger)',
                    display: 'inline-block'
                  }}></span>
                  {passwordsMatch ? 'Mật khẩu trùng khớp' : 'Mật khẩu chưa khớp'}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ padding: '12px 24px', fontWeight: 600, width: '100%', maxWidth: '200px', alignSelf: 'flex-start', marginTop: '10px' }}
              disabled={updatingPassword || passwordsMatch === false}
            >
              {updatingPassword ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="card glass animate-fade-in-up">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
            Cấu hình giao diện hệ thống
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>Chế độ hiển thị</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chuyển đổi giao diện sáng (Light) hoặc tối (Dark) cho toàn trang web.</p>
            </div>
            <div style={{ padding: '10px 20px' }}>
              <ThemeToggleSwitch />
            </div>
          </div>
        </div>
      )}

      {/* Styling for avatar hover overlay */}
      <style>{`
        .avatar-container:hover .avatar-hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
};

export default Profile;
