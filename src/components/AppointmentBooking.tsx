import { useEffect, useState } from "react";
import {
  Button,
} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUp,
  Calendar,
  MapPin,
  User,
  Search,
  X,
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

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
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");

  const SERVER_BASE_URL = "http://localhost:4000";
  const { userId } = useUserData();
  const patientId = userId;

  const specialties = [
    "Cardiology",
    "Neurology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
  ];

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      await fetch(`${SERVER_BASE_URL}/input/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty: selectedSpecialty,
          location: searchLocation,
        }),
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

  const bookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      doctor_id: selectedDoctor.id,
      patient_id: patientId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: "Scheduled",
      reason: "General Checkup",
      notes: notes,
    };

    try {
      const response = await fetch(`${SERVER_BASE_URL}/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Appointment booked successfully!");
        setSelectedDoctor(null);
      } else {
        alert(`Failed to book: ${result.error}`);
      }
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Smart Appointment Scheduling
            </h1>
            <p className="text-gray-600 mt-2">
              Find and book appointments with AI-powered doctor discovery
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex items-center space-x-2"
          >
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
                <label className="block text-sm font-medium mb-2">
                  Specialty
                </label>
                <Select
                  value={selectedSpecialty}
                  onValueChange={setSelectedSpecialty}
                >
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
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <Input
                  placeholder="Enter location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sort By
                </label>
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
              <Card
                key={doctor.id}
                className="hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 text-center pt-4 font-bold text-gray-500">
                      {doctor.first_name[0]}
                      {doctor.last_name[0]}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {doctor.first_name} {doctor.last_name}
                      </CardTitle>
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
                        Available: {doctor.available_days},{" "}
                        {doctor.available_hours}
                      </div>
                    </div>
                    <Button
                      className="medical-gradient text-white"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
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

      {/* Overlay Booking Form */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedDoctor(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <CardTitle className="text-xl mb-2">
              Book Appointment with Dr. {selectedDoctor.first_name}{" "}
              {selectedDoctor.last_name}
            </CardTitle>
            <CardDescription className="mb-4">
              Please fill in the appointment details
            </CardDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Appointment Date
                </label>
                <Input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Appointment Time
                </label>
                <Input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes (optional)
                </label>
                <Input
                  type="text"
                  placeholder="Any specific concerns?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setSelectedDoctor(null)}
              >
                Cancel
              </Button>
              <Button onClick={bookAppointment} className="medical-gradient text-white">
                Confirm Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentBooking;
