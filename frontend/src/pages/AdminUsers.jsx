import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  UserIcon,
  SearchIcon,
  LockIcon,
  UnlockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../components/Icons';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/users?page=${page}&size=${pageSize}`);
      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnabled = async (userId) => {
    try {
      setTogglingUserId(userId);
      await api.post(`/api/admin/users/${userId}/toggle-enabled`);
      // Update local state
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, enabled: !u.enabled } : u
      ));
    } catch (err) {
      console.error(err);
      alert('Không thể cập nhật trạng thái người dùng.');
    } finally {
      setTogglingUserId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Quản Lý Người Dùng
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Tổng cộng <strong>{totalElements}</strong> người dùng trên hệ thống.
          </p>
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <SearchIcon size={18} />
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)'
            }}>
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '16px', width: '30%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '12px', width: '50%' }} />
              </div>
              <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: 'var(--radius-sm)' }} />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <UserIcon size={36} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '12px' }} />
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>Không tìm thấy người dùng</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Thử tìm kiếm với từ khóa khác.</p>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.5fr 1fr 0.8fr 0.8fr',
              gap: '12px',
              padding: '14px 24px',
              backgroundColor: 'var(--surface-hover)',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }} className="users-table-header">
              <span>Tên người dùng</span>
              <span>Email</span>
              <span>Vai trò</span>
              <span>Ngày tạo</span>
              <span style={{ textAlign: 'center' }}>Trạng thái</span>
            </div>

            {/* Table Rows */}
            {filteredUsers.map((u) => {
              const isAdmin = u.roles && u.roles.includes('ROLE_ADMIN');
              const initials = u.username ? u.username.charAt(0).toUpperCase() : '?';

              return (
                <div
                  key={u.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.5fr 1fr 0.8fr 0.8fr',
                    gap: '12px',
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  className="users-table-row"
                >
                  {/* Username with avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isAdmin
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}>
                      {initials}
                    </div>
                    <span style={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {u.username}
                    </span>
                  </div>

                  {/* Email */}
                  <span style={{
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {u.email}
                  </span>

                  {/* Role badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {u.roles && u.roles.map(role => (
                      <span key={role} style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: role === 'ROLE_ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-light)',
                        color: role === 'ROLE_ADMIN' ? 'var(--danger)' : 'var(--primary)',
                      }}>
                        {role === 'ROLE_ADMIN' ? 'Admin' : 'Học viên'}
                      </span>
                    ))}
                  </div>

                  {/* Created date */}
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {formatDate(u.createdAt)}
                  </span>

                  {/* Toggle enabled */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleToggleEnabled(u.id)}
                      disabled={togglingUserId === u.id || isAdmin}
                      title={isAdmin ? 'Không thể vô hiệu hóa Admin' : (u.enabled ? 'Khóa tài khoản' : 'Mở khóa tài khoản')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid',
                        cursor: isAdmin ? 'not-allowed' : 'pointer',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        transition: 'all var(--transition-fast)',
                        backgroundColor: u.enabled ? 'var(--success-light)' : 'var(--danger-light)',
                        borderColor: u.enabled ? 'var(--success)' : 'var(--danger)',
                        color: u.enabled ? 'var(--success)' : 'var(--danger)',
                        opacity: isAdmin ? 0.4 : 1,
                      }}
                    >
                      {u.enabled ? <UnlockIcon size={14} /> : <LockIcon size={14} />}
                      <span className="toggle-label">{u.enabled ? 'Hoạt động' : 'Đã khóa'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              marginTop: '28px',
            }}>
              <button
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="btn btn-outline"
                style={{ padding: '8px 14px', opacity: page === 0 ? 0.4 : 1 }}
              >
                <ChevronLeftIcon size={16} />
              </button>

              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: i === page ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: i === page ? 'var(--primary-light)' : 'transparent',
                      color: i === page ? 'var(--primary)' : 'var(--text-main)',
                      cursor: 'pointer',
                      fontWeight: i === page ? 700 : 500,
                      fontSize: '0.85rem',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={page >= totalPages - 1}
                className="btn btn-outline"
                style={{ padding: '8px 14px', opacity: page >= totalPages - 1 ? 0.4 : 1 }}
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Responsive table styles */}
      <style>{`
        .users-table-row:hover {
          background-color: var(--surface-hover);
        }
        @media (max-width: 768px) {
          .users-table-header,
          .users-table-row {
            grid-template-columns: 1fr 1fr !important;
          }
          .users-table-header span:nth-child(n+3),
          .users-table-row > *:nth-child(n+3) {
            display: none !important;
          }
          .toggle-label {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;
