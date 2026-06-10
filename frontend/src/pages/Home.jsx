import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AcademicCapIcon, BookOpenIcon, CheckIcon } from '../components/Icons';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  
  const pathCards = [
    {
      title: 'Java Basics & Core',
      desc: 'Học cú pháp Java cơ bản, biến, kiểu dữ liệu, các vòng lặp, mảng và lập trình hàm cơ bản.',
      lessons: '10 bài học',
      difficulty: 'Cơ bản',
      color: '#3b82f6',
    },
    {
      title: 'Lập trình hướng đối tượng (OOP)',
      desc: 'Làm chủ 4 tính chất OOP: Đóng gói, Kế thừa, Đa hình, Trừu tượng. Tìm hiểu Interfaces, Abstract classes.',
      lessons: '8 bài học',
      difficulty: 'Trung bình',
      color: '#10b981',
    },
    {
      title: 'Cấu trúc dữ liệu & Giải thuật',
      desc: 'Cài đặt và tối ưu hóa LinkedList, Tree, Stack, Queue và các thuật toán tìm kiếm, sắp xếp phổ biến.',
      lessons: '12 bài học',
      difficulty: 'Nâng cao',
      color: '#f59e0b',
    }
  ];

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '120px 24px 100px 24px',
        backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.9)), url(/sean-fahrenbruch-kxL6jPPNEWc-unsplash.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            backgroundColor: 'var(--primary-light)',
            padding: '6px 16px',
            borderRadius: '100px',
            display: 'inline-block',
            marginBottom: '24px'
          }}>
            Làm chủ ngôn ngữ Java từ số 0
          </span>
          
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Học Java Thông Minh & <span style={{
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Hiệu Quả Hơn</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Học lý thuyết tương tác kết hợp làm bài trắc nghiệm thực tế. Theo dõi tiến trình, lưu trữ bài giảng và nâng cao tư duy giải thuật cùng Java Mastery.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to={user?.roles?.includes('ROLE_ADMIN') ? "/admin" : "/dashboard"} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem', boxShadow: '0 10px 15px -3px var(--primary-glow)' }}>
                Vào Dashboard Học Tập
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem', boxShadow: '0 10px 15px -3px var(--primary-glow)' }}>
                  Bắt đầu ngay miễn phí
                </Link>
                <Link to="/login" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
                  Xem thử bài học
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Path Cards Section */}
      <section style={{ maxWidth: '1200px', margin: '80px auto 0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, marginBottom: '16px' }}>
            Lộ trình học tập chuẩn mực
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Được thiết kế đi từ lý thuyết nền tảng đến các cấu trúc dữ liệu phức tạp nhất trong Java.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {pathCards.map((card, i) => (
            <div key={i} className="card interactive" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Colored top bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: card.color
              }}></div>

              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--background)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  color: card.color,
                  display: 'inline-block',
                  marginBottom: '16px'
                }}>
                  {card.difficulty}
                </span>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
                  {card.title}
                </h3>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {card.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpenIcon size={16} />
                  {card.lessons}
                </span>
                
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  Khám phá &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        maxWidth: '1200px',
        margin: '100px auto 0 auto',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          backgroundColor: 'var(--surface)',
          padding: '60px 40px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>
              Tại sao chọn JavaMastery?
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Chúng tôi kết hợp trải nghiệm lý thuyết tinh gọn và đánh giá chất lượng qua bộ câu hỏi được biên soạn chi tiết.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckIcon size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Chấm điểm tự động</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Thuật toán chấm điểm tức thì. Hiển thị lời giải và kiến thức liên quan ngay lập tức.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckIcon size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Theo dõi tiến độ</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Xem thanh phần trăm tiến trình hoàn thành của từng khóa học, ghi nhận lịch sử và bookmark bài học yêu thích.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
