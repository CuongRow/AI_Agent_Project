# Java Mastery Learning Platform 🎓

<p align="center">
  <img src="https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17+">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 3">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-Fast-purple?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Docker-Supported-blue?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

Chào mừng bạn đến với **Java Mastery Learning Platform** - một nền tảng học tập trực tuyến toàn diện, hiện đại và cao cấp chuyên sâu về ngôn ngữ lập trình Java, Hướng đối tượng (OOP), Cấu trúc dữ liệu & Giải thuật (DS&A) và kỹ năng giải quyết vấn đề.

Dự án được xây dựng theo phong cách pair programming tối ưu giữa Học viên, Giảng viên và Quản trị viên, sở hữu giao diện **Premium Glassmorphism** mượt mà, hỗ trợ cả hai chế độ **Light/Dark Mode**, tích hợp đầy đủ hệ thống API, quản lý State toàn cục, cơ chế bảo mật JWT nâng cao cùng khả năng Responsive hoàn hảo trên mọi thiết bị.

---

## 🚀 Tính Năng Nổi Bật

### 1. Phân Hệ Học Viên (Student Area)
*   **Trang cá nhân (Student Dashboard):** Lời chào mừng thời gian thực (Sáng/Chiều/Tối). Gradient Premium Banner tích hợp vòng tròn tiến độ SVG hiển thị tỷ lệ hoàn thành bài học. Các thẻ thống kê (Số bài đã học, số bài chưa học, bài viết đã lưu).
*   **Danh sách Khóa học (Courses List):** Hiển thị các khóa học lớn (Java Core, OOP, DS&A) kèm tiến độ hoàn thành chi tiết của từng khóa học dạng thẻ bài trực quan.
*   **Chi tiết Bài học (Lesson Content):** Trình đọc nội dung bài học định dạng Markdown rõ ràng, highlight cú pháp code Java chuyên nghiệp. Hỗ trợ đánh dấu "Hoàn thành bài học" (Complete) và "Lưu bài viết" (Bookmark) tức thì.
*   **Hệ thống Quiz Trắc nghiệm (Interactive Quiz):** Giao diện làm bài trắc nghiệm tương tác cao có thanh tiến độ (Progress bar) và các ô tròn điều hướng nhanh. Hỗ trợ 2 loại câu hỏi: **Single choice** (chọn 1) và **Multiple choice** (chọn nhiều đáp án có badge riêng). Trang kết quả (Scored View) cao cấp phân chia 2 trạng thái **Đạt (Passed - Xanh lá)** hoặc **Chưa Đạt (Failed - Đỏ)**. Hiển thị chi tiết đáp án đúng/sai kèm lời giải thích cặn kẽ (explanation) lấy trực tiếp từ database.
*   **Hỏi đáp & Thảo luận (Discussion Forum):** Tích hợp khung thảo luận ở cuối mỗi bài học. Học viên có thể gửi câu hỏi, thắc mắc, xem các thảo luận khác và nhận câu trả lời phản hồi từ Giảng viên hoặc Admin.
*   **Quản lý Hồ sơ & Bảo mật (User Profile):** Cập nhật Username, Email và thay đổi mật khẩu (yêu cầu mật khẩu cũ xác thực an toàn, hỗ trợ nút **Hiện/Ẩn mật khẩu** bằng icon Con mắt và kiểm tra khớp mật khẩu thời gian thực). Tự động đồng bộ hóa thông tin lên Sidebar và Header ngay sau khi cập nhật thành công qua AuthContext.
*   **Tải lên Ảnh đại diện (Avatar Upload):** Cho phép tải ảnh trực tiếp từ máy tính (< 5MB, hỗ trợ JPEG/PNG/GIF/WEBP). Ảnh cũ trên server được tự động xóa để giải phóng dung lượng. Avatar mới đồng bộ tức thời trên Header/Sidebar mà không cần tải lại trang.
*   **Cài đặt hệ thống (System Settings):** Tích hợp công tắc chuyển đổi giao diện sáng/tối dạng dọc (**Vertical Theme Toggle Switch** rộng 50px × cao 90px) cực kỳ premium, có thanh trượt chuyển động mượt mà và icon Mặt trời/Mặt trăng sắc nét.

