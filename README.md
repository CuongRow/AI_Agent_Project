# Java Mastery Learning Platform 🎓

<p align="center">
  <img src="https://img.shields.io/badge/Java-17%2B-orange?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 17+">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 3">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-Fast-purple?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Docker-Supported-blue?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

Chào mừng bạn đến với **Java Mastery Learning Platform** - một nền tảng học tập trực tuyến toàn diện, hiện đại và cao cấp chuyên sâu về ngôn ngữ lập trình Java, Hướng đối tượng (OOP), Cấu trúc dữ liệu & Giải thuật (DS&A) và kỹ năng giải quyết vấn đề.

Dự án được xây dựng theo phong cách pair programming tối ưu giữa Học viên và Quản trị viên, sở hữu giao diện **Premium Glassmorphism** mượt mà, hỗ trợ cả hai chế độ **Light/Dark Mode**, tích hợp đầy đủ hệ thống API, quản lý State toàn cục, cơ chế bảo mật JWT nâng cao cùng khả năng Responsive hoàn hảo trên mọi thiết bị.

---

## 🚀 Tính Năng Nổi Bật

### 1. Phân Hệ Học Viên (Student Area)
*   **Trang cá nhân (Student Dashboard):** Lời chào mừng thời gian thực (Sáng/Chiều/Tối). Gradient Premium Banner tích hợp vòng tròn tiến độ SVG hiển thị tỷ lệ hoàn thành bài học. Các thẻ thống kê (Số bài đã học, số bài chưa học, bài viết đã lưu).
*   **Danh sách Khóa học (Courses List):** Hiển thị các khóa học lớn (Java Core, OOP, DS&A) kèm tiến độ hoàn thành chi tiết của từng khóa học dạng thẻ bài trực quan.
*   **Chi tiết Bài học (Lesson Content):** Trình đọc nội dung bài học định dạng Markdown rõ ràng, highlight cú pháp code Java chuyên nghiệp. Hỗ trợ đánh dấu "Hoàn thành bài học" (Complete) và "Lưu bài viết" (Bookmark) tức thì.
*   **Hệ thống Quiz Trắc nghiệm (Interactive Quiz):** Giao diện làm bài trắc nghiệm tương tác cao có thanh tiến độ (Progress bar) và các ô tròn điều hướng nhanh. Hỗ trợ 2 loại câu hỏi: **Single choice** (chọn 1) và **Multiple choice** (chọn nhiều đáp án có badge riêng). Trang kết quả (Scored View) cao cấp phân chia 2 trạng thái **Đạt (Passed - Xanh lá)** hoặc **Chưa Đạt (Failed - Đỏ)**. Hiển thị chi tiết đáp án đúng/sai kèm lời giải thích cặn kẽ (explanation) lấy trực tiếp từ database.
*   **Quản lý Hồ sơ & Bảo mật (User Profile):** Cập nhật Username, Email và thay đổi mật khẩu (yêu cầu mật khẩu cũ xác thực an toàn). Tự động đồng bộ hóa thông tin lên Sidebar và Header ngay sau khi cập nhật thành công.

### 2. Phân Hệ Quản Trị Viên (Admin Dashboard)
*   **Bảng số liệu thống kê (Analytics):** Trực quan hóa dữ liệu hệ thống (Tổng người dùng, Khóa học, Bài học, Quiz, Câu hỏi). Vòng tròn SVG biểu diễn tỷ lệ hoàn thành chung. Biểu đồ cột SVG (Bar Chart) tự dựng chất lượng cao hiển thị biểu diễn lượng người dùng đăng ký theo thời gian.
*   **Quản lý người dùng (Admin Users):** Danh sách người dùng tích hợp phân trang API, ô tìm kiếm thời gian thực. Bảng responsive tự động thu gọn. Nút khóa/mở khóa tài khoản (Block/Unblock) qua API tức thời. Avatar tự động lấy chữ cái đầu tiên và phối màu Gradient theo Role (Đỏ cho Admin, Xanh cho Student).
*   **Quản lý Khóa học & Bài học (Admin Courses):** CRUD Khóa học trực tiếp bằng Modal Glassmorphism. Tính năng xem chi tiết bài học (Expandable section) sử dụng Accordion mượt mà, tự động fetch danh sách bài học con và hiển thị thông tin đi kèm (bài học có quiz hay không).

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
*   **React 19** & **Vite** (Build tool siêu nhanh)
*   **React Router Dom** (Định tuyến SPA)
*   **Axios** (Giao tiếp API với Request/Response Interceptor tự động đính kèm Token & Silent Refresh Token khi gặp lỗi 401)
*   **Vanilla CSS Variables** (Quản lý màu sắc, Dark/Light Mode đồng bộ, hiệu ứng glassmorphism và micro-animations)

