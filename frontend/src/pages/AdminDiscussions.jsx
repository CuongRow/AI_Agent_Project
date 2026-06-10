import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserIcon, BookOpenIcon, CheckIcon } from '../components/Icons';

const AdminDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for typing replies
  const [replyContents, setReplyContents] = useState({}); // discussionId -> string
  const [submittingReply, setSubmittingReply] = useState({}); // discussionId -> boolean

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/discussions');
      // Root discussions only (parent === null). Backend might return all discussions, let's filter if necessary.
      // Looking at the response, if the backend already nests replies, we only need to show parent discussions.
      // Usually parentId is null for root discussions.
      const list = response.data || [];
      const roots = list.filter(d => d.parentId === null);
      setDiscussions(roots);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách thảo luận.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, val) => {
    setReplyContents(prev => ({ ...prev, [id]: val }));
  };

  const handleSubmitReply = async (e, discussionId) => {
    e.preventDefault();
    const content = replyContents[discussionId];
    if (!content || !content.trim()) return;

    try {
      setSubmittingReply(prev => ({ ...prev, [discussionId]: true }));
      const response = await api.post(`/api/admin/discussions/${discussionId}/reply`, {
        content: content.trim()
      });

      // Insert new reply into local state
      setDiscussions(prev => prev.map(d => {
        if (d.id === discussionId) {
          const updatedReplies = [...(d.replies || []), response.data];
          return { ...d, replies: updatedReplies };
        }
        return d;
      }));

      // Clear input field
      setReplyContents(prev => ({ ...prev, [discussionId]: '' }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || 'Gửi phản hồi thất bại.');
    } finally {
      setSubmittingReply(prev => ({ ...prev, [discussionId]: false }));
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Hỏi Đáp & Thảo Luận
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Giải đáp các thắc mắc của học viên trên toàn hệ thống bài học.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'var(--danger-light)',
          color: 'var(--danger)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          border: '1px solid rgba(239, 68, 68, 0.15)'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[1, 2].map(n => (
            <div key={n} className="card" style={{ height: '180px' }} />
          ))}
        </div>
      ) : discussions.length === 0 ? (
        <div className="card glass" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <BookOpenIcon size={36} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '12px' }} />
          <p style={{ fontWeight: 600, marginBottom: '4px' }}>Hộp thư thảo luận trống</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hiện chưa có học viên nào đặt câu hỏi thảo luận.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {discussions.map((disc) => {
            const initials = disc.username ? disc.username.charAt(0).toUpperCase() : '?';
            return (
              <div key={disc.id} className="card glass animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                {/* Discussion Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {disc.userAvatarUrl ? (
                      <img 
                        src={disc.userAvatarUrl} 
                        alt={disc.username} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}>
                        {initials}
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{disc.username}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDateTime(disc.createdAt)}</p>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: '1px solid rgba(37, 99, 235, 0.15)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <BookOpenIcon size={14} />
                    {disc.lessonTitle || 'Bài học'}
                  </span>
                </div>

                {/* Discussion Content */}
                <div style={{ 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6', 
                  color: 'var(--text-main)', 
                  backgroundColor: 'var(--background)', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--primary)'
                }}>
                  {disc.content}
                </div>

                {/* Nested Replies */}
                {disc.replies && disc.replies.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px', 
                    paddingLeft: '24px', 
                    borderLeft: '2px dashed var(--border)',
                    marginTop: '8px'
                  }}>
                    {disc.replies.map((reply) => {
                      const repInitials = reply.username ? reply.username.charAt(0).toUpperCase() : '?';
                      return (
                        <div key={reply.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {reply.userAvatarUrl ? (
                              <img 
                                src={reply.userAvatarUrl} 
                                alt={reply.username} 
                                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                              />
                            ) : (
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.75rem'
                              }}>
                                {repInitials}
                              </div>
                            )}
                            <div>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                                {reply.username} 
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                  color: 'var(--success)',
                                  padding: '1px 6px',
                                  borderRadius: '10px',
                                  marginLeft: '6px'
                                }}>
                                  Giảng viên
                                </span>
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                                {formatDateTime(reply.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: '0.9rem', 
                            lineHeight: '1.5', 
                            padding: '10px 14px', 
                            backgroundColor: 'var(--surface-hover)', 
                            borderRadius: 'var(--radius-sm)'
                          }}>
                            {reply.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Reply Form */}
                <form 
                  onSubmit={(e) => handleSubmitReply(e, disc.id)} 
                  style={{ display: 'flex', gap: '12px', marginTop: '8px' }}
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Viết phản hồi cho học viên..."
                    value={replyContents[disc.id] || ''}
                    onChange={(e) => handleReplyChange(disc.id, e.target.value)}
                    disabled={submittingReply[disc.id]}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-md)' }}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submittingReply[disc.id] || !(replyContents[disc.id] || '').trim()}
                    style={{ padding: '10px 20px', fontWeight: 600 }}
                  >
                    {submittingReply[disc.id] ? 'Đang gửi...' : 'Trả lời'}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDiscussions;
