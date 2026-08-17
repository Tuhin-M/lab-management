# Ekitsa Healthcare & Lab Management Platform
## Project Overview & Unique Selling Propositions (USPs)

Ekitsa is a comprehensive, multi-role digital healthcare platform designed to bridge the gap between patients, doctors, and diagnostic laboratories. It provides a unified ecosystem where users can book consultations, manage health records, and seamlessly schedule and compare diagnostic tests.

---

## 🌟 Unique Selling Propositions (USPs)

1. **All-in-One Healthcare Ecosystem**
   Unlike standalone clinic management or lab booking apps, Ekitsa integrates the complete patient journey: from initial doctor consultation (telemedicine) to e-prescriptions, followed directly by diagnostic test comparison, booking, and result management.

2. **Smart OCR-Powered Health Records**
   The platform features an intelligent AI/OCR engine (powered by `tesseract.js`) that allows patients to upload images of physical prescriptions or lab reports. The system automatically extracts text and identifies prescribed medicines and tests, converting physical documents into structured digital health records.

3. **Transparent Lab Comparison Engine**
   Patients are empowered to make informed healthcare decisions. The platform features a dedicated "Compare Labs" tool that lets users evaluate diagnostic centers based on real-time pricing, discounts, turnaround times, and patient ratings before booking.

4. **Dedicated Portals for Service Providers**
   - **For Doctors**: A specialized dashboard to manage appointments, conduct tele-sessions via an integrated chat interface, and generate digital prescriptions (featuring digital signatures via `react-signature-canvas`).
   - **For Lab Owners**: A comprehensive business dashboard to track revenue, manage test catalogs, onboard facilities dynamically, and handle incoming patient test bookings.

5. **Hybrid Backend Architecture**
   Ekitsa utilizes a modern hybrid backend strategy. It leverages **Supabase** for robust authentication, real-time database capabilities, and secure media storage, alongside a secondary **Node.js/Express + MongoDB** backend for specialized REST API operations.

---

## 🚀 Core Features by Role

### 1. Patient Portal
- **Doctor Discovery & Booking**: Search for doctors by specialty, view ratings, and book physical or virtual appointments using an interactive calendar.
- **Telemedicine Consultations**: Integrated chat and virtual consultation interface to communicate securely with doctors.
- **Diagnostic Test Booking**: Browse test catalogs from various onboarded laboratories, view detailed parameters, and schedule home collections or lab visits.
- **Health Records Vault**: Centralized storage for past prescriptions, test reports, and OCR-extracted medical data.
- **Community Forum**: An interactive space for users to read health blogs, share experiences, and engage in community discussions.
- **Order Tracking**: Real-time status updates for booked appointments and lab tests (Scheduled, In-Progress, Completed).

### 2. Doctor Portal
- **Doctor Dashboard**: High-level overview of daily appointments, patient statistics, and recent activity.
- **Appointment Management**: View, accept, or reschedule patient bookings.
- **Digital Prescriptions**: Create structured e-prescriptions with digital signatures that patients can instantly view and use to book relevant lab tests.
- **Tele-Sessions**: Direct chat interface linked to specific patient appointments.

### 3. Lab Owner Portal
- **Business Analytics Dashboard**: Visual charts (powered by `recharts`) tracking total bookings, revenue, pending appointments, and overall lab performance.
- **Lab Onboarding Engine**: A seamless workflow to register new diagnostic facilities, upload facility images, and list accreditations.
- **Test Catalog Management**: Add and manage diagnostic tests with dynamic pricing, promotional discounts, sample types (Blood, Urine, Saliva), and detailed turnaround times.
- **Booking Fulfillment**: Manage incoming test bookings, update statuses, and process patient orders.

### 4. Admin Portal
- **System Oversight**: Global dashboard to monitor platform health, verify newly registered doctors and labs, and manage user roles.

---

## 🛠️ Technology Stack Highlights

- **Frontend**: React 18, TypeScript, Vite.
- **State Management**: Redux Toolkit & React Query (for optimized API caching).
- **UI/UX & Styling**: Tailwind CSS, Radix UI (Headless components), Framer Motion (micro-animations), Lucide Icons.
- **Forms & Validation**: React Hook Form paired with Zod schemas for strict data validation.
- **Backend Services**: 
  - **Supabase**: Authentication (Role-based), PostgreSQL Database, and Storage (for lab images and profile pictures).
  - **Express.js & MongoDB**: Secondary backend for complex data aggregation and specialized routing.
- **Specialized Integrations**:
  - `tesseract.js`: Optical Character Recognition for document parsing.
  - `react-big-calendar`: Interactive appointment scheduling.
  - `react-signature-canvas`: Digital signatures for medical prescriptions.