### Backend
*   **Spring Boot 3** & **Java 17**
*   **Spring Security** (Bảo mật phân quyền chặt chẽ: `ROLE_STUDENT`, `ROLE_ADMIN`)
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
│   │   ├── controller/        # RestController chứa các API Endpoints
│   │   ├── dto/               # Lớp DTO truyền tải dữ liệu Request/Response
│   │   ├── entity/            # Thực thể ánh xạ JPA Database Entities
│   │   ├── exception/         # Xử lý ngoại lệ tập trung (GlobalExceptionHandler)
│   │   ├── mapper/            # Ánh xạ Entity <-> DTO (MapStruct)
│   │   ├── repository/        # Các JPA Repository tương tác Database
│   │   ├── security/          # Bộ lọc JWT, Provider, UserDetails
│   │   ├── seeder/            # Tự động nạp dữ liệu từ file JSON học tập mẫu
│   │   └── service/           # Logic nghiệp vụ xử lý hệ thống
│   ├── src/main/resources/
│   │   ├── db/migration/      # Các file SQL khởi tạo database của Flyway
│   │   ├── quiz-seed-data.json# Dữ liệu khóa học, bài học và câu hỏi trắc nghiệm mẫu
│   │   └── application.yml    # Cấu hình Spring Boot và môi trường kết nối
│   └── Dockerfile             # Cấu hình Docker build đa giai đoạn cho Backend
├── frontend/                  # Source code React frontend
│   ├── src/
│   │   ├── components/        # Thư viện icon SVG dùng chung
│   │   ├── context/           # AuthContext quản lý session đăng nhập
│   │   ├── layouts/           # Giao diện khung (Public, Dashboard, Admin)
│   │   ├── pages/             # Các trang giao diện (Home, Courses, Quiz, Profile, v.v.)
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
4. Hệ thống sẽ tự động khởi chạy, Flyway sẽ tạo 10 bảng cấu trúc database, và `QuizSeeder` sẽ tự động quét file `quiz-seed-data.json` để nạp sẵn 2 Khóa học, 3 Bài học lớn cùng bộ câu hỏi trắc nghiệm cao cấp đi kèm.
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

Dự án đã được cấu hình tối ưu hóa Docker để chạy toàn bộ hệ thống (Database, API, Client Nginx) trên bất cứ môi trường nào mà không cần cài đặt JDK hay Node.js.

### Yêu Cầu
*   Đã cài đặt **Docker** và **Docker Compose** (Docker Desktop).

### Các bước thực hiện:
1. Đứng tại thư mục gốc của dự án (`d:/Java web project/`).
2. Khởi chạy lệnh Docker Compose:
   ```bash
   docker compose up --build -d
   ```
3. Hệ thống sẽ thực hiện build song song:
   - Tải image MySQL 8, thiết lập health check.
   - Biên dịch mã nguồn Java, đóng gói thành JAR siêu nhẹ.
   - Build ứng dụng React, chuyển sang Nginx đóng gói thành static container.
4. Sau khi các container hiển thị trạng thái `Running`, truy cập trực tiếp tại:
   *   **Giao diện Web App (Cổng 80):** `http://localhost`
   *   **Giao diện API Swagger (Cổng 8080):** `http://localhost:8080/swagger-ui/index.html`
5. Để dừng hệ thống và bảo toàn dữ liệu:
   ```bash
   docker compose down
   ```

---

## 🔑 Tài Khoản Đăng Nhập Mẫu (Mặc Định Sau Khi Seed)

