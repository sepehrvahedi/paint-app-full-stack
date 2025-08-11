# 🎨 راهنمای بک‌اند استودیو نقاشی

---

## 🚀 معرفی

بک‌اند یک اپلیکیشن نقاشی آنلاین مبتنی بر **Spring Boot** که به کاربران امکان ایجاد، ذخیره و اشتراک‌گذاری نقاشی‌های دیجیتال را می‌دهد. سیستم از معماری RESTful API استفاده می‌کند و قابلیت‌های مدیریت کاربر، احراز هویت، و ذخیره‌سازی نقاشی‌ها را ارائه می‌دهد.

### ویژگی‌های اصلی:
- 🔐 احراز هویت JWT-based با الگوریتم HS512
- 🎨 ذخیره نقاشی‌ها در فرمت JSON
- 👥 مدیریت کاربران و پروفایل‌ها
- 🛡️ رمزنگاری پسوردها با BCrypt

---

## 🏗️ معماری کلی

### الگوی MVC Spring Boot
پروژه از معماری **Spring Boot MVC** استفاده می‌کند:
- **Entities (Models)**: کلاس‌های User و Painting با JPA annotations
- **Controllers**: REST endpoints و مدیریت درخواست‌ها
- **Services**: منطق کسب‌وکار
- **Repositories**: لایه دسترسی به داده با Spring Data JPA
- **Security**: JWT-based authentication و authorization
- **Configuration**: تنظیمات CORS و Security


---

## 💻 تکنولوژی‌های استفاده شده

- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT (JJWT library)
- **Database**: SQLite با Hibernate
- **ORM**: Spring Data JPA
- **Password Encryption**: BCrypt
- **Build Tool**: Maven
- **Java Version**: 17+

---

## 🗄️ مدل داده

### User Entity
```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password; // BCrypt hashed
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Painting> paintings;
}
```

### Painting Entity
```java
@Entity
public class Painting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String paintingData; // JSON data
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;
    
    private Integer canvasWidth;
    private Integer canvasHeight;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

---

## 🔐 احراز هویت

### JWT Strategy با Spring Security
- **Registration**: BCrypt password hashing، ایجاد کاربر، تولید JWT با HS512
- **Login**: اعتبارسنجی credentials، تولید JWT token
- **Authorization**: JWT authentication filter برای بررسی tokens
- **Token Management**: expiration 7 روز، secure key generation

### Security Configuration
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

---

## 🛠️ API Endpoints

### Authentication (`/api/auth`)
```http
POST /api/auth/register
Content-Type: application/json
{
    "username": "user123",
    "password": "securepassword"
}

POST /api/auth/login
Content-Type: application/json
{
    "username": "user123", 
    "password": "securepassword"
}
```

### Paintings (`/api/paintings`)
```http
GET /api/paintings
Authorization: Bearer <jwt-token>

POST /api/paintings
Authorization: Bearer <jwt-token>
Content-Type: application/json
{
    "title": "My Artwork",
    "paintingData": "{...canvas data...}",
    "canvasWidth": 800,
    "canvasHeight": 600
}

GET /api/paintings/{id}
PUT /api/paintings/{id}
DELETE /api/paintings/{id}
```

---

## ⚙️ تنظیمات پروژه

### application.properties
```properties
# Server Configuration
server.port=5001

# Database Configuration
spring.datasource.url=jdbc:sqlite:database.sqlite
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration (512-bit key required for HS512)
jwt.secret=76aeb2b5875c08d63aa1d892f68b3dca9f8e4a5c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0
jwt.expiration=604800000

# CORS Configuration  
cors.allowed-origins=http://localhost:3000,http://localhost:3001

# Application Configuration
app.name=Canvas Drawing API
logging.level.com.example=DEBUG
```

---

## 🚀 راه‌اندازی

### پیش‌نیازها
- Java 17 یا بالاتر
- Maven 3.6+
- SQLite (اتوماتیک نصب)

### مراحل راه‌اندازی
```bash
# 1. کلون کردن پروژه
git clone <repository-url>
cd canvas-drawing-api

# 2. نصب dependencies
mvn clean install

# 3. اجرای پروژه
mvn spring-boot:run
```

### Health Check
- Endpoint: `GET /api/test/hello`
- بررسی وضعیت سرور: سرور روی پورت 5001 در دسترس است

---

## 🔧 نکات پیاده‌سازی

### Data Validation
- Bean Validation با `@Valid` annotations
- Custom validation در Service layer
- Global exception handling

### Security Best Practices
- JWT tokens با کلید 512-bit برای HS512
- BCrypt hashing با default strength (10 rounds)
- CORS configuration برای frontend domains
- Password validation و username uniqueness

### Error Handling
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
```
