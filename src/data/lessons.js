export const MODULES = [
  {
    id: 'foundations',
    title: 'Module 01: Foundations',
    subtitle: 'Nền tảng kiến trúc & Vòng đời mạng',
    icon: 'Layers',
    badge: '3 Lessons',
    lessons: ['request-lifecycle', 'latency-numbers', 'scaling-basics']
  },
  {
    id: 'caching-scaling',
    title: 'Module 02: Scaling & Caching',
    subtitle: 'Mở rộng quy mô & Chiến lược bộ đệm',
    icon: 'Zap',
    badge: '3 Lessons',
    lessons: ['caching-strategies', 'consistent-hashing', 'load-balancing']
  },
  {
    id: 'storage-distributed',
    title: 'Module 03: Distributed Storage',
    subtitle: 'Lưu trữ phân tán, Sao lưu & Sharding',
    icon: 'Database',
    badge: '2 Lessons',
    lessons: ['db-replication-failover', 'sharding-partitioning']
  },
  {
    id: 'real-world-systems',
    title: 'Module 04: Real-World Systems',
    subtitle: 'Thiết kế hệ thống thực tế triệu người dùng',
    icon: 'Globe',
    badge: '4 Flagship Systems',
    lessons: ['url-shortener-bitly', 'chat-system-whatsapp', 'flash-sale-shopee', 'twitter-news-feed']
  }
];

