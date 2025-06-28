
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, BellIcon, ShieldCheck, UsersIcon, StethoscopeIcon, ClockIcon } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f1fc] via-white to-[#e6fdf1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-medical-lightBlue text-medical-blue animate-fade-in">
              🚀 Next-Gen Healthcare Platform
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
              Smart Healthcare
              <span className="block bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Experience the future of healthcare with AI-driven appointment scheduling, disease prediction,
              medical test booking, and emergency services—all in one seamless platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="text-lg px-8 py-4 medical-gradient text-white hover:shadow-xl transition-all duration-300">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 hover:bg-gray-50">
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 text-center lg:text-left">
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-blue-600 text-3xl font-bold flex justify-center items-center gap-2">
                  <UsersIcon className="w-6 h-6" /> 50K+
                </div>
                <p className="text-gray-600 text-sm mt-1 text-center">Active Users</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-green-600 text-3xl font-bold flex justify-center items-center gap-2">
                  <StethoscopeIcon className="w-6 h-6" /> 1000+
                </div>
                <p className="text-gray-600 text-sm mt-1 text-center">Certified Doctors</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition">
                <div className="text-purple-600 text-3xl font-bold flex justify-center items-center gap-2">
                  <ClockIcon className="w-6 h-6" /> 24/7
                </div>
                <p className="text-gray-600 text-sm mt-1 text-center">Support</p>
              </div>
            </div>

          </div>

          {/* Right Content - Interactive Dashboard Preview */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-r from-medical-blue to-medical-green h-3 rounded-t-lg mb-4"></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Health Dashboard</h3>
                  <Badge className="bg-green-100 text-green-700">Online</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Upcoming Appointments</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-sm text-gray-600">Test Results Ready</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Health Score</span>
                    <span className="text-sm text-green-600">Excellent</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <Button className="w-full medical-gradient text-white">
                  View Full Dashboard
                </Button>
              </div>
            </div>

            {/* Floating Cards */}
            {/* Replace 🚨 with a notification alert */}
            {/* Notification icon with count */}
            <div className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-md hover:scale-105 transition animate-bounce">
              <div className="relative">
                <BellIcon className="text-red-500 w-6 h-6" />
                <span className="absolute -top-1 -right-1 text-white bg-red-500 rounded-full text-xs px-1">2</span>
              </div>
            </div>

            {/* Secure badge with tooltip */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-full shadow-lg p-3 animate-bounce">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="text-green-500 w-5 h-5" />
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce">
        <ArrowDown className="w-6 h-6 text-gray-400 mx-auto" />
        <p className="text-xs text-gray-500 mt-1">Scroll to explore features</p>
      </div>

    </section>
  );
};

export default HeroSection;
