# EventZen — Event Management System

<div align="center">


**A full-stack microservices-based event management platform built with 3 independent backend services, an API gateway, and a modern React frontend.**

</div>

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Modules](#modules)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Database Schema](#database-schema)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [User Roles](#user-roles)
- [Features](#features)

---

## Problem Statement

**EventZen** is built for an event planning company struggling to manage its growing number of events efficiently. The company faced challenges in:

- **Manual Event Scheduling** — Time-consuming and error-prone process of scheduling events, managing venue bookings, and coordinating with vendors.
- **Inefficient Attendee Management** — Difficulty in tracking attendee registrations, managing guest lists, and sending event invitations and reminders.
- **Complex Budget Tracking** — Challenges in managing event budgets, tracking expenses, and generating detailed financial reports.
- **Limited Customer Engagement** — Lack of a user-friendly platform for customers to view event details, make bookings, and receive updates.

---

## Architecture

EventZen uses a **Microservices Architecture** — each service is independent, has its own database, and can be updated without breaking others.

```
┌─────────────────────────────────────────────────────────┐
│            Frontend — Next.js 14 + Tailwind CSS         │
│                    localhost:3001                        │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP requests
                        ▼
┌─────────────────────────────────────────────────────────┐
│              API Gateway — Node.js + Express            │
│                    localhost:8000                        │
│   /api/users → 8080  │  /api/events → 5096             │
│   /api/bookings → 3000  │  /api/budget → 3000          │
└──────────┬────────────┬────────────┬────────────────────┘
           │            │            │
           ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│ User Service │ │Event Service │ │   Booking Service    │
│ Spring Boot  │ │  .NET Core   │ │      Node.js         │
│  port 8080   │ │  port 5096   │ │     port 3000        │
└──────┬───────┘ └──────┬───────┘ └──────────┬───────────┘
       │                │                    │
       ▼                ▼                    ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│    MySQL     │ │  SQL Server  │ │    MongoDB Atlas     │
│  port 3306   │ │  port 1433   │ │     Cloud DB         │
└──────────────┘ └──────────────┘ └──────────────────────┘
```

### Architecture Patterns Used

| Layer | Pattern |
|---|---|
| Overall | Microservices Architecture |
| Backend | REST API (each service exposes REST endpoints) |
| Frontend | Client-Side Rendering with Next.js Pages Router |
| Gateway | API Gateway Pattern (single entry point) |
| Database | Database per Service pattern |
| Auth | JWT (JSON Web Token) based stateless authentication |
| Password | BCrypt hashing |

---

## Tech Stack

### Backend Services

| Service | Framework | Language | Database | Port |
|---|---|---|---|---|
| User Service | Spring Boot 3.4.3 | Java 23 | MySQL 8.0 | 8080 |
| Event Service | .NET Core 8 / ASP.NET Web API | C# | SQL Server Express | 5096 |
| Booking & Budget Service | Node.js + Express | JavaScript | MongoDB Atlas | 3000 |

### Frontend & Gateway

| Component | Technology | Port |
|---|---|---|
| Frontend | Next.js 14.2.5 + Tailwind CSS | 3001 |
| API Gateway | Node.js + Express + http-proxy-middleware | 8000 |

### Other Libraries & Tools

| Purpose | Library |
|---|---|
| JWT Auth | `jjwt 0.11.5` (Spring Boot) |
| Password Hashing | `BCryptPasswordEncoder` (Spring Security) |
| ORM (Java) | Spring Data JPA + Hibernate |
| ORM (.NET) | Entity Framework Core 8 |
| ODM (Node) | Mongoose |
| HTTP Client (Frontend) | Axios |
| API Documentation | Swagger UI (.NET service) |
| Request Logging | Morgan (Gateway) |

---

## Project Structure

```
eventzen/
├── services/
│   ├── user-service/                    ← Spring Boot (Java)
│   │   ├── src/
│   │   │   ├── main/java/com/eventzen/userservice/
│   │   │   │   ├── config/
│   │   │   │   │   ├── AppConfig.java
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── UserController.java
│   │   │   │   ├── model/
│   │   │   │   │   └── User.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── security/
│   │   │   │   │   └── JwtUtil.java
│   │   │   │   ├── service/
│   │   │   │   │   └── UserService.java
│   │   │   │   └── UserServiceApplication.java
│   │   │   └── main/resources/
│   │   │       └── application.properties
│   │   └── pom.xml
│   │
│   ├── event-service/                   ← .NET Core (C#)
│   │   ├── Controllers/
│   │   │   └── EventsController.cs
│   │   ├── Data/
│   │   │   └── EventDbContext.cs
│   │   ├── Models/
│   │   │   └── Event.cs
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── event-service.csproj
│   │
│   └── booking-service/                 ← Node.js
│       ├── models/
│       │   ├── Booking.js
│       │   └── Budget.js
│       ├── routes/
│       │   ├── bookings.js
│       │   └── budget.js
│       ├── services/
│       │   └── bookingService.js
│       ├── controllers/
│       │   ├── bookingController.js
│       │   └── budgetController.js
│       ├── server.js
│       ├── .env
│       └── package.json
│
├── api-gateway/                         ← Node.js Gateway
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/                            ← Next.js
    ├── pages/
    │   ├── _app.jsx
    │   ├── index.jsx
    │   ├── login.jsx
    │   ├── register.jsx
    │   ├── explore.jsx
    │   ├── about.jsx
    │   ├── profile.jsx
    │   ├── events/
    │   │   └── [id].jsx
    │   ├── customer/
    │   │   └── dashboard.jsx
    │   ├── vendor/
    │   │   └── dashboard.jsx
    │   └── admin/
    │       └── dashboard.jsx
    ├── components/
    │   └── Navbar.jsx
    ├── lib/
    │   └── axios.js
    ├── styles/
    │   └── globals.css
    ├── tailwind.config.js
    └── package.json
```

---

## Modules

### Module 1 — User Module (Spring Boot + MySQL)

Handles all authentication and user management.

| Feature | Description |
|---|---|
| Registration | Register as Customer or Vendor with name, email, password, role |
| Login | JWT token generated on successful login |
| Profile | View and update profile including profile image URL |
| Admin view | Admin can fetch all registered users |
| Password security | BCrypt hashing — passwords never stored in plain text |
| Role-based access | Roles: `CUSTOMER`, `VENDOR`, `ADMIN` |

### Module 2 — Event Module (.NET Core + SQL Server)

Handles all event creation and management.

| Feature | Description |
|---|---|
| Create event | Vendors create events with full details |
| Browse events | All active events visible to everyone |
| Event details | Title, description, venue, date, ticket price, capacity, budget, category, image |
| Vendor events | Vendors can view only their own events |
| Soft delete | Events are marked inactive, not permanently deleted |
| Admin view | Admin can see all events including inactive ones |
| Swagger UI | Available at `http://localhost:5096/swagger` |

### Module 3 — Booking & Budget Module (Node.js + MongoDB)

Handles bookings and financial tracking.

| Feature | Description |
|---|---|
| Book event | Customers book events with multiple ticket selection |
| Auto revenue | Revenue automatically updated in budget on each booking |
| Cancellation | Cancel booking with automatic revenue reversal |
| Vendor bookings | Vendors see all bookings made for their events |
| Budget tracking | Total budget, spent, and revenue tracked per event |
| Add expenses | Vendors log expenses against event budget |
| Admin summary | Overall platform revenue, spent, and budget totals |

### Module 4 — API Gateway (Node.js + Express)

Single entry point routing all requests to correct services.

| Feature | Description |
|---|---|
| Routing | Routes based on URL prefix to correct microservice |
| CORS | Cross-Origin Resource Sharing enabled for frontend |
| Logging | All requests logged with method, path, and status using Morgan |
| Health check | `GET /health` returns gateway and service status |
| Error handling | Returns 503 if a downstream service is unavailable |

### Module 5 — Frontend (Next.js + Tailwind CSS)

Complete user interface with role-based access.

| Feature | Description |
|---|---|
| Home page | Landing page with featured events and statistics |
| Auth pages | Register with role selection, Login with JWT storage |
| Explore page | Browse and search all events by name, category, venue |
| Event detail | Full event info with ticket booking widget |
| Customer dashboard | Browse events tab + my bookings tab |
| Vendor dashboard | Events tab + bookings tab + budget tab |
| Admin dashboard | Users, events, bookings, revenue overview |
| Profile page | View profile, update profile image URL |
| Protected routes | Role-based redirect — wrong role cannot access other dashboards |
| Responsive | Works on desktop and tablet screens |

---

## API Endpoints

All endpoints are accessible through the **API Gateway at port 8000**.

### User Service Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/users/register` | Register new user (Customer or Vendor) | No |
| `POST` | `/api/users/login` | Login and receive JWT token | No |
| `GET` | `/api/users/profile` | Get currently logged-in user's profile | Yes |
| `PUT` | `/api/users/profile/image` | Update profile image URL | Yes |
| `GET` | `/api/users/all` | Get all registered users | Admin only |

### Event Service Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/events` | Get all active events | No |
| `GET` | `/api/events/{id}` | Get single event by ID | No |
| `POST` | `/api/events` | Create a new event | Vendor |
| `PUT` | `/api/events/{id}` | Update event details | Vendor |
| `DELETE` | `/api/events/{id}` | Soft delete event | Vendor |
| `GET` | `/api/events/vendor/{vendorId}` | Get all events by a vendor | Yes |
| `GET` | `/api/events/admin/all` | Get all events including inactive | Admin only |

### Booking & Budget Service Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/bookings` | Create a new booking | Customer |
| `GET` | `/api/bookings/customer/:id` | Get all bookings for a customer | Yes |
| `GET` | `/api/bookings/vendor/:id` | Get all bookings for a vendor's events | Yes |
| `PUT` | `/api/bookings/:id/cancel` | Cancel a booking | Customer |
| `GET` | `/api/bookings/admin/all` | Get all bookings on the platform | Admin only |
| `POST` | `/api/budget` | Create or update event budget | Vendor |
| `GET` | `/api/budget/vendor/:id` | Get all budgets for a vendor | Yes |
| `POST` | `/api/budget/:id/expense` | Add an expense to a budget | Vendor |
| `GET` | `/api/budget/admin/summary` | Get platform-wide financial summary | Admin only |

### API Gateway Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Gateway info and available routes |
| `GET` | `/health` | Health check with service URLs |
| `ALL` | `/api/users/*` | Proxied → User Service (8080) |
| `ALL` | `/api/events/*` | Proxied → Event Service (5096) |
| `ALL` | `/api/bookings/*` | Proxied → Booking Service (3000) |
| `ALL` | `/api/budget/*` | Proxied → Booking Service (3000) |

---

## Frontend Pages

| URL | Page | Access |
|---|---|---|
| `/` | Home — landing page with featured events | Public |
| `/register` | Registration with Customer/Vendor role selection | Public |
| `/login` | Login page with JWT handling | Public |
| `/explore` | Browse and search all events | Public |
| `/events/[id]` | Event detail page with booking widget | Public |
| `/about` | About EventZen and tech stack | Public |
| `/profile` | User profile with image update | Logged in |
| `/customer/dashboard` | Customer event browser and booking history | Customer only |
| `/vendor/dashboard` | Vendor event manager, bookings, budget tracker | Vendor only |
| `/admin/dashboard` | Full platform overview — users, events, bookings, revenue | Admin only |

---

## Database Schema

### MySQL — `eventzen_users` database

**Table: `users`**

| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| `name` | VARCHAR(255) | NOT NULL |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE |
| `password` | VARCHAR(255) | NOT NULL (BCrypt hashed) |
| `role` | ENUM | `CUSTOMER`, `VENDOR`, `ADMIN` |
| `image_url` | VARCHAR(255) | nullable |

### SQL Server — `eventzen_events` database

**Table: `Events`**

| Column | Type | Constraints |
|---|---|---|
| `Id` | INT | PRIMARY KEY, IDENTITY |
| `Title` | NVARCHAR(MAX) | NOT NULL |
| `Description` | NVARCHAR(MAX) | NOT NULL |
| `Venue` | NVARCHAR(MAX) | NOT NULL |
| `EventDate` | DATETIME2 | NOT NULL |
| `TicketPrice` | DECIMAL(18,2) | NOT NULL |
| `Capacity` | INT | NOT NULL |
| `Budget` | DECIMAL(18,2) | NOT NULL |
| `Category` | NVARCHAR(MAX) | — |
| `ImageUrl` | NVARCHAR(MAX) | — |
| `VendorId` | BIGINT | FOREIGN KEY → users.id |
| `VendorName` | NVARCHAR(MAX) | — |
| `CreatedAt` | DATETIME2 | default UTC now |
| `IsActive` | BIT | default true |

### MongoDB Atlas — `eventzen_bookings` database

**Collection: `bookings`**

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `customerId` | String | References users.id |
| `customerName` | String | — |
| `customerEmail` | String | — |
| `eventId` | String | References Events.Id |
| `eventTitle` | String | — |
| `vendorId` | String | — |
| `ticketCount` | Number | default 1 |
| `totalAmount` | Number | — |
| `status` | String | `confirmed` or `cancelled` |
| `bookedAt` | Date | default now |

**Collection: `budgets`**

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `vendorId` | String | References users.id |
| `eventId` | String | References Events.Id |
| `eventTitle` | String | — |
| `totalBudget` | Number | — |
| `spent` | Number | default 0 |
| `revenue` | Number | Auto-updated on booking |
| `expenses` | Array | `[{ label, amount, date }]` |

---

## Prerequisites

Make sure these are installed before starting:

| Software | Version | Download |
|---|---|---|
| Java JDK | 17 or 21 or 23 | [Adoptium](https://adoptium.net) |
| Apache Maven | 3.9.x | [maven.apache.org](https://maven.apache.org/download.cgi) |
| .NET SDK | 8.0 | [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/8.0) |
| Node.js | 20 LTS | [nodejs.org](https://nodejs.org) |
| MySQL | 8.0 | [mysql.com](https://dev.mysql.com/downloads/installer/) |
| SQL Server Express | 2022 | [microsoft.com](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) |
| MongoDB Atlas | Cloud | [mongodb.com](https://www.mongodb.com/atlas) |
| VS Code | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

### Verify Installation

```bash
java -version        # should show 21
mvn -version         # should show 3.9.x
dotnet --version     # should show 8.x
node -v              # should show v20.x
npm -v               # should show 10.x
mysql --version      # should show 8.x
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eventzen-capstone.git
cd eventzen-capstone
```

### 2. Configure User Service

Open `services/user-service/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eventzen_users?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=eventzen_super_secret_key_2024_make_it_long
jwt.expiration=86400000
server.port=8080
```

> Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

### 3. Configure Event Service

Open `services/event-service/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=eventzen_events;Trusted_Connection=True;TrustServerCertificate=true"
  }
}
```

### 4. Configure Booking Service

Open `services/booking-service/.env`:

```
PORT=3000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/eventzen_bookings?retryWrites=true&w=majority
JWT_SECRET=eventzen_super_secret_key_2024_make_it_long
```

> Replace with your MongoDB Atlas connection string.

### 5. Configure API Gateway

Open `api-gateway/.env`:

```
PORT=8000
USER_SERVICE=http://localhost:8080
EVENT_SERVICE=http://localhost:5096
BOOKING_SERVICE=http://localhost:3000
```

### 6. Configure Frontend

Open `frontend/lib/axios.js` — all three APIs point to the gateway:

```javascript
const GATEWAY = 'http://localhost:8000';

const userApi    = axios.create({ baseURL: GATEWAY });
const eventApi   = axios.create({ baseURL: GATEWAY });
const bookingApi = axios.create({ baseURL: GATEWAY });
```

### 7. Install Dependencies

```bash
# Booking service
cd services/booking-service
npm install

# API Gateway
cd ../../api-gateway
npm install

# Frontend
cd ../frontend
npm install
```

---

## Running the Application

Open **5 separate terminals** and run each command. Start them in this order and wait for each to be ready before starting the next.

### Terminal 1 — User Service

```bash
cd services/user-service
mvn spring-boot:run
```

**Ready when you see:**
```
Started UserServiceApplication in X seconds
Tomcat started on port 8080
```

### Terminal 2 — Event Service

```bash
cd services/event-service
dotnet run
```

**Ready when you see:**
```
Now listening on: http://localhost:5096
```

### Terminal 3 — Booking Service

```bash
cd services/booking-service
npm run dev
```

**Ready when you see:**
```
Booking service running on port 3000
MongoDB connected successfully
```

### Terminal 4 — API Gateway

```bash
cd api-gateway
npm run dev
```

**Ready when you see:**
```
API Gateway running on port 8000
```

### Terminal 5 — Frontend

```bash
cd frontend
npm run dev
```

**Ready when you see:**
```
Local: http://localhost:3001
```

### Access the Application

Open your browser and go to:

```
http://localhost:3001
```

### Verify Services are Running

| Service | URL | Expected Response |
|---|---|---|
| Frontend | `http://localhost:3001` | EventZen home page |
| Gateway health | `http://localhost:8000/health` | JSON status object |
| Event Swagger | `http://localhost:5096/swagger` | Swagger UI page |
| Booking health | `http://localhost:3000/health` | `{ status: "ok" }` |

---

## Testing

### User Service (Spring Boot — JUnit 5 + Mockito)

```bash
cd services/user-service
mvn test
```

Test file location: `src/test/java/com/eventzen/userservice/UserServiceTest.java`

**Tests cover:**
- Registration fails when email already exists
- Login fails when user not found
- Profile retrieval returns correct user

### API Testing with Postman

Import these requests into Postman to test the full flow through the gateway:

**Register:**
```
POST http://localhost:8000/api/users/register
Body: { "name": "Test", "email": "test@test.com", "password": "pass123", "role": "CUSTOMER" }
```

**Login:**
```
POST http://localhost:8000/api/users/login
Body: { "email": "test@test.com", "password": "pass123" }
```

**Get all events:**
```
GET http://localhost:8000/api/events
```

**Create event (vendor):**
```
POST http://localhost:8000/api/events
Headers: Authorization: Bearer <token>
Body: { "title": "Music Fest", "venue": "Mumbai", "eventDate": "2026-06-01T18:00:00", "ticketPrice": 500, "capacity": 200, "budget": 50000, "category": "Music", "vendorId": 2, "vendorName": "Vendor Name" }
```

**Book event (customer):**
```
POST http://localhost:8000/api/bookings
Headers: Authorization: Bearer <token>
Body: { "customerId": "1", "customerName": "Test", "customerEmail": "test@test.com", "eventId": "1", "eventTitle": "Music Fest", "vendorId": "2", "ticketCount": 2, "totalAmount": 1000 }
```

---

## User Roles

### Customer

- Register and login
- Browse all available events
- Search events by name, category, venue
- View event details and book tickets
- View own booking history with status
- Cancel bookings
- Update profile image

### Vendor

- Register and login
- Create events with full details (title, description, venue, date, price, capacity, budget, category, image)
- View list of own events
- See who booked their events
- Track budget per event — total budget, spent, revenue
- Add expenses to event budget

### Admin

- Login only (registration not allowed — account created directly in database)
- View all users with their roles
- View all events including inactive ones
- View all bookings across the platform
- View platform-wide financial summary

**Creating the admin account:**

```sql
-- Run in MySQL after starting user-service
USE eventzen_users;

INSERT INTO users (name, email, password, role, image_url)
VALUES (
  'Admin',
  'admin@eventzen.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhu1',
  'ADMIN',
  NULL
);
```

Admin credentials:
- **Email:** `admin@eventzen.com`
- **Password:** `password123`

---

## Features

### Security

- Passwords hashed with BCrypt before storage — plain-text passwords never saved
- JWT tokens expire after 24 hours (86400000 ms)
- Protected routes redirect to login if no token present
- Role checking on all dashboards — wrong role redirects to login
- CORS enabled on all services and gateway

### Data Flow

```
1. User submits login form on frontend (localhost:3001)
2. Frontend sends POST to gateway (localhost:8000/api/users/login)
3. Gateway proxies request to User Service (localhost:8080)
4. User Service verifies credentials, generates JWT
5. JWT returned to frontend through gateway
6. Frontend stores token in localStorage
7. All subsequent requests include Bearer token in Authorization header
8. Gateway forwards token to downstream services
```

### API Gateway Routing

```
Request: POST /api/users/register
Gateway: forwards to http://localhost:8080/api/users/register

Request: GET /api/events
Gateway: forwards to http://localhost:5096/api/events

Request: POST /api/bookings
Gateway: forwards to http://localhost:3000/api/bookings
```

---

## Swagger UI

The Event Service (.NET) includes built-in Swagger documentation. While the event service is running:

```
http://localhost:5096/swagger
```

This shows all event endpoints with the ability to test them directly from the browser — no Postman required for the event service.

---

## Port Reference

| Service | Port |
|---|---|
| Frontend (Next.js) | 3001 |
| API Gateway | 8000 |
| User Service (Spring Boot) | 8080 |
| Event Service (.NET) | 5096 |
| Booking Service (Node.js) | 3000 |
| MySQL | 3306 |
| SQL Server | 1433 |
| MongoDB Atlas | Cloud |

---

## Troubleshooting

| Error | Likely Cause | Fix |
|---|---|---|
| `mvn: command not found` | Maven not in PATH | Add Maven bin folder to system PATH |
| `Communications link failure` | MySQL not running | Start MySQL80 service from Windows Services |
| `Cannot open database` | SQL Server not running | Start SQL Server (SQLEXPRESS) from Windows Services |
| `MongoDB connection error` | IP not whitelisted | Add `0.0.0.0/0` in MongoDB Atlas Network Access |
| `404 Not Found` on gateway | Service not running | Check all 4 backend terminals are running |
| `Module not found: axios` | Dependency not installed | Run `npm install axios` in frontend folder |
| `port already in use` | Another process on same port | Run `npx kill-port PORT_NUMBER` |
| Next.js page 404 | Cache issue | Delete `.next` folder and restart frontend |

---

## Project Summary

| Item | Detail |
|---|---|
| Architecture | Microservices |
| Number of services | 5 (User, Event, Booking, Gateway, Frontend) |
| Number of databases | 3 (MySQL, SQL Server, MongoDB) |
| Number of API endpoints | 21 total across all services |
| Frontend pages | 10 pages |
| User roles | 3 (Customer, Vendor, Admin) |
| Authentication | JWT (stateless) |
| Backend languages | Java, C#, JavaScript |
| Frontend framework | Next.js 14 + Tailwind CSS |

---

<div align="center">

Built as a Capstone Project demonstrating Microservices Architecture with multiple backend technologies.

**EventZen** — Plan. Manage. Experience.

</div>
