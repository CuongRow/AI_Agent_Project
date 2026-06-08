import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserIcon, LockIcon } from '../components/Icons';

const Profile = () => {
  const { user } = useAuth();
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

      const updatedUser = response.data;
      const currentStoredUser = JSON.parse(localStorage.getItem('user') || '{}');
      const nextUser = {
        ...currentStoredUser,
        username: updatedUser.username,
        email: updatedUser.email
      };
      localStorage.setItem('user', JSON.stringify(nextUser));

      setProfileData(updatedUser);
      setProfileSuccess('Cập nhật thông tin hồ sơ thành công!');

      // Reload after a short delay to sync the sidebar and header
      setTimeout(() => {
        window.location.reload();
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

  // Avatar upload handler
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.put('/api/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedUser = response.data;
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      const next = { ...stored, avatarUrl: updatedUser.avatarUrl };
      localStorage.setItem('user', JSON.stringify(next));
      setProfileData(updatedUser);
      setProfileSuccess('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      setProfileError(err.response?.data?.message || err.message || 'Cập nhật ảnh đại diện thất bại.');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: '36px', width: '30%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '18px', width: '45%', marginBottom: '32px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="profile-grid-skeleton">
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
    <>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Hồ Sơ Cá Nhân
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Quản lý thông tin tài khoản và cấu hình bảo mật của bạn.
        </p>
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }} className="profile-grid">

        {/* Profile Details Card */}
        <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {profileData?.avatarUrl ? (
              <img src={profileData.avatarUrl} alt="Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
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
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }} id="avatarInput" onChange={handleAvatarChange} />
            <label htmlFor="avatarInput" className="btn btn-primary" style={{ cursor: 'pointer' }}>
              Đổi ảnh đại diện
            </label>
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

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .profile-grid-skeleton { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </>
  );
};

export default Profile;
