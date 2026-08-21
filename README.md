CareerTrack

CareerTrack is a full-stack career management platform that enables users to manage job applications, technical skills, certifications, career goals, and professional profiles through a centralized dashboard.

Key Features
Secure Authentication — User registration, login, logout, JWT-based sessions, password hashing, protected routes, and rate limiting.
Application Tracking — Manage job and internship applications with status tracking across the recruitment lifecycle.
Skills Management — Track technical skills, proficiency levels, and progress.
Goal Management — Create and track short-term and long-term career goals.
Certification Management — Maintain certifications, issuing organizations, dates, and certificate links.
Profile Management — Store and manage academic and professional information.
Multi-User Data Isolation — Enforces strict userId-based authorization so users can only access and modify their own data.
Cloud Database — Persistent data storage using MongoDB Atlas with indexed Mongoose schemas.
Responsive Dashboard — Modern responsive interface built with React and Tailwind CSS.
Tech Stack
Category	Technologies
Frontend	Next.js 15, React 19, TypeScript, Tailwind CSS
Backend	Next.js App Router, REST API Routes, Node.js
Database	MongoDB Atlas, Mongoose
Authentication	JWT, jose, bcryptjs
Security	HTTP-only Cookies, Middleware, Rate Limiting, User-level Authorization
Deployment	Vercel
Development	Git, GitHub, ESLint

Authentication is enforced through middleware and server-side session verification. All user-owned database operations are scoped to the authenticated user's userId, preventing unauthorized access to other users' data.

Engineering Highlights
Modular service-layer architecture separating business logic from API routes.
RESTful API design for all major application modules.
Indexed MongoDB schemas for efficient user-scoped queries.
Secure password storage using bcrypt hashing.
Stateless JWT authentication using HTTP-only cookies.
Server-side authorization and multi-user data isolation.
Input validation, sanitization, and authentication rate limiting.
Production build verified with zero compilation errors and warnings.
Deployed on Vercel with MongoDB Atlas as the production database.
