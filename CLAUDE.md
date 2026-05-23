# Fibo - Website Bán Khóa Học Trading

## Tổng quan dự án
Website bán khóa học trading online, thiết kế dark theme futuristic (tham khảo NFT Marketplace), có scroll animation, thanh toán tự động qua chuyển khoản ngân hàng VN.

## Tech Stack
- **Frontend**: Vanilla HTML/CSS/JS (không dùng framework React/Vue)
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **Payment**: SePay (VietQR chuyển khoản)
- **Email**: Resend (transactional email)
- **Hosting**: Vercel
- **Fonts**: Exo 2 (headings) + Be Vietnam Pro (body)

## Cấu trúc thư mục
```
├── index.html              (Landing page chính)
├── firebase.js             (Firebase SDK config)
├── vercel.json             (Vercel deploy config)
├── prepare-public.js       (Build script cho Vercel)
├── CLAUDE.md
├── .gitignore
├── css/
│   └── style.css           (Global styles + design system)
├── js/
│   ├── cart-badge.js       (Giỏ hàng - IIFE, không module)
│   ├── firestore-sync.js   (Data layer + cache)
│   ├── analytics.js        (Page view tracking)
│   └── animations.js       (Scroll animations)
├── api/
│   ├── firebase-admin.js   (Admin SDK shared)
│   ├── checkout.js         (Tạo order)
│   ├── email/
│   │   └── send.js         (Gửi email qua Resend)
│   └── seapay/
│       ├── webhook.js      (Nhận callback từ SePay)
│       └── status.js       (Poll trạng thái thanh toán)
├── pages/
│   ├── courses.html        (Danh sách khóa học)
│   ├── course-detail.html  (Chi tiết khóa học)
│   ├── cart.html           (Giỏ hàng)
│   ├── checkout.html       (Thanh toán)
│   ├── thank-you.html      (Cảm ơn + download)
│   └── admin.html          (Admin dashboard)
├── product/                (Ảnh khóa học)
└── Skill/                  (Tài liệu skill reference)
```

## Design System

### Màu sắc (Dark Navy-Black + Minimal Accent — NFT Marketplace Style)
```css
--bg: #0B0B14;            /* Gần đen, hint xanh rất nhẹ */
--bg-2: #101019;
--bg-3: #15151F;
--bg-4: #1A1A26;
--border: rgba(255,255,255,.05);   /* Border gần invisible */
--accent: #C8F560;        /* Yellow-green, dùng RẤT ÍT (dots, labels) */
--accent-2: #7BF5A0;
--text: #FFFFFF;           /* Chữ chính: trắng */
--text-2: #8B8BA8;         /* Body text: xám nhạt */
--text-3: #55556E;
```