### 2. Phân Hệ Giảng Viên (Instructor Area)
*   **Trang Quản lý Khóa học (Courses Management):** Giao diện xem danh sách các khóa học. Giảng viên có quyền xem danh sách bài học bằng Accordion mượt mà, thực hiện CRUD bài học (Thêm/Sửa/Xóa bài học con).
*   **Tải lên Video & Tài liệu học tập:** Tính năng Upload file vật lý (lưu tại `uploads/materials/`). Hệ thống tự động phát hiện định dạng file (ví dụ `.mp4` sẽ tạo thẻ `<video controls>`, các file tài liệu khác sẽ tạo link markdown) để chèn nhanh vào nội dung bài học Markdown.
*   **Trình soạn thảo Quiz (Quiz Editor):** Giao diện trực quan cho phép Giảng viên tạo mới hoặc cập nhật bộ câu hỏi trắc nghiệm ngay trong bài học. Hỗ trợ thêm/xóa câu hỏi, đổi loại câu hỏi (Single/Multiple Choice), soạn đáp án và chọn đáp án đúng kèm lời giải thích chi tiết. Có validation kiểm tra dữ liệu đầu vào.
*   **Quản lý Thảo luận (Discussion Admin):** Trang `AdminDiscussions` lọc toàn bộ câu hỏi thảo luận mới nhất trên hệ thống, cho phép Giảng viên nhấp chọn và phản hồi giải đáp trực tiếp cho học viên.
*   **Theo dõi Tiến độ & Bảng điểm (Grades & Progress):** Trang `AdminGrades` trực quan hóa danh sách học viên kèm theo số bài đã học, điểm quiz trung bình và lịch sử làm bài chi tiết của từng người.

### 3. Phân Hệ Quản Trị Viên (Admin Area)
*   **Bảng số liệu thống kê (Analytics):** Trực quan hóa dữ liệu hệ thống (Tổng người dùng, Khóa học, Bài học, Quiz, Câu hỏi). Tích hợp biểu đồ cột **Highcharts** chất lượng cao hiển thị lượng người dùng đăng ký mới theo thời gian thực.
*   **Quản lý người dùng (User Management):** Bảng responsive hỗ trợ lọc theo 3 tab chính: **"Tất cả"**, **"Đang hoạt động"**, **"Đã khóa"** giúp dễ dàng khóa (Block) hoặc mở khóa (Unblock) tài khoản tức thời.
*   **Quản lý Khóa học:** Admin có toàn quyền tạo mới, cập nhật hoặc xóa bỏ khóa học khỏi hệ thống (với yêu cầu kiểm tra mô tả khóa học phải đạt tối thiểu 200 từ và xem trước ảnh preview tỉ lệ 16:9).
*   **Quản lý Học viên lười học (Inactive Students):** Tab thứ 4 "Học viên không hoạt động" hiển thị danh sách học viên không đăng nhập hoặc tương tác > 15 ngày. Admin có thể bấm nút gửi email nhắc nhở thủ công qua dịch vụ giả lập email (`EmailService`).
*   **Hệ thống Nhắc nhở Tự động (Daily Cron Job):** Scheduler chạy nền hàng ngày (`InactiveStudentScheduler` chạy lúc 1:00 AM) tự động quét và gửi email thúc giục học tập cho tất cả học viên không hoạt động trên 15 ngày.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
*   **React 19** & **Vite** (Build tool siêu tốc)
*   **React Router Dom** (Định tuyến SPA)
*   **Axios** (Giao tiếp API với Request/Response Interceptor tự động đính kèm Token & Silent Refresh Token khi gặp lỗi 401)
*   **Highcharts** (Vẽ biểu đồ phân tích thống kê đăng ký theo thời gian trực quan)
*   **Vanilla CSS Variables** (Quản lý màu sắc, Dark/Light Mode đồng bộ, hiệu ứng glassmorphism và micro-animations)

