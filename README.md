# 🎯 WorkFlow Hub API

WorkFlow Hub is an enterprise-grade, high-performance SaaS backend built with **NestJS**, **TypeScript**, and **Prisma**. The platform architecture showcases advanced engineering design patterns, dual-token security perimeters, memory-streamed media pipelines, multi-tier caching grids, and fully decoupled event-driven background actions.

---

## 🛠️ Core Architecture & High-Performance Features

* **Decoupled Event-Driven Subsystems (`@nestjs/event-emitter`):** High-velocity actions (like task creation) respond to the client instantly (under ~50ms) by emitting asynchronous internal system events. Isolated background workers handle heavy downstream actions like SMTP mail delivery without blocking the primary HTTP request-response loop.
* **Multi-Tier Caching Layer (Redis):** Optimizes database read performance by caching frequent queries (like task lists) with automated TTL invalidation upon data mutation writes.
* **Memory-Streamed Cloud Infrastructure (Cloudinary & Multer):** File attachments are intercepted using multi-part form stream buffers and piped directly to cloud content delivery networks without writing messy, volatile temporary files to the host disk.
* **Global Request Telemetry Interceptor:** Injects automated microsecond profiling across 100% of active HTTP endpoints for absolute system execution observability.
* **Dual-Token Security Perimeter:** Implements rigid authentication tracking via passport-driven JSON Web Tokens (JWT) and custom operational Guards.

---

## 🏗️ Project Folder Structure

```text
src/
├── auth/                 # Multi-layered authentication & passport-jwt security
├── cache/                # Redis memory injection architecture and clients
├── common/
│   └── interceptors/    # Global execution telemetry & timing metrics
├── mailer/               # Decoupled SMTP handlers and async event workers
├── prisma/               # Database connectivity layer and multi-table mapping
├── project/              # Project scope routing controllers & services
├── storage/              # Memory-streamed cloud media management lines
├── task/                 # Core task tracking entities, attachments, and events
└── workspace/            # Multi-tenant workspace partitioning systems
🚦 Getting Started
📋 Prerequisites
Ensure you have the following environments installed locally on your development engine:

Node.js (v16.x or higher)

PostgreSQL Database Instance

Redis Server Instance

🔐 Environmental Configuration
Create a .env file in the root directory of your project workspace and populate it with your custom operational credentials:

Code snippet
# Application Core Runtime Engine Settings
PORT=3000

# Database Engine Connections (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/workflow_hub?schema=public"

# Multi-Tier Caching Memory Grid (Redis)
REDIS_HOST="localhost"
REDIS_PORT=6379

# Cryptographic Token Profiles (JWT)
JWT_SECRET="your_ultra_secure_long_signature_secret_hash"

# Memory-Streamed Media Providers (Cloudinary)
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Asynchronous Background Event Mailers (Mailtrap Testing Sandbox)
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT=2525
SMTP_USER="your_mailtrap_user_token"
SMTP_PASS="your_mailtrap_pass_token"
🚀 Local Execution Setup
Clone the project code asset repository locally.

Install the structural Node.js engine dependency maps:

Bash
npm install
Sync your active local PostgreSQL schema mappings with your Prisma engine models:

Bash
npx prisma db push
Fire up the NestJS active compilation watch loop development server:

Bash
npm run start:dev
🧪 Verifying Core Capabilities (Postman Guide)
1. Asynchronous Event-Driven Notifications
Endpoint: POST /project/:projectId/tasks

Authorization: Bearer Token (JWT)

Payload:

JSON
{
  "title": "Build production monitoring matrix",
  "description": "Integrate telemetry logging and automated alerting metrics",
  "priority": "URGENT",
  "status": "TODO",
  "assignedToId": "TARGET_USER_UUID"
}
Expected Behavior: Look at your application terminal console log immediately after dispatching. You will observe the global logging interceptor closing out the request metrics in a rapid ~45ms, immediately followed by the background event driver intercepting the action and processing the email worker dispatch!

2. Stream-Buffered Media Uploads
Endpoint: POST /tasks/:id/attachments

Body Type: form-data

Key: file (Change property type dropdown to File and upload any small image/document asset).