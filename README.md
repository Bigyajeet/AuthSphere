# AuthSphere — Production MERN Authentication Engine

AuthSphere is an end-to-end authentication system built on the MERN stack. It features multi-provider OAuth 2.0 (Google, GitHub, Meta/Facebook, LinkedIn), passwordless email OTP verification, local credential authentication, and SHA-256 cryptographic password reset flows.

---

## 🌐 Live Deployments

* **Frontend Application:** [https://authsph.netlify.app](https://authsph.netlify.app)
* **Backend REST API:** [https://authsphere-bobd.onrender.com](https://authsphere-bobd.onrender.com)
* **Database Cluster:** MongoDB Atlas

---

## 🏗️ Architecture Overview

```text
                       +-------------------------+
                       |    React 18 Frontend    |
                       |  (Netlify SPA Hosting)  |
                       +------------+------------+
                                    |
                    REST Requests / OAuth Handshakes
                                    |
                                    v
                       +-------------------------+
                       |   Node.js / Express API |
                       |     (Render Hosting)    |
                       +------------+------------+
                                    |
            +-----------------------+-----------------------+
            |                       |                       |
            v                       v                       v
     +--------------+       +---------------+       +---------------+
     | MongoDB Atlas|       | Nodemailer /  |       | OAuth Identity|
     |   Database   |       | Gmail SMTP    |       | Google/GH/FB/ |
     |              |       | (OTP & Reset) |       |   LinkedIn    |
     +--------------+       +---------------+       +---------------+
```

---

## ✨ Core Features

* **Multi-Provider OAuth 2.0 Integration:**
  * **Google:** Server-side token validation via `google-auth-library`.
  * **GitHub:** Authorization code flow with email API extraction.
  * **Facebook (Meta):** Graph API v23.0 handshake with fallback email handling.
  * **LinkedIn:** OpenID Connect profile and email resolution.
* **Passwordless Email OTP Login:** 6-digit random token delivery via Nodemailer with 10-minute expiry validation.
* **Cryptographic Password Recovery:** 32-byte pseudo-random tokens hashed using SHA-256 (`crypto`) with time-limited reset links.
* **Protected Routes & Session Guard:** Stateless JWT authentication (`jsonwebtoken`) with Axios authorization interceptors and `ProtectedRoute` navigation safeguards.
* **SPA Routing Stability:** Dynamic route preservation across browser refreshes via Netlify `_redirects` and `netlify.toml`.

---

## 📁 Repository Structure

```text
AuthSphere/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & reconnect logic
│   ├── controllers/
│   │   ├── auth.controllers.js   # OAuth, local auth, & password recovery
│   │   └── otp.controllers.js    # OTP generation & validation
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification middleware
│   ├── models/
│   │   └── user.model.js         # Mongoose User model & schema
│   ├── routes/
│   │   └── auth.routes.js        # API route declarations
│   ├── utils/
│   │   └── SendEmail.js          # Nodemailer SMTP transport helper
│   ├── .env                      # Production environment variables
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express app initialization & CORS rules
│
└── Frontend/
    ├── public/
    │   └── _redirects            # Netlify 200 rewrite rule for React Router
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx# Client-side auth route barrier
    │   ├── pages/
    │   │   ├── AuthPage.jsx      # Login and Registration interface
    │   │   ├── Dashboard.jsx     # Authenticated user dashboard
    │   │   ├── LoginOTP.jsx      # Passwordless OTP login page
    │   │   ├── ForgotPassword.jsx# Password recovery initiation view
    │   │   ├── ResetPassword.jsx # Password reset confirmation form
    │   │   ├── GithubSuccess.jsx # GitHub OAuth callback handler
    │   │   ├── FacebookSuccess.jsx# Facebook OAuth callback handler
    │   │   └── LinkedInSuccess.jsx# LinkedIn OAuth callback handler
    │   ├── services/
    │   │   └── api.js            # Central Axios client instance
    │   ├── App.jsx               # React Router DOM configuration
    │   └── main.jsx              # React DOM render entry
    ├── netlify.toml              # Netlify build configuration
    └── package.json              # Frontend dependencies
```

---

## ⚙️ Environment Variables

### Backend Configuration (`Backend/.env`)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=[https://authsph.netlify.app](https://authsph.netlify.app)
SERVER_URL=[https://authsphere-bobd.onrender.com](https://authsphere-bobd.onrender.com)

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Facebook (Meta) OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Nodemailer / Gmail SMTP
SMTP_SERVICE=gmail
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_google_app_password
```

### Frontend Configuration (`Frontend/.env`)

```env
VITE_API_BASE_URL=[https://authsphere-bobd.onrender.com](https://authsphere-bobd.onrender.com)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🚀 API Route Reference

| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Local credential login | Public |
| `GET` | `/api/auth/profile` | Retrieve current authenticated user | Private (Bearer Token) |
| `POST` | `/api/auth/sent-otp` | Generate & send email OTP | Public |
| `POST` | `/api/auth/verify-otp` | Validate OTP & issue JWT | Public |
| `POST` | `/api/auth/forgot-password` | Generate reset token & email reset link | Public |
| `POST` | `/api/auth/reset-password/:token` | Update password with SHA-256 token | Public |
| `POST` | `/api/auth/google-login` | Verify Google ID token & issue JWT | Public |
| `GET` | `/api/auth/github` | Redirect to GitHub OAuth dialogue | Public |
| `GET` | `/api/auth/github/callback` | Process GitHub code & redirect | Public |
| `GET` | `/api/auth/facebook` | Redirect to Facebook OAuth dialogue | Public |
| `GET` | `/api/auth/facebook/callback` | Process Facebook code & redirect | Public |
| `GET` | `/api/auth/linkedin` | Redirect to LinkedIn OAuth dialogue | Public |
| `GET` | `/api/auth/linkedin/callback` | Process LinkedIn code & redirect | Public |

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/your-username/AuthSphere.git](https://github.com/your-username/AuthSphere.git)
cd AuthSphere

# Install Backend dependencies
cd Backend
npm install

# Install Frontend dependencies
cd ../Frontend
npm install
```

### 2. Run Local Servers

```bash
# Terminal 1 - Backend (from /Backend)
npm run dev

# Terminal 2 - Frontend (from /Frontend)
npm run dev
```

---

## 📜 License

This project is licensed under the MIT License.