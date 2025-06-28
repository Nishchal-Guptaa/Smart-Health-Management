
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, Calendar, Clock, MapPin, User, Search } from "lucide-react";

interface AppointmentBookingProps {
  onClose: () => void;
}

const AppointmentBooking = ({ onClose }: AppointmentBookingProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      experience: "15 years",
      fee: "$150",
      surgeFee: "$180",
      distance: "2.3 km",
      nextSlot: "Today 3:30 PM",
      availability: "high",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      rating: 4.8,
      experience: "12 years",
      fee: "$200",
      surgeFee: "$250",
      distance: "1.8 km",
      nextSlot: "Tomorrow 10:00 AM",
      availability: "medium",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      rating: 4.9,
      experience: "10 years",
      fee: "$120",
      surgeFee: "$140",
      distance: "3.1 km",
      nextSlot: "Today 5:45 PM",
      availability: "low",
      image: "https://images.unsplash.com/photo-1594824483509-8f8c5a3f8e9b?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const specialties = ["Cardiology", "Neurology", "Dermatology", "Orthopedics", "Pediatrics", "Psychiatry"];

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Appointment Scheduling</h1>
            <p className="text-gray-600 mt-2">Find and book appointments with AI-powered doctor discovery</p>
          </div>
          <Button variant="outline" onClick={onClose} className="flex items-center space-x-2">
            <ArrowUp className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Find Your Doctor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty.toLowerCase()}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  placeholder="Enter your location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Nearest First</SelectItem>
                    <SelectItem value="fee">Lowest Fee</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="availability">Next Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">⭐ {doctor.rating}</Badge>
                      <Badge className={getAvailabilityColor(doctor.availability)}>
                        {doctor.availability} availability
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{doctor.distance}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{doctor.fee}</div>
                    <div className="text-sm text-red-600">Surge: {doctor.surgeFee}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{doctor.nextSlot}</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full medical-gradient text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Features Banner */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold mb-2">🤖 AI Optimization</div>
                <p className="text-blue-100">Smart slot prediction based on historical data</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">💰 Dynamic Pricing</div>
                <p className="text-blue-100">Real-time fee adjustment based on demand</p>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">📱 Smart Reminders</div>
                <p className="text-blue-100">Automated SMS/email alerts to reduce no-shows</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentBooking;