export const LESSONS = {
  'request-lifecycle': {
    id: 'request-lifecycle',
    moduleId: 'foundations',
    title: 'The Request Lifecycle',
    subtitle: 'Hành trình một gói tin từ Browser đến Database',
    difficulty: 'BEGINNER',
    readTime: '6 min',
    tags: ['DNS', 'TCP', 'TLS', 'HTTP', 'Reverse Proxy'],
    steps: [
      {
        step: 1,
        title: 'User gõ URL trên trình duyệt',
        badge: 'DNS LOOKUP',
        metrics: { rtt: '0ms', qps: '1 req/s', cacheStatus: 'DNS Cache Miss', dbLoad: '0%' },
        explanation: 'Khi người dùng gõ "https://api.example.com", máy khách trước tiên phải tìm kiếm địa chỉ IP thực tế qua hệ thống DNS (Domain Name System).',
        whatChanged: [
          { type: 'add', text: 'Client gửi DNS query đến Recursive Resolver' },
          { type: 'info', text: 'Kiểm tra Browser Cache -> OS Hosts -> ISP DNS' }
        ],
        proTip: 'DNS lookup thường tốn từ 20ms đến 120ms nếu chưa có trong Local Cache. Các công ty lớn dùng Anycast DNS để định tuyến đến máy chủ DNS gần người dùng nhất.',
        nodes: [
          { id: 'client', name: 'Web Client', type: 'client', x: 80, y: 160, status: 'active', desc: 'Browser (Chrome/iOS)' },
          { id: 'dns', name: 'DNS Resolver', type: 'dns', x: 260, y: 70, status: 'busy', desc: '1.1.1.1 / 8.8.8.8' },
          { id: 'lb', name: 'Load Balancer', type: 'lb', x: 420, y: 160, status: 'idle', desc: 'Nginx / AWS ALB' },
          { id: 'api', name: 'API Server', type: 'app', x: 600, y: 160, status: 'idle', desc: 'Node.js / Go Service' },
          { id: 'db', name: 'Database', type: 'db', x: 780, y: 160, status: 'idle', desc: 'PostgreSQL Primary' }
        ],
        traffic: [
          { from: 'client', to: 'dns', label: 'DNS Query (UDP 53)', active: true, color: '#f59e0b' }
        ]
      },
      {
        step: 2,
        title: 'TCP Handshake & TLS 1.3 Key Exchange',
        badge: 'SECURITY & HANDSHAKE',
        metrics: { rtt: '48ms', qps: '1 req/s', cacheStatus: 'TLS 1.3 Established', dbLoad: '0%' },
        explanation: 'Sau khi có IP, Client bắt tay 3 bước TCP (SYN -> SYN-ACK -> ACK) và đàm phán mã hóa TLS 1.3 để thiết lập kênh truyền an toàn HTTPS.',
        whatChanged: [
          { type: 'add', text: 'Kết nối TCP kết hợp trao đổi khóa Diffie-Hellman (TLS 1.3)' },
          { type: 'update', text: 'Rút ngắn từ 2 RTT (TLS 1.2) xuống chỉ còn 1 RTT (TLS 1.3)' }
        ],
        proTip: 'Với TLS 1.3 0-RTT (Early Data), client có thể gửi kèm dữ liệu HTTP ngay trong gói tin đầu tiên nếu đã kết nối trước đó, loại bỏ hoàn toàn độ trễ bắt tay!',
        nodes: [
          { id: 'client', name: 'Web Client', type: 'client', x: 80, y: 160, status: 'active', desc: 'TLS Session Active' },
          { id: 'dns', name: 'DNS Resolver', type: 'dns', x: 260, y: 70, status: 'done', desc: 'Resolved: 104.21.4.1' },
          { id: 'lb', name: 'Load Balancer', type: 'lb', x: 420, y: 160, status: 'busy', desc: 'Terminating SSL' },
          { id: 'api', name: 'API Server', type: 'app', x: 600, y: 160, status: 'idle', desc: 'Node.js / Go Service' },
          { id: 'db', name: 'Database', type: 'db', x: 780, y: 160, status: 'idle', desc: 'PostgreSQL Primary' }
        ],
        traffic: [
          { from: 'client', to: 'lb', label: 'HTTPS (TCP + TLS Handshake)', active: true, color: '#06b6d4' }
        ]
      },
      {
        step: 3,
        title: 'Reverse Proxy định tuyến đến API Server',
        badge: 'HTTP PROCESSING',
        metrics: { rtt: '72ms', qps: '2,400 req/s', cacheStatus: 'No Cache', dbLoad: '15%' },
        explanation: 'Load Balancer giải mã SSL, kiểm tra Health Check và phân bổ HTTP Request đến máy chủ ứng dụng nội bộ qua mạng Private Subnet.',
        whatChanged: [
          { type: 'add', text: 'Load Balancer chuyển tiếp HTTP Header (X-Forwarded-For)' },
          { type: 'update', text: 'Máy chủ API xác thực JWT Token và chuẩn bị câu truy vấn' }
        ],
        proTip: 'Việc dồn xử lý mã hóa SSL tại Load Balancer (SSL Termination) giúp giảm tải CPU quý giá cho các ứng dụng backend.',
        nodes: [
          { id: 'client', name: 'Web Client', type: 'client', x: 80, y: 160, status: 'active', desc: 'Waiting Response' },
          { id: 'dns', name: 'DNS Resolver', type: 'dns', x: 260, y: 70, status: 'idle', desc: 'Cached' },
          { id: 'lb', name: 'Load Balancer', type: 'lb', x: 420, y: 160, status: 'active', desc: 'Round-Robin Dispatch' },
          { id: 'api', name: 'API Server', type: 'app', x: 600, y: 160, status: 'busy', desc: 'Parsing Request' },
          { id: 'db', name: 'Database', type: 'db', x: 780, y: 160, status: 'idle', desc: 'PostgreSQL Primary' }
        ],
        traffic: [
          { from: 'lb', to: 'api', label: 'Internal HTTP Forward', active: true, color: '#10b981' }
        ]
      },
      {
        step: 4,
        title: 'Database Query & Trả về kết quả',
        badge: 'DATA RETRIEVAL',
        metrics: { rtt: '115ms', qps: '2,400 req/s', cacheStatus: 'Index Hit', dbLoad: '28%' },
        explanation: 'API Server truy vấn Database qua B-Tree Index, nén kết quả thành JSON (Gzip/Brotli) và gửi ngược lại cho Client render giao diện.',
        whatChanged: [
          { type: 'add', text: 'SQL Query: SELECT * FROM users WHERE id = $1' },
          { type: 'update', text: 'HTTP 200 OK + Gzip compressed JSON Payload' }
        ],
        proTip: 'Tổng thời gian trọn vẹn của một request tiêu chuẩn từ Việt Nam đến máy chủ Singapore thường mất ~100-130ms, trong đó 80% thời gian là độ trễ đường truyền vật lý (Speed of Light in Fiber).',
        nodes: [
          { id: 'client', name: 'Web Client', type: 'client', x: 80, y: 160, status: 'active', desc: 'DOM Rendered 115ms' },
          { id: 'dns', name: 'DNS Resolver', type: 'dns', x: 260, y: 70, status: 'idle', desc: 'Idle' },
          { id: 'lb', name: 'Load Balancer', type: 'lb', x: 420, y: 160, status: 'active', desc: 'Pass-through' },
          { id: 'api', name: 'API Server', type: 'app', x: 600, y: 160, status: 'active', desc: 'Sending Response' },
          { id: 'db', name: 'Database', type: 'db', x: 780, y: 160, status: 'busy', desc: 'Index Scan (2ms)' }
        ],
        traffic: [
          { from: 'api', to: 'db', label: 'SQL Query', active: true, color: '#f59e0b' },
          { from: 'api', to: 'client', label: 'HTTP 200 OK (JSON)', active: true, color: '#10b981' }
        ]
      }
    ]
  },

  'caching-strategies': {
    id: 'caching-strategies',
    moduleId: 'caching-scaling',
    title: 'Caching Strategies & Thundering Herd',
    subtitle: 'Các mô hình Cache-Aside, Write-Through & Chống sập Cache',
    difficulty: 'INTERMEDIATE',
    readTime: '8 min',
    tags: ['Redis', 'Cache-Aside', 'LRU', 'Thundering Herd', 'TTL'],
    steps: [
      {
        step: 1,
        title: 'Hệ thống khi chưa có Cache (Database tắc nghẽn)',
        badge: 'PROBLEM: DB BOTTLENECK',
        metrics: { qps: '15,000 req/s', dbCpu: '96%', cacheHit: '0%', latency: '380ms' },
        explanation: 'Khi lưu lượng tăng cao, hàng nghìn câu SELECT đồng thời đổ dồn vào Database. Ổ đĩa I/O và CPU của cơ sở dữ liệu bị vắt kiệt, độ trễ tăng vọt lên hàng trăm mili-giây.',
        whatChanged: [
          { type: 'add', text: '15,000 QPS đổ dồn trực tiếp vào Database' },
          { type: 'alert', text: 'Database CPU chạm ngưỡng 96%, nguy cơ crash hoàn toàn' }
        ],
        proTip: 'Đọc dữ liệu từ RAM của Redis chỉ tốn khoảng 0.1ms (100 micro-giây), trong khi đọc từ ổ đĩa SSD của DB tốn từ 2ms đến 15ms (chậm hơn gấp 100 lần)!',
        nodes: [
          { id: 'client', name: 'Users Fleet', type: 'client', x: 100, y: 180, status: 'active', desc: '15,000 Concurrent' },
          { id: 'app', name: 'API Fleet', type: 'app', x: 380, y: 180, status: 'busy', desc: 'Connection Pool Full' },
          { id: 'db', name: 'Primary DB', type: 'db', x: 680, y: 180, status: 'overheat', desc: 'CPU 96% OVERLOAD' }
        ],
        traffic: [
          { from: 'client', to: 'app', label: '15k QPS', active: true, color: '#f43f5e' },
          { from: 'app', to: 'db', label: '15k Direct SQL Queries', active: true, color: '#f43f5e' }
        ]
      },
      {
        step: 2,
        title: 'Tích hợp Cache-Aside Pattern (Redis Tier)',
        badge: 'SOLUTION: REDIS CACHE',
        metrics: { qps: '15,000 req/s', dbCpu: '12%', cacheHit: '92%', latency: '8ms' },
        explanation: 'Áp dụng Cache-Aside (Lazy Loading): Khi có request, API kiểm tra Redis trước. Nếu có (Cache Hit), trả về ngay lập tức; nếu không (Cache Miss), đọc từ DB rồi lưu vào Redis.',
        whatChanged: [
          { type: 'add', text: 'Cụm Redis Cluster đặt làm tầng trung gian' },
          { type: 'update', text: '92% lượng request được giải phóng tại RAM' },
          { type: 'update', text: 'Database CPU hạ từ 96% xuống còn 12%' }
        ],
        proTip: 'Theo quy luật Pareto (Quy tắc 80/20): 20% dữ liệu phổ biến nhất sẽ chiếm tới 80% lượt truy cập. Do đó, chỉ cần một cụm Redis nhỏ cũng đủ giải quyết phần lớn áp lực tải.',
        nodes: [
          { id: 'client', name: 'Users Fleet', type: 'client', x: 100, y: 180, status: 'active', desc: '15,000 Concurrent' },
          { id: 'app', name: 'API Fleet', type: 'app', x: 380, y: 180, status: 'active', desc: 'Fast Cache Lookups' },
          { id: 'cache', name: 'Redis Cache', type: 'cache', x: 680, y: 90, status: 'active', desc: 'RAM (0.2ms Latency)' },
          { id: 'db', name: 'Primary DB', type: 'db', x: 680, y: 270, status: 'active', desc: 'CPU 12% (Relaxed)' }
        ],
        traffic: [
          { from: 'client', to: 'app', label: '15k QPS', active: true, color: '#10b981' },
          { from: 'app', to: 'cache', label: 'Cache Lookup (92% Hit)', active: true, color: '#06b6d4' },
          { from: 'app', to: 'db', label: '8% Miss Only', active: true, color: '#f59e0b' }
        ]
      },
      {
        step: 3,
        title: 'Hiểm họa Thundering Herd (Bầy thú dẫm đạp)',
        badge: 'EDGE CASE: STAMPEDE',
        metrics: { qps: '25,000 req/s', dbCpu: '99%', cacheHit: '0%', latency: '950ms' },
        explanation: 'Khi một key cực "hot" (ví dụ: tin nóng người nổi tiếng) bị hết hạn TTL cùng lúc, hàng chục nghìn request đồng loạt bị Cache Miss và ập vào Database cùng một giây!',
        whatChanged: [
          { type: 'alert', text: 'Hot Key TTL Expired tại thời điểm cao điểm' },
          { type: 'alert', text: 'Thundering Herd: Toàn bộ traffic đánh sập Database' }
        ],
        proTip: 'Cách ngăn chặn Thundering Herd hiệu quả nhất trong thực tế là dùng Khóa phân tán (Distributed Mutex) hoặc kỹ thuật Probabilistic Early Expiration (XFetch algorithm).',
        nodes: [
          { id: 'client', name: 'Users Fleet', type: 'client', x: 100, y: 180, status: 'busy', desc: 'Spike Traffic' },
          { id: 'app', name: 'API Fleet', type: 'app', x: 380, y: 180, status: 'busy', desc: 'Cache Miss Storm' },
          { id: 'cache', name: 'Redis Cache', type: 'cache', x: 680, y: 90, status: 'overheat', desc: 'Key Expired' },
          { id: 'db', name: 'Primary DB', type: 'db', x: 680, y: 270, status: 'overheat', desc: 'CRASHING (99% CPU)' }
        ],
        traffic: [
          { from: 'app', to: 'db', label: 'Massive Stampede', active: true, color: '#f43f5e' }
        ]
      },
      {
        step: 4,
        title: 'Giải pháp Distributed Mutex Lock (Khóa phân tán)',
        badge: 'PRODUCTION HARDENING',
        metrics: { qps: '25,000 req/s', dbCpu: '8%', cacheHit: '99.9%', latency: '6ms' },
        explanation: 'Khi cache miss, chỉ DUY NHẤT một request đầu tiên giành được Redis Lock (SETNX) để truy vấn DB và ghi lại vào Cache. Các request khác tạm chờ 20ms rồi lấy trực tiếp từ Cache!',
        whatChanged: [
          { type: 'add', text: 'Distributed Mutex Lock bằng Redis SET key value NX PX 5000' },
          { type: 'update', text: 'DB chỉ nhận đúng 1 truy vấn duy nhất để tái tạo Cache' },
          { type: 'update', text: 'Hệ thống duy trì độ ổn định tuyệt đối' }
        ],
        proTip: 'Thêm ngẫu nhiên một khoảng Jitter (ví dụ: TTL = 3600s + rand(0, 300s)) để các key không bao giờ bị hết hạn cùng một thời khắc!',
        nodes: [
          { id: 'client', name: 'Users Fleet', type: 'client', x: 100, y: 180, status: 'active', desc: '25,000 Concurrent' },
          { id: 'app', name: 'API Fleet', type: 'app', x: 380, y: 180, status: 'active', desc: 'Mutex Protected' },
          { id: 'cache', name: 'Redis Cache', type: 'cache', x: 680, y: 90, status: 'active', desc: 'Mutex + Jitter Active' },
          { id: 'db', name: 'Primary DB', type: 'db', x: 680, y: 270, status: 'active', desc: '1 Query Only (Safe)' }
        ],
        traffic: [
          { from: 'client', to: 'app', label: '25k QPS', active: true, color: '#10b981' },
          { from: 'app', to: 'cache', label: 'Redis Lock Acquired', active: true, color: '#06b6d4' },
          { from: 'app', to: 'db', label: '1 Single Query', active: true, color: '#10b981' }
        ]
      }
    ]
  },

  'url-shortener-bitly': {
    id: 'url-shortener-bitly',
    moduleId: 'real-world-systems',
    title: 'Design a URL Shortener (Bitly)',
    subtitle: 'Thiết kế hệ thống rút gọn liên kết hàng tỷ lượt click',
    difficulty: 'ADVANCED',
    readTime: '12 min',
    tags: ['Base62', 'Snowflake ID', 'Bloom Filter', 'Redis', 'Kafka'],
    steps: [
      {
        step: 1,
        title: 'Phân tích yêu cầu & Thuật toán mã hóa Base62',
        badge: 'ESTIMATION & ENCODING',
        metrics: { writeQps: '1,200/s', readQps: '120,000/s', readWriteRatio: '100:1', storageYear: '18 TB' },
        explanation: 'Hệ thống cần rút ngắn URL dài thành mã 7 ký tự. Dùng bảng mã Base62 (a-z, A-Z, 0-9): 62^7 = 3.5 nghìn tỷ liên kết độc nhất, đủ dùng trong 100 năm!',
        whatChanged: [
          { type: 'add', text: 'Tỷ lệ đọc/ghi 100:1 (Read-heavy architecture)' },
          { type: 'add', text: 'Thuật toán: ID số nguyên 64-bit -> Base62 String (ví dụ: ID 125193 -> "b9f")' }
        ],
        proTip: 'Tuyệt đối không dùng Hash MD5/SHA256 rồi cắt ngắn vì sẽ bị va chạm trùng lặp (Hash Collision) rất nặng khi quy mô lớn.',
        nodes: [
          { id: 'client', name: 'User Browser', type: 'client', x: 120, y: 180, status: 'active', desc: 'bit.ly/xyz789' },
          { id: 'api', name: 'URL Service', type: 'app', x: 420, y: 180, status: 'active', desc: 'Base62 Encoder' },
          { id: 'idgen', name: 'Snowflake ID Gen', type: 'service', x: 420, y: 60, status: 'active', desc: 'Unique 64-bit IDs' }
        ],
        traffic: [
          { from: 'client', to: 'api', label: 'POST /shorten', active: true, color: '#f59e0b' },
          { from: 'api', to: 'idgen', label: 'Fetch Next ID', active: true, color: '#06b6d4' }
        ]
      },
      {
        step: 2,
        title: 'Tầng đọc siêu tốc: Bloom Filter & Redis Cache',
        badge: 'READ PIPELINE (120K QPS)',
        metrics: { cacheHit: '95%', bloomFilter: 'Negative Check (0.01ms)', latency: '4ms', dbReads: '6k/s' },
        explanation: 'Vì tỷ lệ đọc gấp 100 lần ghi, ta bố trí Bloom Filter ở đầu để phát hiện ngay các mã URL giả mạo (không tồn tại) mà không cần truy vấn DB, kết hợp Redis Cache lưu các URL hot.',
        whatChanged: [
          { type: 'add', text: 'Bloom Filter: Loại bỏ 100% request rác đòi xem link không có' },
          { type: 'add', text: 'Redis Cluster: Phục vụ 95% lượt click trong 2-4ms' }
        ],
        proTip: 'Bloom Filter sử dụng cấu trúc Bit Array và nhiều hàm băm, chiếm dung lượng cực nhỏ (100 triệu phần tử chỉ tốn ~120MB RAM) nhưng xác định cực chuẩn phần tử không tồn tại.',
        nodes: [
          { id: 'client', name: 'User Browser', type: 'client', x: 80, y: 180, status: 'active', desc: '120k QPS Clicks' },
          { id: 'lb', name: 'Global CDN / LB', type: 'lb', x: 260, y: 180, status: 'active', desc: 'Anycast DNS' },
          { id: 'bloom', name: 'Bloom Filter', type: 'service', x: 440, y: 90, status: 'active', desc: 'Fast Existence Check' },
          { id: 'cache', name: 'Redis Cache', type: 'cache', x: 620, y: 90, status: 'active', desc: 'Top 20% Hot Links' },
          { id: 'db', name: 'Sharded KV DB', type: 'db', x: 620, y: 260, status: 'active', desc: 'Cassandra / DynamoDB' }
        ],
        traffic: [
          { from: 'client', to: 'lb', label: 'GET /xyz789', active: true, color: '#10b981' },
          { from: 'lb', to: 'bloom', label: 'Quick Check', active: true, color: '#06b6d4' },
          { from: 'bloom', to: 'cache', label: 'Cache Lookup', active: true, color: '#10b981' }
        ]
      },
      {
        step: 3,
        title: 'Đường ống thống kê phi đồng bộ (Async Kafka Click Stream)',
        badge: 'ANALYTICS PIPELINE',
        metrics: { kafkaThroughput: '120k msgs/s', analyticsLag: '< 2s', storageCost: 'Optimized' },
        explanation: 'Khi trả về HTTP 301/302 Redirect cho người dùng, API Server không ghi lượt click trực tiếp vào DB chính (gây nghẽn). Thay vào đó, sự kiện click được đẩy vào Apache Kafka để thống kê bất đồng bộ.',
        whatChanged: [
          { type: 'add', text: 'Kafka Topic "url-clicks" đệm hàng triệu sự kiện mỗi phút' },
          { type: 'add', text: 'Flink/Spark Worker tổng hợp số liệu theo quốc gia, trình duyệt' },
          { type: 'add', text: 'Kho dữ liệu phân tích ClickHouse / Snowflake' }
        ],
        proTip: 'Dùng mã HTTP 302 (Found - Temporary Redirect) thay vì 301 (Moved Permanently) nếu bạn muốn theo dõi trọn vẹn số lượt click, vì mã 301 sẽ bị trình duyệt tự cache lại.',
        nodes: [
          { id: 'api', name: 'URL Redirector', type: 'app', x: 180, y: 180, status: 'active', desc: 'Returns HTTP 302' },
          { id: 'kafka', name: 'Apache Kafka', type: 'queue', x: 440, y: 180, status: 'active', desc: 'Partitioned Topic' },
          { id: 'worker', name: 'Analytics Worker', type: 'service', x: 680, y: 180, status: 'active', desc: 'Aggregation Stream' },
          { id: 'analyticsDb', name: 'ClickHouse OLAP', type: 'db', x: 680, y: 300, status: 'active', desc: 'Fast Columnar Store' }
        ],
        traffic: [
          { from: 'api', to: 'kafka', label: 'Push Event: Click', active: true, color: '#f59e0b' },
          { from: 'kafka', to: 'worker', label: 'Consumer Group Read', active: true, color: '#06b6d4' },
          { from: 'worker', to: 'analyticsDb', label: 'Batch Insert', active: true, color: '#10b981' }
        ]
      }
    ]
  },

  'flash-sale-shopee': {
    id: 'flash-sale-shopee',
    moduleId: 'real-world-systems',
    title: 'Design Flash Sale System (Shopee / Ticketmaster)',
    subtitle: 'Chống sập hệ thống khi 100,000 người cùng tranh 100 sản phẩm',
    difficulty: 'ADVANCED',
    readTime: '15 min',
    tags: ['Distributed Lock', 'Lua Script', 'Redis', 'Kafka Queue', 'Rate Limiting'],
    steps: [
      {
        step: 1,
        title: 'Vấn đề Overselling & Khóa dòng Database (Row Locking)',
        badge: 'PROBLEM: DB DEADLOCK',
        metrics: { qps: '85,000 req/s', dbLockTime: '1,400ms', stock: '100 units', oversold: 'RISK HIGH' },
        explanation: 'Khi mở bán vé concert hoặc iPhone giá sốc, 85,000 người cùng bấm "Mua ngay". Nếu dùng SELECT ... FOR UPDATE trên Database truyền thống, hàng nghìn giao dịch sẽ kẹt cứng ổ khóa dòng gây Deadlock và sập server.',
        whatChanged: [
          { type: 'alert', text: 'Tất cả transaction cùng tranh giành ghi vào 1 hàng trong bảng Inventory' },
          { type: 'alert', text: 'Database sập vì cạn kiệt Connection Pool' }
        ],
        proTip: 'Đừng bao giờ để lưu lượng đặt hàng trực tiếp chạm vào cơ sở dữ liệu quan hệ (RDBMS) trong các đợt Flash Sale triệu request.',
        nodes: [
          { id: 'users', name: '85k Flash Buyers', type: 'client', x: 100, y: 180, status: 'busy', desc: 'Concurrent Click' },
          { id: 'app', name: 'Order Service', type: 'app', x: 400, y: 180, status: 'busy', desc: 'Thread Starvation' },
          { id: 'db', name: 'SQL Database', type: 'db', x: 700, y: 180, status: 'overheat', desc: 'Deadlock / Locked Row' }
        ],
        traffic: [
          { from: 'users', to: 'app', label: '85k Checkout / sec', active: true, color: '#f43f5e' },
          { from: 'app', to: 'db', label: 'SELECT FOR UPDATE (Blocked)', active: true, color: '#f43f5e' }
        ]
      },
      {
        step: 2,
        title: 'Giảm tải bằng Lua Script nguyên tử trên Redis',
        badge: 'ATOMIC DEDUCTION IN RAM',
        metrics: { qps: '85,000 req/s', redisLatency: '1.2ms', stockDeducted: '100 units exact', oversold: 'ZERO' },
        explanation: 'Di chuyển số lượng tồn kho lên Redis. Chạy một đoạn Lua Script duy nhất: kiểm tra nếu stock >= 1 thì DECRBY 1, ngược lại báo "Hết hàng". Redis đơn luồng (single-threaded) đảm bảo tính nguyên tử 100%, không bao giờ bán âm!',
        whatChanged: [
          { type: 'add', text: 'Lua Script thực thi nguyên tử trên Redis trong 1ms' },
          { type: 'update', text: '84,900 người bị từ chối lịch sự ngay tại RAM ("Hết hàng")' },
          { type: 'update', text: 'Chỉ đúng 100 người mua thành công nhận được Order Token' }
        ],
        proTip: 'Lua Script trong Redis chạy nguyên tử hoàn toàn: không có lệnh nào khác có thể chen ngang giữa lúc kiểm tra và trừ tồn kho, triệt tiêu hoàn toàn Race Condition.',
        nodes: [
          { id: 'users', name: '85k Flash Buyers', type: 'client', x: 80, y: 180, status: 'active', desc: '85,000 Requests' },
          { id: 'gateway', name: 'API Gateway', type: 'lb', x: 280, y: 180, status: 'active', desc: 'Rate Limiter' },
          { id: 'redis', name: 'Redis Stock Cluster', type: 'cache', x: 500, y: 180, status: 'active', desc: 'Atomic Lua Script' },
          { id: 'db', name: 'SQL Database', type: 'db', x: 720, y: 180, status: 'idle', desc: 'Zero Traffic from Losers' }
        ],
        traffic: [
          { from: 'users', to: 'gateway', label: '85k Requests', active: true, color: '#10b981' },
          { from: 'gateway', to: 'redis', label: 'EVALSHA Lua_Deduct', active: true, color: '#06b6d4' }
        ]
      },
      {
        step: 3,
        title: 'Hàng đợi Kafka & Xử lý đơn hàng bất đồng bộ',
        badge: 'ASYNC FULFILLMENT',
        metrics: { ordersCreated: '100', kafkaBuffer: 'Healthy', dbWriteRate: '10 writes/s', paymentGateway: 'Protected' },
        explanation: '100 khách hàng may mắn được đẩy vào Message Queue (Kafka/RabbitMQ). Worker Service sẽ rút từng đơn ra, tạo hóa đơn trên SQL DB và gửi cổng thanh toán thong thả mà không lo nghẽn.',
        whatChanged: [
          { type: 'add', text: 'Kafka Queue đệm đơn hàng thành công' },
          { type: 'add', text: 'Worker xử lý tuần tự và giữ DB an toàn ở 10 writes/giây' }
        ],
        proTip: 'Phương pháp đệm hàng đợi (Queue-based Load Leveling) là tiêu chuẩn vàng của Amazon và Shopee để biến đỉnh sóng lưu lượng khổng lồ thành một dòng chảy êm đềm.',
        nodes: [
          { id: 'redis', name: 'Redis Stock', type: 'cache', x: 120, y: 180, status: 'active', desc: '100 Winners' },
          { id: 'queue', name: 'Kafka Orders Queue', type: 'queue', x: 380, y: 180, status: 'active', desc: 'Buffered Messages' },
          { id: 'worker', name: 'Payment Worker', type: 'service', x: 620, y: 180, status: 'active', desc: 'Async Processing' },
          { id: 'db', name: 'SQL Database', type: 'db', x: 820, y: 180, status: 'active', desc: 'Safe Writes (10/s)' }
        ],
        traffic: [
          { from: 'redis', to: 'queue', label: 'Enqueue 100 Orders', active: true, color: '#f59e0b' },
          { from: 'queue', to: 'worker', label: 'Smooth Consume', active: true, color: '#06b6d4' },
          { from: 'worker', to: 'db', label: 'Save Order', active: true, color: '#10b981' }
        ]
      }
    ]
  }
};