### Backend
*   **Spring Boot 3** & **Java 17**
*   **Spring Security** (Bảo mật phân quyền chặt chẽ với 3 vai trò: `ROLE_STUDENT`, `ROLE_INSTRUCTOR`, `ROLE_ADMIN`)
*   **Plain Text Password (NoOpPasswordEncoder):** Lưu trữ và xác thực mật khẩu dạng thô (không mã hóa BCrypt) giúp tối ưu cho quá trình kiểm thử nhanh và kiểm soát dữ liệu trong môi trường Dev/Test.
*   **JWT (JSON Web Token)** (Access Token 15 phút, Refresh Token 7 ngày lưu trữ an toàn)
*   **Spring Data JPA** & **Hibernate**
*   **MySQL 8.0** (Database môi trường Dev/Prod)
*   **H2 Database** (Môi trường kiểm thử tự động)
*   **Flyway Migration** (Quản lý và tự động chạy script cấu trúc database)
*   **MapStruct** & **Lombok** (Tự động ánh xạ Entity <-> DTO và giảm thiểu code thừa)

---

## 📁 Cấu Trúc Dự Án

```
d:/Java web project/
├── backend/                   # Source code backend Spring Boot 3
│   ├── src/main/java/com/javamastery/
│   │   ├── config/            # Cấu hình Security, CORS, Audit, WebMvc
│   │   ├── controller/        # RestController chứa các API Endpoints (Admin, Course, Discussion, Quiz, User, v.v.)
│   │   ├── dto/               # Lớp DTO truyền tải dữ liệu Request/Response (StudentProgress, Discussion, Quiz, v.v.)
│   │   ├── entity/            # Thực thể ánh xạ JPA Database Entities (User, Discussion, Course, Quiz, v.v.)
│   │   ├── exception/         # Xử lý ngoại lệ tập trung (GlobalExceptionHandler)
│   │   ├── mapper/            # Ánh xạ Entity <-> DTO (MapStruct)
│   │   ├── repository/        # Các JPA Repository tương tác Database
│   │   ├── scheduler/         # InactiveStudentScheduler quét học viên lười học tự động
│   │   ├── security/          # Bộ lọc JWT, Provider, UserDetails, LastActiveFilter (ghi nhận hoạt động)
│   │   ├── seeder/            # Tự động nạp dữ liệu từ file JSON học tập mẫu
│   │   └── service/           # Logic nghiệp vụ xử lý hệ thống (Auth, Admin, Discussion, QuizAdmin, Email, v.v.)
│   ├── src/main/resources/
│   │   ├── db/migration/      # Các file SQL khởi tạo và cập nhật database của Flyway (V1 đến V6)
│   │   ├── quiz-seed-data.json# Dữ liệu khóa học, bài học và câu hỏi trắc nghiệm mẫu
│   │   └── application.yml    # Cấu hình Spring Boot và môi trường kết nối
│   └── Dockerfile             # Cấu hình Docker build đa giai đoạn cho Backend
├── frontend/                  # Source code React frontend
│   ├── src/
│   │   ├── components/        # Thư viện icon SVG, ThemeToggleSwitch dùng chung
│   │   ├── context/           # AuthContext quản lý session đăng nhập
│   │   ├── hooks/             # Custom hooks (useCourses, useLessons)
│   │   ├── layouts/           # Giao diện khung (Public, Dashboard, Admin Layout)
│   │   ├── pages/             # Các trang giao diện (Home, Courses, Quiz, Profile, Admin Dashboard, AdminGrades, AdminDiscussions, v.v.)
│   │   ├── services/          # Cấu hình Axios instance & Interceptors
│   │   ├── App.jsx            # Cấu hình Router, Guards phân quyền
│   │   └── index.css          # Hệ thống Design System, Dark Mode và Utility CSS
│   ├── nginx.conf             # Cấu hình Nginx reverse proxy trong môi trường production
│   └── Dockerfile             # Cấu hình Docker build đa giai đoạn cho Frontend
├── .github/workflows/         # Thư mục cấu hình tích hợp liên tục (CI Pipeline)
│   └── ci.yml                 # Pipeline tự động biên dịch, test backend và build frontend
├── docker-compose.yml         # File điều phối chạy nhanh toàn bộ dự án qua Container
└── README.md                  # Hướng dẫn sử dụng chi tiết này
```

