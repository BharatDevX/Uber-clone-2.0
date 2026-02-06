# API Documentation

## POST `/users/register`

### Description
Creates a new user account. Requires first name, last name, email, and password. Returns a JWT token and user details on success.

### Request

- **Endpoint:** `/users/register`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Required Fields

| Field      | Type   | Description                           |
|------------|--------|---------------------------------------|
| firstname  | String | Minimum 3 characters, required        |
| lastname   | String | Minimum 3 characters, required        |
| email      | String | Valid email, required, unique         |
| password   | String | Minimum 6 characters, required        |

#### Example Request Body

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Responses

#### Success

- **Status Code:** `201 Created`

```json
{
  "success": true,
  "user": {
    "_id": "64f1b2c3d4e5f6a7b8c9d0e1",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Account created successfully"
}
```

#### Validation Error

- **Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "firstname",
      "location": "body"
    }
  ]
}
```

#### Server Error

- **Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Error message details"
}
```

---

**Note:**  
- The password is securely hashed before storing.
- The returned JWT token can be used for authenticated requests.

---

## POST `/users/login`

### Description
Authenticates a user with email and password. Returns a JWT token and user details on success.

### Request

- **Endpoint:** `/users/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Required Fields

| Field    | Type   | Description                    |
|----------|--------|--------------------------------|
| email    | String | Valid email, required          |
| password | String | Minimum 6 characters, required |

#### Example Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Responses

#### Success

- **Status Code:** `200 OK`

```json
{
  "success": true,
  "user": {
    "_id": "64f1b2c3d4e5f6a7b8c9d0e1",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successfully"
}
```

#### Validation Error

- **Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### Authentication Error

- **Status Code:** `401 Unauthorized`

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### Server Error

- **Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Error message details"
}
```

---

**Note:**  
- The returned JWT token can be used for authenticated