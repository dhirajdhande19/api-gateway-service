# API Gateway with Advanced Rate Limiting

A backend **API Gateway** built using Node.js and Redis that implements **multiple rate limiting strategies** to protect downstream services from abuse, spikes, and unfair usage.

This project was built to deeply understand **how rate limiting works internally**, not just how to use libraries.

---

## 🚀 Features

- Centralized API Gateway
- Redis-backed rate limiting (distributed-safe)
- Supports **5 different rate limiting algorithms**
- Per-route configuration
- Per-user and per-IP rate limiting
- Fail-open design (gateway remains available if Redis fails)
- Extensible strategy-based architecture

---

## 🧠 Why This Project?

This project focuses on:

- **Understanding tradeoffs** between different rate limiting algorithms
- Learning how **real API gateways** (Kong, Envoy, NGINX) reason about traffic
- Designing scalable, configurable backend infrastructure

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

- The gateway intercepts every request
- Rate limiting is applied **before** forwarding
- Requests are either rejected (429) or forwarded

> 📌 Diagram: API Gateway
![API Gateway](images/api-gateway.png)

---

## 🔐 Rate Limiting Strategy

- **Unauthenticated routes** → rate limited by **IP**
- **Authenticated routes** → rate limited by **_id (userId)**
- Algorithm is chosen **per route** via configuration

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

👉 Detailed explanations are available in
[`/rate-limiter/README.md`](gateway/src/rate-limiter/README.md)

---

## 🛠️ Tech Stack

* **Node.js**
* **Express**
* **Redis (via Docker)**
* **ioredis**

---

## ▶️ Running Locally

Create a `.env` file at root of `gateway/` folder like:
```.env
# Redirect URL's
USERS_BASE_URL='http://localhost:4001'
ORDERS_BASE_URL='http://localhost:4002'
PRODUCTS_BASE_URL='http://localhost:4003'

# JWT
JWT_SECRET="your-jwt-secret"
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

* Redis Lua scripts can be added later for strict atomicity
* Current implementation prioritizes **clarity and learning**
* Designed to be easily extended with:

  * API keys
  * user tiers
  * dynamic limits from DB

---

## 📌 Key Takeaways

* There is **no single “best” rate limiting algorithm**
* Choice depends on:

  * traffic pattern
  * burst tolerance
  * accuracy vs memory tradeoffs
* Real systems often support **multiple strategies**
