# 🏥 Smart Health Management System (MediFlow)

A comprehensive, AI-powered healthcare management platform that revolutionizes patient care through intelligent appointment scheduling, symptom analysis, medical test booking, emergency services, and secure digital health records.

![MediFlow Platform](https://img.shields.io/badge/Platform-Healthcare-blue)
![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Supabase](https://img.shields.io/badge/Database-Supabase-purple)
![AI](https://img.shields.io/badge/AI-Gemini-orange)

## 🌟 Key Features

### 🤖 AI-Powered Healthcare Assistant
- **Intelligent Symptom Checker**: Conversational chatbot for preliminary diagnosis and triage support
- **Medical Report Analysis**: AI-powered analysis of lab reports and clinical notes
- **Smart Recommendations**: Personalized health insights and test suggestions

### 📅 Smart Appointment Scheduling
- **Dynamic Doctor Discovery**: AI-powered doctor search with real-time availability
- **Smart Slot Optimization**: Intelligent appointment scheduling with surge pricing
- **Specialty-based Filtering**: Find the right specialist for your needs

### 🧪 Medical Test Booking
- **1000+ Tests Available**: Comprehensive test directory with transparent pricing
- **Nearest Lab Network**: Find and book tests at nearby facilities
- **Result Tracking**: Real-time updates on test progress


### 🔐 Digital Medical Vault
- **Secure Cloud Storage**: HIPAA-compliant storage for all medical records
- **One-Click Sharing**: Easy sharing with healthcare providers
- **AI-Powered Insights**: Intelligent analysis of health trends
- **Vaccination Records**: Complete immunization history tracking

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom medical theme
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth

### Backend Services

#### Node.js Express Server (`backend/`)
- **Doctor Search API**: Intelligent doctor discovery with filters
- **Appointment Management**: Booking, scheduling, and management
- **File Upload System**: Secure document storage with Supabase
- **Vault Management**: Medical records storage and retrieval

#### Python FastAPI Server (`app/`)
- **AI Chatbot**: Gemini-powered medical assistant
- **PDF Parser**: Medical report analysis and data extraction
- **Clinical Note Parser**: Structured extraction of medical documents
- **Medical Data Processing**: Lab report interpretation

### Database & Storage
- **Primary Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage with signed URLs
- **Authentication**: Supabase Auth with role-based access
- **Real-time Features**: Supabase real-time subscriptions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Supabase account
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/smart-health-management.git
cd smart-health-management
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Backend Setup

#### Node.js Server
```bash
cd backend
npm install
cp .env.example .env
```

Add your environment variables to `backend/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=4000
```

#### Python Server
```bash
cd app
pip install -r requirement.txt
cp .env.example .env
```

Add your environment variables to `app/.env`:
```env
API_KEY_FP=your_gemini_api_key
```
`

### 5. Storage Setup
Create a storage bucket named `vault` in your Supabase project for medical document storage.

### 6. Run the Application

#### Start Frontend
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

#### Start Node.js Backend
```bash
cd backend
node login.js
```
Backend will be available at `http://localhost:4000`

#### Start Python Backend
```bash
cd app
uvicorn main:app --reload
```
Python API will be available at `http://localhost:8000`

## 📱 Usage Guide

### For Patients

1. **Registration & Login**
   - Create an account with your medical information
   - Complete your health profile with allergies and medical history

2. **Book Appointments**
   - Search for doctors by specialty and location
   - View real-time availability and book slots
   - Receive automated reminders

3. **Symptom Checker**
   - Describe your symptoms to the AI assistant
   - Get preliminary analysis and recommendations
   - Receive guidance on when to seek professional help

4. **Medical Test Booking**
   - Browse available tests with transparent pricing
   - Book tests at nearby labs or request home collection
   - Track test progress and receive results

5. **Digital Vault**
   - Upload and store medical documents securely
   - Share records with healthcare providers
   - Get AI-powered insights on your health trends

6. **Emergency Services**
   - Track number of Beds Available  
   - Automatic notification to emergency contacts
   - Real-time coordination with hospitals

### For Doctors

1. **Doctor Dashboard**
   - View upcoming appointments and patient information
   - Access patient medical records from the vault
   - Manage availability and consultation fees

2. **Patient Management**
   - Review patient history and test results
   - Access shared medical documents
   - Provide recommendations and follow-up care

## 🔧 API Endpoints

### Node.js Backend (`/api`)

#### Doctor Search
- `POST /input/search` - Search for doctors with filters
- `GET /output/search` - Get search results

#### Appointments
- `POST /appointments/book` - Book new appointment

#### File Management
- `POST /upload` - Upload medical documents
- `GET /files` - Get all files for current user
- `GET /files/user/:userId` - Get files for specific user (doctor access)
- `DELETE /delete/:id` - Delete file

### Python Backend (`/api`)

#### AI Services
- `POST /chat` - Chat with medical AI assistant
- `POST /analyze-report` - Analyze medical PDF reports
- `GET /ui` - Simple web interface for testing



## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
# Node.js backend
cd backend
npm test

# Python backend
cd app
pytest
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
npm run build
vercel --prod
```

### Backend Deployment (Railway/Render)
```bash
# Deploy Node.js backend
railway up

# Deploy Python backend
render deploy
```

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `API_KEY_FP`
- `PORT`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Write comprehensive tests
- Update documentation for new features
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- **Supabase** for backend infrastructure
- **Google Gemini** for AI capabilities
- **Shadcn/ui** for beautiful UI components
- **React Query** for state management
- **FastAPI** for high-performance Python backend

---

**Built with ❤️ for better healthcare** 