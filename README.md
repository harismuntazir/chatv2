# Payload Chat System

A complete real-time chat solution built with Payload CMS, Socket.IO, and Next.js.

## Features

- **Real-time Chat**: Powered by a standalone Socket.IO server.
- **Role-Based Access Control (RBAC)**: Admin, Support, and Candidate roles.
- **Support Dashboard**: Dedicated interface for support agents to manage conversations. Includes search functionality to find and message candidates.
- **Candidate Widget**: Responsive chat widget for candidates to contact support. (Hidden for Admin/Support users).
- **Modern UI**: Built with Tailwind CSS and responsive design.

## Prerequisites

- Node.js (v18+)
- pnpm
- MongoDB (running locally on `mongodb://127.0.0.1:27017`)

## Installation

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Install Socket Server Dependencies**:
    ```bash
    cd socket-server
    pnpm install
    cd ..
    ```

## Environment Setup

Ensure you have a `.env` file in the root directory with the following:

```env
DATABASE_URI=mongodb://127.0.0.1/chatv2
PAYLOAD_SECRET=YOUR_SECRET_KEY
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:38120
SOCKET_PORT=38120
```

## Database Seeding

Populate the database with roles and default users:

```bash
pnpm run seed
```

This will create:
- **Roles**: Admin, Support, Candidate
- **Users**:
    - **Admin**: `admin@test.com` / `password`
    - **Support**: `support@test.com` / `password`
    - **Candidate**: `candidate@test.com` / `password`

## Running the Application

You need to run both the Payload CMS (Next.js) and the Socket Server.

1.  **Start Socket Server** (Terminal 1):
    ```bash
    cd socket-server
    pnpm start
    ```
    *Runs on port 38120*

2.  **Start Payload CMS** (Terminal 2):
    ```bash
    pnpm dev
    ```
    *Runs on http://localhost:3000*

## Usage Guide

### 1. Admin Panel
- **URL**: `http://localhost:3000/admin`
- **Login**: `admin@test.com` / `password`
- **Actions**: Manage users, roles, and view all collections.

### 2. Support Dashboard
- **URL**: `http://localhost:3000/admin/support`
- **Login**: `support@test.com` / `password`
- **Actions**: 
    - View active conversations.
    - **Search Candidates**: Use the search bar to find candidates by email and start a new conversation.

### 3. Candidate Chat
- **URL**: `http://localhost:3000` (Home page)
- **Login**: `candidate@test.com` / `password`
- **Visibility**: The chat widget is **hidden** for Admin and Support users. Log in as a candidate (or use an incognito window) to see it.
- **Actions**: Click the chat bubble in the bottom-right corner to start a conversation.

## Troubleshooting

- **Socket Connection Failed**: Ensure the socket server is running (`pnpm start` in `socket-server`) and `NEXT_PUBLIC_SOCKET_URL` matches the port.
- **Login Issues**: If "Create First User" appears, re-run `pnpm run seed`.
