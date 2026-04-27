# Registration Page Documentation

## Overview

This page is used to create a new organization and its first administrative user.

When a user completes this form, the system sends the company details, admin user details, and department details to the backend registration API.

After successful registration, the user is redirected to the login page.

---

# File Purpose

This file handles:

* Company registration
* Admin user creation
* Primary department setup
* Form validation
* API submission
* Success and error handling
* Redirecting to login after success

---

# Main Technologies Used

* Next.js
* React
* useState
* useRouter
* Fetch API
* Reusable FormField component
* AuthLayout wrapper component

---

# Form Sections

The registration page is divided into 3 sections:

---

## 1. Organization Details

This section collects company information.

### Fields

* Company Code
* Company Name
* Industry Type (dropdown)
* Company Description

### Example

```text
Company Code: MCB-01
Company Name: MCB Technologies
Industry Type: Healthcare & Wellness
Description: Healthcare staffing company
```

---

## 2. Administrative User

This section creates the first system admin.

### Fields

* First Name
* Last Name
* Gender (dropdown)
* Email Address
* Phone Number

This user automatically gets the **Master Admin** role.

---

## 3. Primary Department

This section creates the first department for the company.

### Fields

* Department Name
* Department Description

### Example

```text
Department Name: Operations
Description: Handles daily business operations
```

---

# Important Constants

---

## GENDER_OPTIONS

This stores the dropdown values for gender.

```javascript
const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" }
];
```

---

## INDUSTRY_OPTIONS

This stores the dropdown values for Industry Type.

These values must match the backend database ENUM exactly.

Example:

```javascript
"Healthcare & Wellness"
"Education & Training"
"Security Guard"
```

If these values do not match the backend ENUM, registration will fail.

This is very important.

---

# Form State

The page uses this object to store all form values:

```javascript
const initialFormData = {
  companyCode: "",
  companyName: "",
  companyDescription: "",
  industryType: "",
  departmentName: "",
  departmentDescription: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  gender: "",
};
```

This is managed using:

```javascript
useState()
```

Example:

```javascript
const [formData, setFormData] = useState(initialFormData);
```

---

# handleChange()

## Purpose

Updates form values whenever the user types or selects something.

## Example

If the user types:

```text
Company Name = ABC Ltd
```

This function updates:

```javascript
formData.companyName
```

## Code

```javascript
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};
```

---

# validateForm()

## Purpose

Checks if required fields are filled before sending data to the backend.

## Current Validation Rules

* Company Code is required
* Company Name is required
* Industry Type must be selected
* Valid email is required

## Example Error

```text
Please select an Industry Type
```

This prevents bad requests from reaching the backend.

---

# handleSubmit()

## Purpose

Sends the form data to the backend API.

---

## Step-by-Step Flow

### Step 1

Prevent page refresh

```javascript
e.preventDefault()
```

---

### Step 2

Clear old messages

```javascript
setError("")
setSuccessMessage("")
```

---

### Step 3

Run validation

```javascript
validateForm()
```

If validation fails, stop immediately.

---

### Step 4

Send POST request

```javascript
fetch(...)
```

API endpoint:

```text
/mcbtt/api/timesheet/auth/register
```

Method:

```text
POST
```

Content type:

```text
application/json
```

Body:

```javascript
JSON.stringify(formData)
```

---

### Step 5

Handle response

### Success

Show:

```text
Registration successful!
```

Then redirect to:

```text
/login
```

after 2 seconds.

---

### Failure

Show backend error message like:

```text
Registration failed
```

or

```text
Company already exists
```

---

# FormField Component

This page uses a reusable component called:

```javascript
<FormField />
```

instead of writing normal HTML inputs repeatedly.

This makes the code cleaner and easier to maintain.

---

# Select Dropdown Important Note

To create a dropdown, use:

```jsx
as="select"
```

Example:

```jsx
<FormField
  label="Industry Type"
  as="select"
  options={INDUSTRY_OPTIONS}
/>
```

Do NOT use:

```jsx
type="select"
```

because this creates:

```html
<input type="select" />
```

which is wrong.

This was a common bug.

---

# Common Beginner Mistakes

---

## Mistake 1

Using:

```jsx
type="select"
```

instead of:

```jsx
as="select"
```

---

## Mistake 2

Changing Industry dropdown values so they no longer match backend ENUM values

This causes backend errors.

---

## Mistake 3

Forgetting:

```javascript
process.env.NEXT_PUBLIC_API_BASE_URL
```

which breaks API calls.

---

## Mistake 4

Assuming 401 Unauthorized means endpoint is broken

Usually it means authentication or permissions issue.

Not a routing problem.

---

# Final Result

After successful registration:

* Company is created
* Admin user is created
* Department is created
* User is redirected to login

This completes the onboarding process.

---

# Future Improvements

Recommended upgrades:

* Better email validation
* Password setup flow
* Loading spinner improvements
* Better mobile responsiveness
* Backend duplicate checking
* Success modal instead of plain message
* Form reset after success

These will improve user experience significantly.