---

## 💻 Hướng Dẫn Chạy Dự Án Thủ Công (Local Development)

### Yêu Cầu Hệ Thống
*   Java Development Kit (JDK) 17 hoặc cao hơn.
*   Node.js phiên bản 20 hoặc cao hơn.
*   Cơ sở dữ liệu MySQL 8.0 đang hoạt động.

### Bước 1: Khởi Tạo Cơ Sở Dữ Liệu MySQL
1. Khởi chạy MySQL Server và đăng nhập bằng tài khoản Admin.
2. Tạo một database trống tên là `javamastery`:
   ```sql
   CREATE DATABASE javamastery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Bước 2: Chạy Backend (Spring Boot)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Mở file `src/main/resources/application.yml` và cấu hình lại thông số kết nối Database (nếu username/password MySQL của bạn khác `root`):
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/javamastery?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
       username: <your-username>
       password: <your-password>
   ```
3. Khởi chạy Backend bằng Maven Wrapper:
   - Trên Windows:
     ```bash
     .\mvnw spring-boot:run
     ```
   - Trên macOS/Linux:
     ```bash
     chmod +x mvnw
     ./mvnw spring-boot:run
     ```
4. Hệ thống sẽ tự động khởi chạy, Flyway sẽ tạo và di trú cấu trúc bảng database (V1 -> V6), và `QuizSeeder` sẽ tự động quét file `quiz-seed-data.json` để nạp sẵn dữ liệu ban đầu.
5. Cổng chạy mặc định của Backend: `http://localhost:8080`
6. Tài liệu API Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Bước 3: Chạy Frontend (React)
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các gói thư viện dependencies (dùng cờ `--legacy-peer-deps` để tránh xung đột React 19):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Khởi chạy môi trường phát triển (Vite Dev Server):
   ```bash
   npm run dev
   ```
4. Truy cập giao diện ứng dụng tại: `http://localhost:5173`

---

## 🐳 Hướng Dẫn Chạy Bằng Docker Compose (Chỉ với 1 dòng lệnh)

Dự án đã được cấu hình tối ưu hóa Docker để chạy toàn bộ hệ thống (Database, API, Client Nginx, uploads folder) trên bất cứ môi trường nào mà không cần cài đặt JDK hay Node.js.

### Yêu Cầu
*   Đã cài đặt **Docker** và **Docker Compose** (Docker Desktop).

### Các bước thực hiện:
1. Đứng tại thư mục gốc của dự án (`d:/Java web project/`).
2. Khởi chạy lệnh Docker Compose:
   ```bash
   docker compose up --build -d
   ```
3. Hệ thống sẽ thực hiện build song song và khởi động các container.
4. Sau khi các container hiển thị trạng thái `Running`, truy cập trực tiếp tại:
   *   **Giao diện Web App (Cổng 80):** `http://localhost`
   *   **Giao diện API Swagger (Cổng 8080):** `http://localhost:8080/swagger-ui/index.html`
5. Để dừng hệ thống và bảo toàn dữ liệu:
   ```bash
   docker compose down
   ```

---

## 🔑 Tài Khoản Đăng Nhập Mẫu (Mặc Định Sau Khi Seed)

Hệ thống đã chuẩn bị sẵn ba tài khoản mẫu tương ứng với ba vai trò khác nhau với mật khẩu dạng plain text để trải nghiệm nhanh:

1.  **Tài Khoản Học Viên (Student):**
    *   **Email/Tên đăng nhập:** `student` (hoặc `student@javamastery.com`)
    *   **Mật khẩu:** `student123`
    *   *Quyền hạn:* Đọc bài học, bookmark, làm quiz trắc nghiệm, cập nhật thông tin cá nhân, thay đổi theme, tải lên avatar từ máy tính, thảo luận/hỏi đáp dưới bài học.
