import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, Calendar, Clock, MapPin, User, Search } from "lucide-react";



interface Doctor {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  specialization: string;
  license_number: string;
  years_of_experience: number;
  hospital_affiliation: string;
  clinic_address: string;
  consultation_fee: number;
  available_days: string;
  available_hours: string;
  created_at: string;
  updated_at: string;
}

const AppointmentBooking = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const SERVER_BASE_URL = "http://localhost:4000"; // update accordingly

  const specialties = [
    "Cardiology", "Neurology", "Dermatology", "Orthopedics", "Pediatrics", "Psychiatry"
  ];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      await fetch(`${SERVER_BASE_URL}/input/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty: selectedSpecialty,
          location: searchLocation
        })
      });

      const response = await fetch(`${SERVER_BASE_URL}/output/search`);
      const data = await response.json();
      if (response.ok) {
        setDoctors(data.doctors || []);
      } else {
        console.error("Output error:", data.error);
      }
    } catch (err) {
      console.error("Request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSpecialty || searchLocation) {
      fetchDoctors();
    }
  }, [selectedSpecialty, searchLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Smart Appointment Scheduling</h1>
            <p className="text-gray-600 mt-2">Find and book appointments with AI-powered doctor discovery</p>
          </div>
          <Button variant="outline" 
          onClick={() => window.location.href = "/"}
           className="flex items-center space-x-2">
            <ArrowUp className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>

        {/* Filters */}
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
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  placeholder="Enter location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort (coming soon)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="fee">Lowest Fee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Loading doctors...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-xl transition-all transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 text-center pt-4 font-bold text-gray-500">
                      {doctor.first_name[0]}{doctor.last_name[0]}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{doctor.first_name} {doctor.last_name}</CardTitle>
                      <CardDescription>{doctor.specialization}</CardDescription>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{doctor.gender}</Badge>
                        <Badge>{doctor.hospital_affiliation}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{doctor.years_of_experience} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{doctor.clinic_address}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        ${doctor.consultation_fee}
                      </div>
                      <div className="text-sm text-gray-500">
                        Available: {doctor.available_days}, {doctor.available_hours}
                      </div>
                    </div>
                    <Button className="medical-gradient text-white">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
