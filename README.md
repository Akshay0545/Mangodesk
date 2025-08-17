# 📝 Minutes-AI  
AI-Powered Transcript Summarization & Sharing

## 📌 Overview
**Minutes-AI** is a full-stack web application that generates concise, AI-powered summaries from meeting transcripts or uploaded text. The summaries can be stored, updated, and securely shared via email — making it easier for teams and individuals to consume large chunks of text in minutes.  

The goal is to automate **meeting minutes** and **report drafting**, reducing manual effort.

---

## 🚀 Features
- 🔑 **Secure Backend** with Node.js, Express, and MongoDB (Atlas)  
- 🤖 **AI-Powered Summarization** using Groq API (latest supported model)  
- 📩 **Email Sharing**: Send summaries directly to team members (with `nodemailer`)  
- 💾 **Save & Manage**: Store, update, and delete summaries in MongoDB  
- 🌍 **Deployable**: Works locally and deployed on [Render](https://render.com)  
- 🎨 **Frontend**: Minimal, fast React + Vite + TailwindCSS UI  

---

## 🛠️ Tech Stack
### **Frontend**
- React 19 (Vite bundler)
- Tailwind CSS
- Axios for API calls  

### **Backend**
- Node.js + Express  
- MongoDB Atlas (Mongoose ODM)  
- Nodemailer (Email service)  
- Groq API (LLM for summarization)  

### **Deployment**
- Render (Backend + Frontend hosting)  

---

## ⚙️ Approach & Process

### **1. Transcript → AI Summary**
- Users provide transcripts (meeting notes, documents, or raw text).  
- Backend sends transcript + prompt to Groq API.  
- AI generates a concise summary.  

### **2. Storage & Management**
- Each summary is stored in MongoDB with metadata:
  - Title
  - Content (AI summary)
  - Original transcript
  - Prompt used  
- Users can **edit, update, delete, or fetch** summaries anytime.  

### **3. Sharing**
- Users can share summaries via email.  
- Each shared summary generates a unique **tokenized link**.  
- Recipients receive only the **summary content** (no raw transcript).  

### **4. Deployment**
- **Frontend** is built with Vite → deployed via Render.  
- **Backend** is deployed on Render with environment variables.  
- MongoDB Atlas provides cloud database connection.  

---

## 📂 Project Structure
/frontend # React + Vite frontend
/backend # Node.js + Express backend
/routes # API routes
/models # Mongoose models
/controllers # Business logic
/utils # Email + AI service helpers



---

## 🔑 Environment Variables
Create a `.env` file in `/backend`:

```env
# Server
PORT=5000
NODE_ENV=development
PUBLIC_BASE_URL=https://<your-backend-domain>

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/MinutesAI
MONGO_DB_NAME=MinutesAI

# AI Service
GROQ_API_KEY=your_groq_key

# Email Service
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_FROM="Minutes-AI <your_email@gmail.com>"


▶️ Running Locally
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev


📧 Email Sharing
When a summary is shared:

The recipient gets an email from Minutes-AI with only the summary content.
No transcripts or JSON artifacts are included.

✅ Future Improvements
✅ Authentication & User Accounts
✅ Role-based access for teams
✅ File upload (PDF/DOCX → transcript → summary)
✅ Rich editor for summary formatting

👨‍💻 Author
Developed by Akshay Kashyap as an AI-powered productivity tool for automating meeting minutes.
