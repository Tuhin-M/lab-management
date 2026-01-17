# Ekitsa Platform

A modern platform for lab owners, doctors, and patients to manage diagnostics, bookings, and health records.

---

## Technologies Used
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express.js (backend, in `server/`)
- MongoDB (via Mongoose)

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Environment Variables
Create a `.env` file in both the root and `server/` directories as needed. Example for backend:
```
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=http://localhost:5173
PORT=5000
```

### Install Dependencies
```sh
npm install
cd server && npm install
```

### Running the Backend
```sh
cd server
npm start
```

### Running the Frontend
```sh
npm run dev
```

### Building for Production
```sh
npm run build
```

### Health Check Endpoint
- The backend exposes `/health` which returns `{ status: "ok" }` for deployment readiness.

### Deployment Steps
1. Set up environment variables on your deployment platform (see above).
2. Build the frontend with `npm run build`.
3. Deploy the `dist/` folder to your static hosting (Netlify, Vercel, etc).
4. Deploy the backend (Express server) to your preferred platform (Render, Heroku, etc).
5. Ensure the backend can connect to MongoDB and the frontend can reach the backend API.

---

## Security & Best Practices
- Never commit `.env` or secrets to version control.
- All sensitive files are gitignored by default.
- CORS and error handling are centralized.
- All routes are protected by authentication/authorization where needed.

---

## Support
For questions or issues, please contact the Ekitsa Team.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cdb6c5f5-e0a8-485c-98f6-a82d324f8bf2) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