Hệ thống đã chuẩn bị sẵn hai tài khoản mẫu tương ứng với hai vai trò khác nhau để trải nghiệm nhanh:

1.  **Tài Khoản Học Viên (Student):**
    *   **Email/Tên đăng nhập:** `student` (hoặc `student@javamastery.com`)
    *   **Mật khẩu:** `password`
    *   *Quyền hạn:* Đọc bài học, bookmark, làm bài quiz trắc nghiệm trọn vẹn, cập nhật thông tin cá nhân.
2.  **Tài Khoản Quản Trị Viên (Admin):**
    *   **Email/Tên đăng nhập:** `admin` (hoặc `admin@javamastery.com`)
    *   **Mật khẩu:** `password`
    *   *Quyền hạn:* Xem biểu đồ phân tích hệ thống, quản lý khóa học (Thêm/Sửa/Xóa), xem danh sách bài học bằng accordion, quản lý danh sách người dùng (Block/Unblock tài khoản).

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
| **Học Tập (Student)**| `GET` | `/api/student/dashboard`| `ROLE_STUDENT` | Lấy số liệu tiến trình học tập cá nhân |
| | `POST` | `/api/student/lessons/{id}/complete` | `ROLE_STUDENT` | Đánh dấu bài học đã hoàn thành |
| | `DELETE`| `/api/student/lessons/{id}/complete` | `ROLE_STUDENT` | Hủy đánh dấu bài học hoàn thành |
| | `POST` | `/api/student/lessons/{id}/bookmark` | `ROLE_STUDENT` | Toggle bookmark lưu trữ bài học |
| **Khóa Học** | `GET` | `/api/courses` | Tự do | Xem danh sách các khóa học hiện tại |
| | `GET` | `/api/courses/{id}/lessons` | Tự do | Xem danh sách bài học thuộc khóa học |
| **Quiz** | `GET` | `/api/lessons/{id}/quizzes` | Đã đăng nhập | Lấy danh sách quiz tương ứng của bài học |
| | `POST` | `/api/quizzes/{id}/submit` | `ROLE_STUDENT` | Nộp bài làm trắc nghiệm & Tính điểm chi tiết |
| **Quản Trị (Admin)** | `GET` | `/api/admin/analytics` | `ROLE_ADMIN` | Lấy dữ liệu analytics & dữ liệu biểu đồ |
| | `GET` | `/api/admin/users` | `ROLE_ADMIN` | Xem danh sách người dùng phân trang |
| | `PUT` | `/api/admin/users/{id}/toggle-enabled` | `ROLE_ADMIN` | Kích hoạt hoặc khóa (Block) tài khoản |
| | `POST` | `/api/courses` | `ROLE_ADMIN` | Tạo khóa học mới |
| | `PUT` | `/api/courses/{id}` | `ROLE_ADMIN` | Cập nhật thông tin khóa học |
| | `DELETE`| `/api/courses/{id}` | `ROLE_ADMIN` | Xóa khóa học khỏi hệ thống |

---

## 🛠️ Quy Tắc Phát Triển Hệ Thống (Development Guidelines)

Để đảm bảo hệ thống chạy trơn tru, luôn duy trì cấu trúc chuẩn và ổn định, hãy tuân thủ các quy tắc sau:
1.  **Kiến trúc sạch (Clean Architecture):** Tách biệt rõ ràng tầng Controller (Nhận request/valid), Service (Xử lý nghiệp vụ logic, transactions) và Repository (JPA Database interface).
2.  **Mẫu DTO (DTO Pattern):** Không bao giờ trả trực tiếp Entity Database về Client. Luôn ánh xạ qua lớp Response DTO thông qua MapStruct để bảo vệ dữ liệu và tối ưu băng thông.
3.  **Xử lý lỗi tập trung:** Mọi lỗi nghiệp vụ đều được xử lý bằng các custom Exception (`BadRequestException`, `ResourceNotFoundException`) kế thừa RuntimeException và bắt tập trung tại `GlobalExceptionHandler.java`.
4.  **Bảo mật dữ liệu:** Mật khẩu người dùng bắt buộc mã hóa thông qua `BCryptPasswordEncoder` trước khi lưu vào database.