2.  **Tài Khoản Giảng Viên (Instructor):**
    *   **Email/Tên đăng nhập:** `instructor` (hoặc `instructor@javamastery.com`)
    *   **Mật khẩu:** `instructor123`
    *   *Quyền hạn:* CRUD bài học, tải lên video/tài liệu bài học, thiết lập bộ câu hỏi Quiz trắc nghiệm, xem tiến độ & điểm số của học viên, trả lời thảo luận Q&A.
3.  **Tài Khoản Quản Trị Viên (Admin):**
    *   **Email/Tên đăng nhập:** `admin` (hoặc `admin@javamastery.com`)
    *   **Mật khẩu:** `admin123`
    *   *Quyền hạn:* Toàn quyền hệ thống, xem biểu đồ phân tích Highcharts, quản lý người dùng (Block/Unblock), tạo/xóa khóa học, theo dõi học viên không hoạt động và gửi email nhắc nhở thúc giục học tập.

---

## 📡 Danh Sách Các API Endpoints Chính

| Phân Hệ | Phương Thức | Endpoint | Quyền Truy Cập | Mô Tả |
| :--- | :--- | :--- | :--- | :--- |
| **Xác thực (Auth)** | `POST` | `/api/auth/register` | Tự do | Đăng ký tài khoản học viên mới |
| | `POST` | `/api/auth/login` | Tự do | Đăng nhập hệ thống (Cấp Access & Refresh Token) |
| | `POST` | `/api/auth/refresh` | Tự do | Silent Refresh Token khi Access Token hết hạn |
| | `POST` | `/api/auth/logout` | Đã đăng nhập | Đăng xuất hệ thống, hủy Refresh Token |
| **Hồ Sơ (User)** | `GET` | `/api/users/profile` | Đã đăng nhập | Lấy thông tin chi tiết hồ sơ cá nhân hiện tại |
| | `PUT` | `/api/users/profile` | Đã đăng nhập | Cập nhật hồ sơ & Thay đổi mật khẩu an toàn |
| | `POST` | `/api/users/profile/avatar` | Đã đăng nhập | Tải lên ảnh đại diện mới từ thiết bị |
| **Hỏi đáp (Discussion)** | `GET` | `/api/lessons/{lessonId}/discussions` | Đã đăng nhập | Lấy danh sách thảo luận của bài học |
| | `POST` | `/api/lessons/{lessonId}/discussions` | Đã đăng nhập | Gửi thảo luận/hỏi đáp mới trong bài học |
| | `GET` | `/api/admin/discussions` | Giảng viên/Admin | Xem danh sách thảo luận trên toàn hệ thống |
| | `POST` | `/api/admin/discussions/{id}/reply` | Giảng viên/Admin | Trả lời thảo luận của học viên |
| **Học Tập (Student)**| `GET` | `/api/student/dashboard`| `ROLE_STUDENT` | Lấy số liệu tiến trình học tập cá nhân |
| | `POST` | `/api/student/lessons/{id}/complete` | `ROLE_STUDENT` | Đánh dấu bài học đã hoàn thành |
| | `DELETE`| `/api/student/lessons/{id}/complete` | `ROLE_STUDENT` | Hủy đánh dấu bài học hoàn thành |
| | `POST` | `/api/student/lessons/{id}/bookmark` | `ROLE_STUDENT` | Toggle bookmark lưu trữ bài học |
| **Khóa Học (Course)** | `GET` | `/api/courses` | Tự do | Xem danh sách các khóa học hiện tại |
| | `GET` | `/api/courses/{id}/lessons` | Tự do | Xem danh sách bài học thuộc khóa học |
| | `POST` | `/api/admin/courses` | `ROLE_ADMIN` | Tạo khóa học mới (chỉ Admin) |
| | `PUT` | `/api/admin/courses/{id}` | `ROLE_ADMIN` | Cập nhật thông tin khóa học (chỉ Admin) |
| | `DELETE`| `/api/admin/courses/{id}` | `ROLE_ADMIN` | Xóa khóa học khỏi hệ thống (chỉ Admin) |
| **Bài Học Admin** | `POST` | `/api/admin/courses/{courseId}/lessons` | Giảng viên/Admin | Tạo bài học mới trong khóa học |
| | `PUT` | `/api/admin/lessons/{lessonId}` | Giảng viên/Admin | Cập nhật thông tin bài học |
| | `DELETE`| `/api/admin/lessons/{lessonId}` | Giảng viên/Admin | Xóa bài học |
| | `POST` | `/api/admin/lessons/upload` | Giảng viên/Admin | Tải lên video/tài liệu đính kèm bài học |
| **Quiz** | `GET` | `/api/lessons/{id}/quizzes` | Đã đăng nhập | Lấy danh sách quiz tương ứng của bài học (Student) |
| | `POST` | `/api/quizzes/{id}/submit` | `ROLE_STUDENT` | Nộp bài làm trắc nghiệm & Tính điểm chi tiết |
| | `GET` | `/api/admin/lessons/{lessonId}/quiz` | Giảng viên/Admin | Lấy chi tiết Quiz để sửa đổi |
| | `POST` | `/api/admin/lessons/{lessonId}/quiz` | Giảng viên/Admin | Lưu bộ câu hỏi trắc nghiệm của bài học |
| | `DELETE`| `/api/admin/quizzes/{quizId}` | Giảng viên/Admin | Xóa bộ câu hỏi Quiz |
| **Quản Trị (Admin)** | `GET` | `/api/admin/analytics` | `ROLE_ADMIN` | Lấy dữ liệu analytics & dữ liệu biểu đồ |
| | `GET` | `/api/admin/users` | `ROLE_ADMIN` | Xem danh sách người dùng phân trang (hỗ trợ lọc status) |
| | `PUT` | `/api/admin/users/{id}/toggle-enabled` | `ROLE_ADMIN` | Kích hoạt hoặc khóa (Block) tài khoản |
| | `GET` | `/api/admin/inactive-students` | `ROLE_ADMIN` | Xem danh sách học viên lười học (>15 ngày) |
| | `POST` | `/api/admin/inactive-students/{id}/remind` | `ROLE_ADMIN` | Gửi email nhắc nhở học viên thủ công |
| | `GET` | `/api/admin/students/progress` | Giảng viên/Admin | Xem bảng tiến độ học tập và điểm số học viên |

