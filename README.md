**🔗 Live Demo:** [https://recruits.sokoni.africa/](https://recruits.sokoni.africa/)


# Research_Gears_Recruits

Welcome to **Research_Gears_Recruits**, the ultimate playground for tech enthusiasts who love to tinker, hack, and innovate. This repo is based on **Sokoni Africa**, and it's your sandbox to inspect, break, fix, and reimagine a full-stack marketplace app.

---

## Objective

Your mission (should you choose to accept it):

1. **Peek Under the Hood**

   * Explore the codebase, get to know the architecture, and understand the magic behind the scenes.

2. **Spot the Flaws**

   * Hunt for bugs, performance bottlenecks, and security loopholes.
   * Make notes like a true code detective.

3. **Upgrade, Rebuild, or Innovate**

   * Refactor, optimize, or totally reinvent modules.
   * Migrate old-school code to modern frameworks.
   * Build your own version and make it stand out.

4. **Plug in Your Own APIs**

   * The existing backend is hosted on a VPS with a sandbox/sample API.
   * Use any tech stack for frontend.
   * Document your API integration with realistic terminal examples.

5. **Document Your Work**

   * Log all changes, fixes, and upgrades.
   * Provide setup instructions, demos, and bash scripts to automate tasks.

---

## About Sokoni Africa

A vibrant marketplace connecting wholesalers, retailers, and customers. Key features:

* Live product events
* Warehouse and inventory management
* Delivery tracking
* Admin dashboards

Full-stack experience included.

---

## Getting Started

### Prerequisites

* Node.js & npm / Yarn (or any frontend stack)
* PostgreSQL / MySQL / SQLite (or any database)
* Git
* Postman / API tool
* Bash shell

### Bash Automation Scripts with Realistic Terminal Examples

#### 1. Clone and Setup Repo

```bash
$ git clone https://github.com/your-org/Research_Gears_Recruits.git
Cloning into 'Research_Gears_Recruits'...
done.
$ cd Research_Gears_Recruits
$ bash ./scripts/setup.sh
Installing frontend dependencies...
Setting up environment variables...
Setup complete!
```

#### 2. Start Frontend

```bash
$ bash ./scripts/start-frontend.sh
Starting frontend server...
Compiled successfully.
Local: http://localhost:3000
```

#### 3. Run Tests

```bash
$ bash ./scripts/test.sh
Running unit tests...
All tests passed.
Running integration tests...
All integration tests passed.
Running API tests...
All API endpoints responded correctly.
```

#### 4. Build for Production

```bash
$ bash ./scripts/build.sh
Building frontend...
Frontend build completed.
Production build ready in /dist
```

#### 5. API Demo Requests

```bash
$ bash ./scripts/api-demo.sh
# GET /products
{
  "products": [
    {"id":1,"name":"Apple","price":100},
    {"id":2,"name":"Banana","price":50}
  ]
}

# POST /orders
{
  "order_id":12345,
  "status":"success",
  "message":"Order created successfully"
}
```

---

## Tasks for Recruits

* Explore the codebase and hunt for weak spots.
* Document every flaw or bottleneck.
* Build or upgrade custom API integrations.
* Refactor, enhance, or revamp modules.
* Automate tasks with bash scripts for setup, testing, building, and API demos.
* Submit your functional version with full reports and scripts.

### Expected Outcomes

* Fully working Sokoni Africa frontend with your API integrations.
* Realistic bash scripts for setup, testing, building, and API demos.
* Documentation of all enhancements and technical decisions.

---

## Contributing Guidelines

* Write clean, secure, performant code.
* Keep APIs documented and automated with scripts.
* Enhance UX/UI.
* Test, document, and comment your code.


# Sokoni Africa FastAPI Endpoints Documentation

This document provides the list of endpoints, required parameters, request body examples, and responses for the Sokoni Africa FastAPI backend.

---

## Authentication Endpoints

### 1. **Authenticate User**

**POST** `/authenticate`

**Body Parameters:**

```json
{
  "auth_type": "email" | "phone",
  "auth_by": "user_email_or_phone",
  "OTP": "optional_for_phone",
  "referee": "optional_referral_code"
}
```

**Response:**

```json
{
  "status": "success",
  "id": "user_id",
  "___access_token": "access_token",
  "___refresh_token": "refresh_token",
  "new": true/false,
  "role": "user_role"
}
```

---

### 2. **Verify Token**

**POST** `/verify_token`

**Body Parameters:**

```json
{
  "token": "jwt_token"
}
```

**Response:**

```json
"user_id"
```

### 3. **Refresh Token**

**POST** `/refresh_token`

**Body Parameters:**

```json
{
  "___refresh_token": "refresh_token"
}
```

**Response:**

```json
{
  "___access_token": "new_access_token",
  "token_type": "bearer"
}
```

### 4. **Logout User**

**POST** `/logout`

**Response:**

```json
{
  "status": "success"
}
```

---

## User Management Endpoints

### 5. **Get User Profile**

**POST** `/get_user_profile`

**Body Parameters:**

```json
{
  "id": "user_id"
}
```

**Response:**

```json
{
  "status": "success",
  "id": "user_id",
  "data": {"user_data_here"}
}
```

### 6. **Update User**

**POST** `/update_user`

**Body Parameters:**

```json
{
  "id": "user_access_token",
  "data": {
    "username": "new_username",
    "location": [latitude, longitude],
    "role": "client|supplier",
    ...
  }
}
```

**Response:**

```json
{
  "status": "success",
  "id": "user_id",
  "data": {"updated_user_data"}
}
```

### 7. **Add User Location**

**POST** `/add_user_location`

**Body Parameters:**

```json
{
  "id": "access_token",
  "location": {
    "title": "Home",
    "coordinates": [latitude, longitude],
    "address": "optional_address"
  }
}
```

**Response:**

```json
{
  "status": "success",
  "locations": [list_of_locations]
}
```

### 8. **Get User Locations**

**POST** `/get_user_locations`

**Body Parameters:**

```json
{
  "id": "access_token"
}
```

**Response:**

```json
[{
  "title": "Home",
  "coordinates": [latitude, longitude],
  "address": "Address"
}]
```

---

## File Management Endpoints

### 9. **Upload File**

**POST** `/upload`

**Body Parameters (Multipart):**

* `file`: File to upload

**Body Parameters (Base64 JSON):**

```json
{
  "filename": "file_name.ext",
  "file": "data:image/png;base64,...."
}
```

**Response:**

```json
{
  "status": "success",
  "filename": "file_name.ext",
  "size": file_size
}
```

### 10. **Get Uploaded File**

**GET** `/sokoni_uploads/{img_name}`

**Response:**

* Returns the file content if exists.
* 404 if not found.

---

## Notification Endpoints

### 11. **Register FCM Token**

**POST** `/notifications/register_token`

**Body Parameters:**

```json
{
  "id": "access_token",
  "token": "fcm_token"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "FCM token registered"
}
```

### 12. **Broadcast Notification**

**POST** `/notifications/broadcast`

**Body Parameters:**

```json
{
  "title": "Notification Title",
  "body": "Notification Body",
  "data": {"optional": "payload"}
}
```

**Response:**

```json
{
  "status": "success",
  "success_count": 10,
  "failure_count": 0
}
```

---

## Messaging Endpoints

### 13. **Send Message**

**POST** `/send_message`

**Body Parameters:**

```json
{
  "from": "access_token",
  "to": "recipient_user_id",
  "message": "text_message_content"
}
```

**Response:**

```json
{
  "status": "success",
  "message_id": "message_id"
}
```

### 14. **Get Conversation**

**POST** `/get_conversation`

**Body Parameters:**

```json
{
  "id": "access_token",
  "target_id": "recipient_user_id"
}
```

**Response:**

```json
{
  "status": "success",
  "messages": [list_of_messages]
}
```

---

## Product & Order Endpoints

### 15. **Create Product**

**POST** `/create_product`

**Body Parameters:**

```json
{
  "id": "access_token",
  "data": {
    "name": "product_name",
    "price": 1000,
    "category": "category_name",
    "stock": 50
  }
}
```

**Response:**

```json
{
  "id": "product_id",
  "name": "product_name",
  ...
}
```

### 16. **Get Products**

**POST** `/get_products`

**Response:**

```json
[ list_of_products ]
```

### 17. **Checkout Data**

**POST** `/checkout_data`

**Body Parameters:**

```json
{
  "id": "access_token",
  "data": [
    {"host": {"id": "host_id"}, "product_id": "pid", "quantity": 1}
  ]
}
```

**Response:**

```json
{
  "total": total_amount,
  "distances": [distances_to_hosts]
}
```

### 18. **Place Order**

**POST** `/place_order`

**Body Parameters:**

```json
{
  "id": "access_token",
  "cart": [ {"host": {...}, "product_id": ..., "quantity": ...} ],
  "location_index": 0
}
```

**Response:**

```json
{
  "status": "success",
  "order_id": [list_of_order_ids]
}
```

---

This README covers the core endpoints for authentication, user management, file management, notifications, messaging, and product/order management.

---

**Note:** All endpoints requiring authentication expect a valid JWT token either in the body as `id` or in `Authorization` header for certain endpoints.


---

## License

Internal training and research only. Respect IP rules.

---

## Need Help?

Ask your supervisor or mentor, but remember, figuring it out is part of the learning process.

---

*Inspect, break, build, automate, and improve.*


