# 🌐 System Design Visualizer (Designed to Scale PRO)

> Nền tảng học và mô phỏng **System Design & Distributed Systems** trực quan theo góc nhìn **Isometric 2.5D Vector**. Tích hợp bộ mô phỏng lưu lượng thời gian thực (Traffic Stress Simulator), phòng thí nghiệm lắp ghép kiến trúc (Design Lab) và công cụ tính toán tải trọng (Capacity Estimator).

---

## ✨ Tính Năng Vượt Trội

1. **🎨 2.5D Isometric Architecture Canvas**:
   - Khối hình học 2.5D Isometric sắc nét với phép chiếu vector SVG mượt mà.
   - Luồng gói tin phát quang chuyển động biểu thị chu kỳ request/response.
   - Hiển thị trực quan chỉ số KPI thời gian thực: *Latency RTT, QPS, DB CPU load, Cache Hit %*.
2. **🛠️ Interactive Design Lab (Phòng Thí Nghiệm Kéo-Thả)**:
   - Tự do bật/tắt các thành phần: *Cloudflare CDN, Nginx Load Balancer, API Cluster, Redis Cache, Kafka Queue, Read Replica*.
   - **Thanh trượt lưu lượng (Traffic Slider từ 1k đến 200k QPS)**: Tận mắt quan sát cách hệ thống chịu tải, và chứng kiến Database bị quá tải (Overheating) bốc cháy nếu thiếu bộ đệm Cache!
3. **🐒 Chaos Monkey Simulator (Mô Phỏng Sự Cố)**:
   - Click chuột vào bất kỳ server node nào để "đánh sập" hoặc gây trễ mạng.
   - Quan sát cách Load Balancer cách ly node chết và kích hoạt cơ chế Failover.
4. **🧮 Back-of-the-Envelope Capacity Estimator**:
   - Bộ tính toán chuẩn phỏng vấn FAANG: Nhập số người dùng (DAU), lượt đọc/ghi, dung lượng file.
   - Tự động xuất ra: *Read QPS, Peak QPS, Tốc độ phình ổ cứng mỗi năm (TB/Year), Băng thông (Gbps) và lượng RAM cần cho Cache theo quy tắc 80/20*.
5. **📚 Giáo Trình Hệ Thống Thực Tế Triệu Người Dùng**:
   - 🔗 **Bitly (URL Shortener)**: Base62, Bloom Filter, Snowflake ID, Async Kafka Clickstream.
   - 💬 **WhatsApp / Slack (Chat System)**: WebSocket Gateways, Redis Presence, Cassandra History Partitioning.
   - ⚡ **Shopee / Ticketmaster (Flash Sale)**: Lua Script nguyên tử trên Redis, Distributed Lock, Kafka Queue chống sập DB.
   - 🌐 **Vòng đời Request**: DNS Resolver, TCP Handshake, TLS 1.3 Key Exchange, Nginx Reverse Proxy.
   - ⚡ **Chiến lược Caching**: Cache-Aside, Write-Through, chống Thundering Herd (Stampede).
6. **📋 Xuất Sơ Đồ Mermaid.js**:
   - Copy mã Mermaid chỉ với 1 click để dán thẳng vào tài liệu kỹ thuật, PR hoặc Notion.
7. **🌗 Dark Mode & Light Mode**:
   - Chế độ Obsidian Dark rực rỡ với điểm nhấn Neon Amber/Cyan và chế độ Light giấy kem Retro.
   - Tìm kiếm nhanh toàn hệ thống qua phím tắt **`Ctrl + K`**.

---

## 🚀 Cài Đặt & Chạy Cục Bộ (Local Development)

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Biên dịch cho môi trường Production
npm run build

# 4. Xem trước bản build Production
npm run preview
```

---

## 🌐 Triển Khai Lên Vercel (Deployment)

1. Mở [vercel.com/new](https://vercel.com/new).
2. Chọn repository **`system-design-visualizer`** dưới tài khoản GitHub `huypham1411`.
3. Nhấn **Deploy** (File `vercel.json` đã cấu hình sẵn framework Vite và thư mục `dist`).
