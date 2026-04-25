# Ekitsa Development Roadmap & Timeline

This plan outlines the steps to complete the remaining features for the Ekitsa platform. Based on a commitment of **2-3 hours per day**, the total estimated time to completion is approximately **18-22 days**.

## Remaining Features Breakdown

### 1. Doctor Portal & Dashboard
- **Goal:** Create a management interface for doctors.
- **Tasks:**
  - Implement `/doctor-dashboard` with daily appointment overview.
  - Create patient management view (history, notes).
  - Add profile management (qualifications, fees, availability).
- **Estimated Time:** 9-12 hours (~4 days)

### 2. Digital Prescription System
- **Goal:** Enable doctors to issue and store prescriptions.
- **Tasks:**
  - Create prescription templates (UI + Data Structure).
  - Implement "Save to Health Records" functionality.
  - Add Voice-to-Text assistance for doctors.
- **Estimated Time:** 6-8 hours (~3 days)

### 3. OCR for Health Records (Free Solution)
- **Goal:** Automatically extract data from uploaded images/PDFs using 100% free, client-side tools.
- **Tech Choice:** Use **Tesseract.js** (Standard open-source OCR that runs in the browser, requiring no API keys or server costs).
- **Tasks:**
  - Integrate Tesseract.js into the frontend.
  - Implement medication and test detection logic in [AddHealthRecordForm](file:///c:/project/React/lab-management/src/components/health/AddHealthRecordForm.tsx#44-342).
- **Estimated Time:** 5-7 hours (~2 days)

### 4. Admin Oversight (Labs & Doctors)
- **Goal:** Full administrative control using existing project infrastructure.
- **Tech Choice:** Leverage **Supabase Policies (RLS)** and the existing Admin dashboard to manage registrations without external tools.
- **Tasks:**
  - Implement Lab/Doctor registration approval workflow in Postgres.
  - Create platform-wide analytics for revenue and bookings.
- **Estimated Time:** 8-10 hours (~4 days)

### 5. Full Localization (i18n)
- **Goal:** Support multilingual UI using open-source libraries.
- **Tech Choice:** **react-i18next** (Industry standard, free and open-source).
- **Tasks:**
  - Extract string constants and implement the translation hook.
  - Implement language switcher in the Navbar.
- **Estimated Time:** 6-8 hours (~3 days)

### 6. Lab Owner Analytics & Live Notifications (Free Solution)
- **Goal:** Replace mock data and add real-time feedback.
- **Tech Choice:** **Supabase Realtime** (Included in your free tier) for notifications and standard SQL for analytics.
- **Tasks:**
  - Subscribe to database changes for real-time "New Booking" alerts.
  - Connect dashboard charts to live Supabase queries.
- **Estimated Time:** 6-8 hours (~3 days)

---

## Suggested 3-Week Timeline

| Week | Focus Area | Key Deliverables |
| :--- | :--- | :--- |
| **Week 1** | **Doctor Portal** | Doctor Dashboard, Appointment management, Patient history views. |
| **Week 2** | **Clinical Tools** | Digital Prescription system, OCR integration for health records. |
| **Week 3** | **Core Admin & Polish** | Admin approvals, Lab Owner analytics, Full Localization (i18n). |

---

## User Review Required

> [!NOTE]
> **Free Tech Stack:** We will use **Tesseract.js** for OCR and **Supabase Realtime** for notifications to ensure 0% external API costs.
