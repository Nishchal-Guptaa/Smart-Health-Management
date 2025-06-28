
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  User, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Plus,
  MessageCircle,
  Hospital
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ModuleCard from "@/components/ModuleCard";
import StatsSection from "@/components/StatsSection";
import AppointmentBooking from "@/components/AppointmentBooking";
import SymptomChecker from "@/components/SymptomChecker";
import TestBooking from "@/components/TestBooking";
import EmergencyServices from "@/components/EmergencyServices";

const Index = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    {
      id: "appointments",
      title: "Smart Appointment Scheduling",
      description: "AI-powered doctor discovery with real-time availability and surge pricing",
      icon: Calendar,
      color: "bg-blue-500",
      features: ["Dynamic Doctor Discovery", "AI Slot Optimization", "Smart Filters", "Automated Reminders"]
    },
    {
      id: "symptom-checker",
      title: "AI Symptom Checker",
      description: "Conversational chatbot for preliminary diagnosis and triage support",
      icon: MessageCircle,
      color: "bg-green-500",
      features: ["Conversational Chatbot", "Triage Support", "Test Recommendations", "Severity Prediction"]
    },
    {
      id: "test-booking",
      title: "Medical Test Booking",
      description: "Comprehensive test directory with transparent pricing and lab network",
      icon: Search,
      color: "bg-purple-500",
      features: ["1000+ Tests Available", "Transparent Pricing", "Nearest Labs", "At-Home Services"]
    },
    {
      id: "health-records",
      title: "Digital Medical Vault",
      description: "Secure cloud storage for all your medical records and AI-powered insights",
      icon: User,
      color: "bg-orange-500",
      features: ["Secure Cloud Storage", "One-Click Sharing", "AI Insights", "Vaccination Records"]
    },
    {
      id: "emergency",
      title: "Emergency e-Ambulance",
      description: "Live tracking with priority dispatch and hospital coordination",
      icon: Phone,
      color: "bg-red-500",
      features: ["Live GPS Tracking", "Priority Dispatch", "Hospital Coordination", "Real-time ETA"]
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case "appointments":
        return <AppointmentBooking onClose={() => setActiveModule(null)} />;
      case "symptom-checker":
        return <SymptomChecker onClose={() => setActiveModule(null)} />;
      case "test-booking":
        return <TestBooking onClose={() => setActiveModule(null)} />;
      case "emergency":
        return <EmergencyServices onClose={() => setActiveModule(null)} />;
      default:
        return null;
    }
  };

  if (activeModule) {
    return renderActiveModule();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-medical-gradient rounded-lg flex items-center justify-center">
                <Hospital className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
                MediFlow
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-medical-blue transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-medical-blue transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-medical-blue transition-colors">Contact</a>
              <Button className="medical-gradient text-white">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Core Modules Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-medical-lightBlue text-medical-blue">Core Modules</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of healthcare with our AI-powered modules designed to eliminate inefficiencies 
            and provide instant, data-driven medical assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              onClick={() => setActiveModule(module.id)}
            />
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-medical-lightBlue text-medical-blue">Technology</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600">
              Our platform leverages cutting-edge artificial intelligence to optimize healthcare delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
              <p className="text-gray-600">Advanced algorithms predict availability and optimize scheduling</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Language Processing</h3>
              <p className="text-gray-600">Conversational AI understands symptoms and provides accurate guidance</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-gray-600">Data-driven insights for optimal resource allocation and planning</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-medical-gradient rounded-lg flex items-center justify-center">
                  <Hospital className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MediFlow</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing healthcare through AI-powered automation and seamless patient care.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Appointment Scheduling</li>
                <li>Symptom Checking</li>
                <li>Test Booking</li>
                <li>Emergency Services</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 support@mediflow.com</p>
                <p>📞 1-800-MEDIFLOW</p>
                <p>📍 Healthcare Innovation Center</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MediFlow Smart Healthcare System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
