# VMS - Veterinary Management System

A comprehensive web application designed for managing veterinary clinics, including patient records, appointments, and inventory.
Link: https://fureverclinic.vercel.app/

## 🚀 Technologies Used

### Frontend
- **Framework:** [Nuxt 4](https://nuxt.com/) (Vue.js 3)
- **Styling:** [Vuetify 3](https://vuetifyjs.com/)
- **State Management:** Built-in Nuxt/Vue state management
- **Icons:** Material Design Icons (@mdi/font)

### Backend
- **Framework:** [Express](https://expressjs.com/) (Node.js)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Authentication:** JWT (JSON Web Tokens) with Cookie-parser
- **Email Service:** [Brevo](https://www.brevo.com/) (formerly Sendinblue)
- **Media Storage:** [Cloudinary](https://cloudinary.com/)
- **Caching/Queue:** [Redis](https://redis.io/) (ioredis)
- **Validation:** [Joi](https://joi.dev/)
- **Task Scheduling:** [Node-cron](https://www.npmjs.com/package/node-cron)

## 📁 Project Structure

```text
vms-nuxt/
├── api/                # Backend Express Application
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth and validation middleware
│   ├── models/         # MongoDB schemas (Mongoose-style)
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── index.js        # Entry point
├── web-app/            # Frontend Nuxt 4 Application
│   ├── app/            # Nuxt 3/4 app directory
│   │   ├── components/ # Reusable UI components
│   │   ├── layouts/    # Page layouts
│   │   ├── middleware/ # Client-side route guards
│   │   ├── pages/      # Application routes (Vue files)
│   │   └── types/      # TypeScript definitions
│   ├── public/         # Static assets
│   └── nuxt.config.ts  # Nuxt configuration
└── README.md           # Project Overview (This file)
```

## ✨ Features & Functionality

### Admin Dashboard
- **Overview:** Real-time statistics and summaries of clinic activities.
- **Appointment Management:** View, approve, or reschedule appointment requests.
- **Patient Records:** Maintain detailed history and medical records for animals.
- **Product Inventory:** Manage clinic supplies and products.
- **System Settings:** Configure clinic information and system parameters.

### User/Public Features
- **Booking System:** Easy-to-use interface for clients to request appointments.
- **Service Information:** Detailed view of available veterinary services.
- **Contact & About:** Information about the clinic and easy communication channels.

### Security & System
- **Authentication:** Secure login for administrators.
- **Automated Notifications:** Email confirmations and reminders via Brevo.
- **File Uploads:** Secure storage of records and images using Cloudinary.
- **Background Jobs:** Scheduled tasks for system maintenance and notifications.

## 🛠️ Setup Instructions

1. **Clone the repository.**
2. **API Setup:**
   - Navigate to `api/`.
   - Run `npm install`.
   - Configure `.env` based on `.env.example`.
   - Run `npm run dev`.
3. **Frontend Setup:**
   - Navigate to `web-app/`.
   - Run `yarn`. (Requires Node.js 18+)
   - Run `yarn dev`.