### Nguyên tắc thiết kế
- Background: dark navy (#0D0D2B), KHÔNG đen xì
- Chữ: 90% trắng (#fff), body text xám nhạt
- Accent (neon green): dùng CỰC KỲ ÍT — chỉ cho dots nhỏ, section labels, badge nhỏ
- Buttons chính: NỀN TRẮNG, chữ tối (không phải neon)
- Cards: nền semi-transparent, border cực subtle (rgba white 6%)
- Tổng thể: ultra clean, minimal, premium, ít glow, ít màu
- Glassmorphism: backdrop-filter blur 16px, border-radius 24px
- Hero: 2 cột (text trái + card phải), chữ trắng lớn bold
- Scroll animations nhẹ nhàng (fade-in, slide-up)
- Mobile-first responsive
- Không emoji, dùng SVG icons stroke style
- Typography: Exo 2 (heading, 800-900) + Be Vietnam Pro (body)
- Spacing rộng rãi, elegant (100px sections)
- High contrast: white on dark navy

### Tham khảo giao diện
- File: `Dndas Nft Marketplace Website.jpg`
- Style: Premium NFT Marketplace, Behance/Dribbble quality
- Đặc điểm: cực kỳ clean, ít màu accent, chủ yếu trắng + navy
- Cards subtle, borders gần như invisible
- Buttons trắng hoặc outline, không neon toàn bộ

## Quy tắc code

### HTML
- Mỗi trang có đầy đủ SEO meta tags (title, description, og:tags)
- Lang="vi"
- Inline critical CSS, external cho non-critical
- Scripts đặt cuối body
- Version query string cho JS files (?v=1, ?v=2...)

### JavaScript
- Cart system: IIFE pattern, không phụ thuộc module
- Data layer: ES module, Firestore → localStorage cache → render
- ID comparison: LUÔN dùng String() khi so sánh Firestore IDs
- serverTimestamp() chỉ dùng khi write, không dùng trong query filter

### CSS
- Mobile-first, breakpoint chính: 768px
- Transitions: cubic-bezier(.4,0,.2,1)
- Border-radius: 7-14px
- Hover effects: translateY(-2px đến -4px) + box-shadow

## Flow thanh toán
1. Khách chọn khóa học → thêm giỏ hàng (localStorage)
2. Checkout → POST /api/checkout → tạo order Firestore (pending)
3. Hiện QR code (qr.sepay.vn) với nội dung chuyển khoản unique
4. Frontend poll /api/seapay/status mỗi 3s
5. SePay webhook → verify → update order paid
6. Trigger email xác nhận (non-blocking) qua Resend
7. Redirect thank-you page + cung cấp link truy cập khóa học

## Deploy
- Push GitHub → Vercel auto-deploy
- Environment variables cần set trên Vercel:
  - FIREBASE_SERVICE_ACCOUNT
  - SEPAY_API_KEY
  - RESEND_API_KEY
  - INTERNAL_API_KEY
- vercel.json: cleanUrls, rewrites cho /api/*
- prepare-public.js: copy files cần thiết vào /public

## Lưu ý quan trọng
- Firestore IDs là string → dùng String() khi so sánh
- Vercel serverless timeout: 10s (free), 60s (pro)
- Khi đổi domain: cập nhật baseUrl trong tất cả API files
- Browser cache: bump version query string khi update JS
- prepare-public.js: thêm file mới vào đây khi tạo
- Email gửi non-blocking (fire-and-forget) để không delay response
- Webhook SePay: luôn verify amount trước khi update paid

## Sản phẩm: Khóa học "Pro Trading"

### Nội dung chương trình (33 bài)
0. Lộ trình chi tiết để đạt kết quả nhanh nhất
1. Khái Quát Về Cấu Trúc Thị Trường – Phần 1
2. Khái Quát Về Cấu Trúc Thị Trường – Phần 2
3. Xác Định Cấu Trúc Thị Trường
4. Chọn Vùng Mua Bán – Vùng Mua Bán Khác Vùng Bò Gấu Như Thế Nào?
5. Thực Hành Đọc Thấu Cấu Trúc Thị Trường
6. Bắt Đầu Xây Dựng Quy Tắc Vào Lệnh
7. Điểm Vào Lệnh – Dừng Lỗ Theo Quy Tắc Ở Đâu?
8-11. Yếu Tố Bên Trong (4 bài + tổng kết)
12. Tại Sao Nên Luyện Tập Điểm Vào Này?
13-16. Yếu Tố Bên Ngoài (3 bài + tổng kết)
17. Điểm Vào Lệnh Sớm
18. Điểm Vào Lệnh Muộn – Limit
19. Chốt Lời
20. Các Kịch Bản – Gặp Là Vào
21-22. Cách Thống Kê, Xây Dựng Bộ Quy Tắc Vào Lệnh (2 phần + template + bài tập mẫu)
23-24. Backtest Kiểm Chứng Phương Pháp (lý thuyết + thực hành + công cụ)
25. (Bonus) Đọc Nến & Cấu Trúc Thị Trường
26. (New) Công cụ tự động tính toán khối lượng vào lệnh
27. Giải Đáp Câu Hỏi Thường Gặp
28. Tổng Kết
29-30. (Update) Kết Hợp Điểm Vào Lệnh Với EMA
31. (Update) Xác Định Cản Gần Dễ/Khó Bị Phá, Mô Hình Tỉ Lệ Cao
32. (Mới) Những Điểm Cần Lưu Ý Giúp Giảm Lệnh Xấu

### Tài liệu đi kèm
- Template thống kê/backtest/nhật ký giao dịch
- Phần mềm Backtest
- Công cụ tính khối lượng vào lệnh
- Bài tập mẫu từ cộng đồng

## Hình ảnh
- Sử dụng ảnh thực tế từ Pixabay / Pexels (không dùng placeholder hoặc SVG icon thay ảnh)
- Gọi API để lấy ảnh phù hợp với nội dung (trading, finance, charts, business)
- Pixabay API: `https://pixabay.com/api/?key=51054398-1722f159d50945591a57f3cb7&q=KEYWORD&image_type=photo`
- Pexels API: `https://api.pexels.com/v1/search?query=KEYWORD` (header: Authorization: rV2xs3jZJI0Tt78w8fQW1woFzI8tZ0tIBQpstDGTSoPC3lwSuIB6OHf5)
- Ưu tiên ảnh landscape, chất lượng cao, tông tối phù hợp dark theme
- Lưu ảnh vào thư mục `product/` hoặc dùng trực tiếp URL từ CDN

## Skill Reference
Các file trong thư mục `/Skill` chứa hướng dẫn chi tiết:
1. `01-firebase-vercel-setup.txt` - Setup Firebase + Vercel
2. `02-thanh-toan-sepay.txt` - Tích hợp thanh toán SePay
3. `03-email-resend.txt` - Email service qua Resend
4. `04-dark-ui-design-system.txt` - CSS Design System
5. `05-seo-marketing.txt` - SEO & Marketing
6. `06-tao-web-ban-hang-so.txt` - Quy trình tạo web A-Z
