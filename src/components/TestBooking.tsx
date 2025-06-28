import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Search } from "lucide-react";

// Make sure these custom colors are defined in your tailwind.config.js
// extend: {
//   colors: {
//     medical: {
//       lightBlue: '#e8f1fc',
//       blue: '#3b82f6', // Example blue, adjust as per your actual medical-blue
//       green: '#10b981', // Example green, adjust as per your actual medical-green
//     },
//   },
//   backgroundImage: {
//     'medical-gradient': 'linear-gradient(to right, #3b82f6, #10b981)', // Example gradient
//   }
// }

const specialties = [
  "Pathology",
  "Radiology",
  "Biochemistry",
  "Microbiology",
  "Genetics",
];

const mockTests = [
  {
    id: "1",
    test_name: "Complete Blood Count",
    category: "Pathology",
    lab_name: "HealthPlus Labs",
    fee: 500,
    distance_km: 2.5,
    experience_years: 10,
    location: "New Delhi",
    available_days: "Mon-Fri",
    available_hours: "9 AM - 5 PM",
  },
  {
    id: "2",
    test_name: "MRI Scan",
    category: "Radiology",
    lab_name: "ScanPro Diagnostics",
    fee: 3000,
    distance_km: 6.2,
    experience_years: 8,
    location: "Gurgaon",
    available_days: "Mon-Sat",
    available_hours: "10 AM - 6 PM",
  },
  {
    id: "3",
    test_name: "X-Ray Chest",
    category: "Radiology",
    lab_name: "Care Imaging Center",
    fee: 800,
    distance_km: 4.1,
    experience_years: 6,
    location: "Noida",
    available_days: "Tue-Sun",
    available_hours: "8 AM - 2 PM",
  },
  {
    id: "4",
    test_name: "Thyroid Profile",
    category: "Biochemistry",
    lab_name: "ThyroCare",
    fee: 600,
    distance_km: 3.3,
    experience_years: 12,
    location: "Faridabad",
    available_days: "Mon-Sat",
    available_hours: "9 AM - 7 PM",
  },
  {
    id: "5",
    test_name: "Liver Function Test",
    category: "Biochemistry",
    lab_name: "MedLife Labs",
    fee: 850,
    distance_km: 1.7,
    experience_years: 9,
    location: "New Delhi",
    available_days: "Mon-Fri",
    available_hours: "10 AM - 4 PM",
  },
  {
    id: "6",
    test_name: "Vitamin D Test",
    category: "Biochemistry",
    lab_name: "Dr. Lal PathLabs",
    fee: 1100,
    distance_km: 5.8,
    experience_years: 11,
    location: "Ghaziabad",
    available_days: "Mon-Sat",
    available_hours: "9 AM - 1 PM",
  },
  {
    id: "7",
    test_name: "Blood Sugar Test",
    category: "Pathology",
    lab_name: "Apollo Diagnostics",
    fee: 250,
    distance_km: 2.0,
    experience_years: 5,
    location: "Noida",
    available_days: "All Days",
    available_hours: "8 AM - 8 PM",
  },
  {
    id: "8",
    test_name: "CT Scan Abdomen",
    category: "Radiology",
    lab_name: "City Scan Center",
    fee: 4500,
    distance_km: 7.1,
    experience_years: 14,
    location: "Delhi NCR",
    available_days: "Mon-Sun",
    available_hours: "9 AM - 6 PM",
  },
  {
    id: "9",
    test_name: "Urine Routine Test",
    category: "Microbiology",
    lab_name: "SmartLab Diagnostics",
    fee: 300,
    distance_km: 3.5,
    experience_years: 4,
    location: "Gurgaon",
    available_days: "Mon-Fri",
    available_hours: "7 AM - 11 AM",
  },
  {
    id: "10",
    test_name: "HbA1c Test",
    category: "Genetics",
    lab_name: "SugarTrack Labs",
    fee: 750,
    distance_km: 4.9,
    experience_years: 7,
    location: "Faridabad",
    available_days: "Mon-Sat",
    available_hours: "9 AM - 5 PM",
  },
  {
    id: "11",
    test_name: "COVID-19 RTPCR",
    category: "Microbiology",
    lab_name: "PathSure",
    fee: 1200,
    distance_km: 6.7,
    experience_years: 6,
    location: "New Delhi",
    available_days: "All Days",
    available_hours: "7 AM - 7 PM",
  },
];

export default function BookTest() {
  const [location, setLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredTests, setFilteredTests] = useState([]);

  useEffect(() => {
    let filtered = [...mockTests];

    if (selectedSpecialty) {
      filtered = filtered.filter(
        (test) =>
          test.category.toLowerCase() === selectedSpecialty.toLowerCase()
      );
    }

    if (location) {
      filtered = filtered.filter((test) =>
        test.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.fee - b.fee);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.fee - a.fee);
        break;
      case "distance-asc":
        filtered.sort((a, b) => a.distance_km - b.distance_km);
        break;
      case "distance-desc":
        filtered.sort((a, b) => b.distance_km - a.distance_km);
        break;
      case "experience-asc":
        filtered.sort((a, b) => a.experience_years - b.experience_years);
        break;
      case "experience-desc":
        filtered.sort((a, b) => b.experience_years - a.experience_years);
        break;
      default:
        break;
    }

    setFilteredTests(filtered);
  }, [location, selectedSpecialty, sortBy]);

  const resetFilters = () => {
    setLocation("");
    setSelectedSpecialty("");
    setSortBy("");
  };

  return (
    <div className="p-24 max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-[#e8f1fc] via-white to-[#e6fdf1]">
      <div className="mb-12 text-center pb-4">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
          Book Your Diagnostic{" "}
          <span className="bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">
            Tests Easily
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in">
          Find nearby labs, compare prices, and book your health tests with ease.
        </p>
      </div>

      <Card className="mb-8 p-4 rounded-xl shadow-lg border border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
            <Search className="w-6 h-6 text-medical-blue" />
            Find Your Test
          </CardTitle>
          <CardDescription className="text-gray-600">
            Filter by specialty, location, and sort by your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 md:gap-6 items-end">
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-sm mb-1 text-gray-700 font-medium">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="border-gray-300 focus:border-medical-blue">
                  <SelectValue placeholder="Choose test type" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-sm mb-1 text-gray-700 font-medium">Location</label>
              <div className="relative">
                <Input
                  placeholder="Enter city"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-medical-blue"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-sm mb-1 text-gray-700 font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-gray-300 focus:border-medical-blue">
                  <SelectValue placeholder="Sort results" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">💸 Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">💸 Price: High to Low</SelectItem>
                  <SelectItem value="distance-asc">📍 Nearest First</SelectItem>
                  <SelectItem value="experience-desc">👨‍⚕️ Most Experienced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-none">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="mt-4 sm:mt-0 px-6 py-2 border-medical-blue text-medical-blue hover:bg-medical-lightBlue hover:text-medical-blue transition-colors duration-300"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredTests.length === 0 ? (
        <p className="text-gray-500 text-center text-lg py-10">
          No tests found for the selected filters. Please adjust your criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex justify-between items-center font-semibold text-gray-900">
                  {test.test_name}
                  <span className="text-xs bg-medical-lightBlue text-medical-blue px-3 py-1 rounded-full font-medium">
                    {test.category}
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  {test.lab_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" /> {test.location} ({test.distance_km} km)
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" /> {test.experience_years} yrs experience
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">₹{test.fee}</div>
                  <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {test.available_days}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{test.available_hours}</div>
                <Button className="w-full mt-2">

      <Calendar className="w-4 h-4 mr-2" /> Book Now

    </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}