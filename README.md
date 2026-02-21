This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

---

# 📄 API Contract – User Navigation (Access Pages)

## 📌 Purpose

The backend must return the **navigation structure (menu + submenus)** that a logged-in user is allowed to access.

- The backend determines permissions based on the user’s role (e.g., `STAFF`, `COMPANY_ADMIN`, `PLATFORM_ADMIN`).
- The frontend will render **exactly what is returned**.
- **No additional filtering** will be performed on the frontend.

---

# ✅ Response Format

The API must return a **JSON array of navigation sections**.

Each section represents a top-level menu group and contains a list of accessible pages.

## Response Structure

```json
[
  {
    "group": "string",
    "items": [
      {
        "key": "string",
        "label": "string",
        "href": "string"
      }
    ]
  }
]
```

---

## Field Definitions

### Navigation Section

| Field   | Type   | Required | Description                         |
| ------- | ------ | -------- | ----------------------------------- |
| `group` | string | ✅       | Name of the top-level menu group    |
| `items` | array  | ✅       | List of accessible navigation items |

### Navigation Item

| Field   | Type   | Required | Description                            |
| ------- | ------ | -------- | -------------------------------------- |
| `key`   | string | ✅       | Unique, stable identifier for the page |
| `label` | string | ✅       | Display name shown in the UI           |
| `href`  | string | ✅       | Frontend route path                    |

---

# 📦 Example – Staff User Response

If the user role is `STAFF`, the backend may return:

```json
[
  {
    "group": "Home",
    "items": [{ "key": "home", "label": "Home", "href": "/" }]
  },
  {
    "group": "Workforce",
    "items": [
      { "key": "profile", "label": "Profile", "href": "/profile" },
      { "key": "mySchedule", "label": "My Schedule", "href": "/my-schedule" }
    ]
  },
  {
    "group": "About",
    "items": [{ "key": "about", "label": "About", "href": "/about" }]
  }
]
```

### Notes

- No **Clients** group
- No admin-only links
- Only pages the user is allowed to access are returned

---

# 📦 Example – Admin User Response

```json
[
  {
    "group": "Home",
    "items": [{ "key": "home", "label": "Home", "href": "/" }]
  },
  {
    "group": "Workforce",
    "items": [
      { "key": "profile", "label": "Profile", "href": "/profile" },
      { "key": "company", "label": "Company", "href": "/company" },
      {
        "key": "viewEmployees",
        "label": "View Employees",
        "href": "/employees"
      },
      {
        "key": "loginEmployees",
        "label": "Login Employees",
        "href": "/employees/login"
      }
    ]
  },
  {
    "group": "Clients",
    "items": [
      { "key": "clients", "label": "Clients", "href": "/clients" },
      { "key": "quoteClient", "label": "Quote Client", "href": "/quoteClient" },
      {
        "key": "employeeSchedules",
        "label": "Employee Schedules",
        "href": "/employeeSchedules"
      }
    ]
  },
  {
    "group": "About",
    "items": [{ "key": "about", "label": "About", "href": "/about" }]
  }
]
```

---

# ⚠️ Important Requirements

### 1️⃣ No Trailing Commas

The response must be valid JSON.

### 2️⃣ `href` Must Match Frontend Routes

Examples:

- `/profile`
- `/employees/login`
- `/clients`

### 3️⃣ Only Return Allowed Pages

The backend must:

- Determine the user’s role
- Return only accessible groups and pages
- Omit disallowed pages completely

The frontend will **not** apply additional permission filtering.

---

# 🧠 Backend Responsibility Summary

- Authenticate user via JWT
- Determine role/permissions
- Build navigation structure dynamically
- Return only allowed items
- Ensure valid JSON response

---