---

## 🛠️ Quy Tắc Phát Triển Hệ Thống (Development Guidelines)

Để đảm bảo hệ thống chạy trơn tru, luôn duy trì cấu trúc chuẩn và ổn định, hãy tuân thủ các quy tắc sau:
1.  **Kiến trúc sạch (Clean Architecture):** Tách biệt rõ ràng tầng Controller (Nhận request/valid), Service (Xử lý nghiệp vụ logic, transactions) và Repository (JPA Database interface).
2.  **Mẫu DTO (DTO Pattern):** Không bao giờ trả trực tiếp Entity Database về Client. Luôn ánh xạ qua lớp Response DTO thông qua MapStruct để bảo vệ dữ liệu và tối ưu băng thông.
3.  **Xử lý lỗi tập trung:** Mọi lỗi nghiệp vụ đều được xử lý bằng các custom Exception (`BadRequestException`, `ResourceNotFoundException`) kế thừa RuntimeException và bắt tập trung tại `GlobalExceptionHandler.java`.
4.  **Xác thực mật khẩu:** Hệ thống sử dụng cơ chế mật khẩu thô dạng chuỗi đơn giản (`NoOpPasswordEncoder`) trong môi trường phát triển này để thuận tiện cho việc kiểm thử và theo dõi dữ liệu database trực tiếp.
5.  **Dọn dẹp tài nguyên:** Khi cập nhật ảnh đại diện của người dùng hoặc xóa tài liệu, hãy đảm bảo các file vật lý cũ tương ứng trên ổ cứng cũng được xóa để tránh lãng phí dung lượng lưu trữ của máy chủ.
