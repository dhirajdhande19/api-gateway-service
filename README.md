# API Gateway with Advanced Rate Limiting

A backend **API Gateway** built using Node.js and Redis that implements **multiple rate limiting strategies** to protect downstream services from abuse, traffic spikes, and unfair usage.

This project was built to **deeply understand how rate limiting works internally**, not just how to use existing libraries.

---

## 🌍 Live Deployment

The API Gateway is deployed and publicly accessible.

**Base URL:** [https://api-gateway-service-vcmk.onrender.com/ping](https://api-gateway-service-vcmk.onrender.com/ping)  



> ⚠️ This deployment is for demonstration and learning purposes.  
> All downstream services are also deployed and accessed **only via the gateway**.

---

## 🚀 Features

- Centralized API Gateway
- Redis-backed rate limiting (distributed-safe)
- Supports **5 different rate limiting algorithms**
- Per-route rate limiting configuration
- Per-user and per-IP rate limiting
- Strategy-based, extensible design
- Gateway-first request interception
- Preserves real upstream HTTP status codes

---

## 🧠 Why This Project?

This project focuses on:

- Understanding **trade-offs between different rate limiting algorithms**
- Learning how **real API gateways** (Kong, Envoy, NGINX) reason about traffic
- Designing scalable backend infrastructure from scratch
- Handling real-world issues like:
  - reverse proxy behavior
  - service-to-service communication
  - production deployment quirks

---

## 🏗️ High-Level Architecture

```

Client
|
v
API Gateway
|
|-- Auth Middleware
|-- Rate Limiter (Strategy Based)
|
v
Downstream Services

````

- Every request passes through the gateway
- Rate limiting is applied **before forwarding**
- Requests are either:
  - rejected with **429 Too Many Requests**
  - or forwarded to the appropriate service

> 📌 Diagram: API Gateway  
> ![API Gateway](images/api-gateway.png)

---

## 🔐 Rate Limiting Strategy

- **Unauthenticated routes** → rate limited by **IP address**
- **Authenticated routes** → rate limited by **_id (userId)**
- Rate limiting algorithm is chosen **per route** via configuration

---

## ⚙️ Configuration Example

```js
export const RATE_LIMIT_CONFIG = {
  default: {
    algorithm: "leakyBucket",
    limit: 5,
    window: 60, // seconds
    refillRate: 5 / 60,
    leakRate: 5 / 60,
  },

  routes: {
    "/api/users": {
      algorithm: "fixed",
      limit: 2,
      window: 60,
      refillRate: 5 / 60,
      leakRate: 5 / 60,
    },

    "/api/orders": {
      algorithm: "tokenBucket",
      limit: 2,
      window: 60,
      refillRate: 6 / 60,
      leakRate: 5 / 60,
    },
  },
};
````

---

## 🧩 Supported Rate Limiting Algorithms

1. Fixed Window Counter
2. Sliding Window Log
3. Sliding Window Counter
4. Token Bucket
5. Leaky Bucket

👉 Detailed explanations are available in:
[`gateway/src/rate-limiter/README.md`](gateway/src/rate-limiter/README.md)

---

## 🛠️ Tech Stack

* **Node.js**
* **Express**
* **Redis**
* **ioredis**
* **Docker** (for local Redis)

---

## ⚡ Quick Test (2 Minutes)

You can test the gateway **without setting up anything locally**.

### Example Requests

```http

Authenticated routes:
GET /api/users
GET /api/users/:id
GET /api/orders
GET /api/orders/:id

Unauthenticated routes
GET /api/products
GET /api/products/:id
```

### Expected Behavior

* Requests within limit → **200 OK**
* Exceed rate limit → **429 Too Many Requests**
* Authenticated routes → rate-limited per **_id (userId)**
* Unauthenticated routes → rate-limited per **IP**

This allows quick verification of:

* Gateway routing
* Rate limiting behavior
* Downstream service forwarding

---

## 🧪 API Testing (Postman Collection)

A structured **Postman collection** is included to test:

* Direct service calls
* Gateway-based routing
* Rate limiting behavior
* Before vs After deployment comparison

### Collection Structure

* **Gateway**

  * Before Deploy
  * After Deploy

This clearly demonstrates:

* How requests behave without a gateway
* How the gateway enforces rate limits and routing

### Import Instructions

1. Open Postman
2. Click **Import**
3. Import the collection file from ./postman:

   ```
   postman/API_Gateway.postman_collection.json  
   ```

---

## ▶️ Running Locally

Create a `.env` file inside the `gateway/` directory:

```env
# Redirect URLs
USERS_BASE_URL=http://localhost:4001
ORDERS_BASE_URL=http://localhost:4002
PRODUCTS_BASE_URL=http://localhost:4003

# JWT
JWT_SECRET=your-jwt-secret

#PORT
PORT=3000

# Redis (if deploying else not needed)
REDIS_URL=your-redis-url 
```

### 1. Start Redis (Docker)

```bash
docker run -d --name redis -p 6379:6379 redis
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the gateway

```bash
npm run dev
```

---

## ⚠️ Notes on Production Usage

* Redis Lua scripts can be added for stronger atomicity guarantees
* Current implementation prioritizes **clarity and learning**
* Designed to be easily extended with:

  * API keys
  * User tiers
  * Dynamic limits from a database
  * Circuit breakers and retries

---

## 📌 Key Takeaways

* There is **no single “best” rate limiting algorithm**
* The right choice depends on:

  * traffic patterns
  * burst tolerance
  * accuracy vs memory trade-offs
* Real systems often support **multiple strategies**
* API gateways are critical for enforcing cross-cutting concerns centrally

---

## ✅ Status

* [x] Implemented multiple rate limiting algorithms
* [x] Distributed-safe Redis backing
* [x] Gateway-based routing
* [x] Production deployment
* [x] Postman collection for testing
