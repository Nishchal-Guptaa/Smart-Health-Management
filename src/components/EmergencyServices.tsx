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
import {
  MapPin,
  Phone,
  Clock,
  AlertCircle,
  Search,
  BedDouble,
  Star,
  Map,
  Building2,
} from "lucide-react";

// 🛏️ Available Bed Types
const bedTypes = ["ICU", "General", "Emergency"];

// 🏥 Realistic Mock Hospital Data
const mockHospitals = [
  {
    id: "1",
    name: "Apollo Hospitals",
    location: "Sector 26, Noida",
    distance_km: 3.9,
    rating: 4.8,
    phone: "+91 9847005931",
    lastUpdated: "9 min ago",
    hasEmergency: true,
    bedAvailability: { ICU: 5, General: 5, Emergency: 3 },
  },
  {
    id: "2",
    name: "Bhardwaj Hospital",
    location: "Sec - 29, Noida",
    distance_km: 2.1,
    rating: 4.3,
    phone: "+91 9847906059",
    lastUpdated: "7 min ago",
    hasEmergency: true,
    bedAvailability: { ICU: 2, General: 10, Emergency: 4 },
  },
  {
    id: "3",
    name: "Bisaria Medical Centre",
    location: "Sector-55, Noida",
    distance_km: 2.1,
    rating: 4.9,
    phone: "+91 9834369053",
    lastUpdated: "8 min ago",
    hasEmergency: false,
    bedAvailability: { ICU: 1, General: 9, Emergency: 1 },
  },
  {
    id: "4",
    name: "Max Hospital Noida",
    location: "Sector 19, Noida",
    distance_km: 4.6,
    rating: 4.7,
    phone: "+91 9876543212",
    lastUpdated: "5 min ago",
    hasEmergency: true,
    bedAvailability: { ICU: 3, General: 7, Emergency: 2 },
  },
  {
    id: "5",
    name: "Fortis Hospital",
    location: "Sector 62, Noida",
    distance_km: 3.2,
    rating: 4.6,
    phone: "+91 9812345678",
    lastUpdated: "3 min ago",
    hasEmergency: true,
    bedAvailability: { ICU: 0, General: 3, Emergency: 0 },
  },
  {
    id: "6",
    name: "Surbhi Hospital",
    location: "Sector 35, Noida",
    distance_km: 2.5,
    rating: 4.5,
    phone: "+91 9823456789",
    lastUpdated: "11 min ago",
    hasEmergency: false,
    bedAvailability: { ICU: 2, General: 4, Emergency: 2 },
  },
  {
    id: "7",
    name: "Action Cancer Hospital",
    location: "Paschim Vihar, Delhi",
    distance_km: 6.5,
    rating: 4.3,
    phone: "8376904111",
    lastUpdated: "6/29/2025 4:36 AM",
    hasEmergency: true,
    bedAvailability: { ICU: 1, General: 11, Emergency: 1 },
  },
  {
    id: "8",
    name: "Batra Hospital",
    location: "Tughlaqabad, New Delhi",
    distance_km: 7.4,
    rating: 4.6,
    phone: "29958747",
    lastUpdated: "6/28/2025 11:44 AM",
    hasEmergency: true,
    bedAvailability: { ICU: 6, General: 44, Emergency: 0 },
  },
  {
    id: "9",
    name: "Dr. B.L Kapur Memorial Hospital",
    location: "Pusa Road, New Delhi",
    distance_km: 6.2,
    rating: 4.5,
    phone: "30403040",
    lastUpdated: "6/28/2025 7:34 AM",
    hasEmergency: true,
    bedAvailability: { ICU: 14, General: 38, Emergency: 2 },
  },
  {
    id: "10",
    name: "Bhagwan Mahavir Hospital",
    location: "New Delhi",
    distance_km: 8.3,
    rating: 4.1,
    phone: "27550441-42",
    lastUpdated: "N/A",
    hasEmergency: true,
    bedAvailability: { ICU: 1, General: 4, Emergency: 0 },
  },
  {
    id: "11",
    name: "Kottakkal Arya Vaidya Sala",
    location: "Karkardooma, Delhi",
    distance_km: 5.8,
    rating: 4.4,
    phone: "011-22106500",
    lastUpdated: "6/26/2025 1:09 PM",
    hasEmergency: false,
    bedAvailability: { ICU: 0, General: 5, Emergency: 0 },
  },
];

export default function BedAvailability() {
  const [location, setLocation] = useState("");
  const [selectedBedType, setSelectedBedType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState(mockHospitals);

  useEffect(() => {
    let filtered = [...mockHospitals];

    if (selectedBedType) {
      filtered = filtered.filter(
        (hospital) => hospital.bedAvailability[selectedBedType] > 0
      );
    }

    if (location) {
      filtered = filtered.filter((hospital) =>
        hospital.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    switch (sortBy) {
      case "distance-asc":
        filtered.sort((a, b) => a.distance_km - b.distance_km);
        break;
      case "distance-desc":
        filtered.sort((a, b) => b.distance_km - a.distance_km);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "bed-max":
        filtered.sort(
          (a, b) =>
            Object.values(b.bedAvailability).reduce((x, y) => x + y, 0) -
            Object.values(a.bedAvailability).reduce((x, y) => x + y, 0)
        );
        break;
    }

    setFilteredHospitals(filtered);
  }, [location, selectedBedType, sortBy]);

  const resetFilters = () => {
    setLocation("");
    setSelectedBedType("");
    setSortBy("");
  };

  return (
    <div className="p-24 max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-[#e8f1fc] via-white to-[#e6fdf1]">
      <div className="mb-12 text-center pb-4">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-slide-up">
          Hospital <span className="bg-gradient-to-r from-medical-blue to-medical-green bg-clip-text text-transparent">Bed Availability</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in">
          Find available hospital beds in real-time and make informed decisions in critical moments.
        </p>
      </div>

      <Card className="mb-8 p-4 rounded-xl shadow-lg border border-gray-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
            <Search className="w-6 h-6 text-medical-blue" />
            Search Beds
          </CardTitle>
          <CardDescription className="text-gray-600">
            Filter by bed type, location, and sort as per urgency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 md:gap-6 items-end">
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label className="text-sm mb-1 text-gray-700 font-medium">Bed Type</label>
              <Select value={selectedBedType} onValueChange={setSelectedBedType}>
                <SelectTrigger className="border-gray-300 focus:border-medical-blue">
                  <SelectValue placeholder="Choose bed type" />
                </SelectTrigger>
                <SelectContent>
                  {bedTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
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
                  <SelectItem value="distance-asc"><Map className="w-4 h-4 inline-block mr-2" /> Nearest</SelectItem>
                  <SelectItem value="rating-desc"><Star className="w-4 h-4 inline-block mr-2" /> Highest Rated</SelectItem>
                  <SelectItem value="bed-max"><BedDouble className="w-4 h-4 inline-block mr-2" /> Most Beds</SelectItem>
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

      {filteredHospitals.length === 0 ? (
        <p className="text-gray-500 text-center text-lg py-10">
          No hospitals match your filters. Please adjust the criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex justify-between items-center font-semibold text-gray-900">
                  {hospital.name}
                  <span className="text-xs bg-medical-lightBlue text-medical-blue px-3 py-1 rounded-full font-medium">
                    <Star className="inline-block w-3 h-3 mr-1" /> {hospital.rating}
                  </span>
                </CardTitle>
                <CardDescription className="text-base text-gray-600">
                  {hospital.location} ({hospital.distance_km} km)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{hospital.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>Updated: {hospital.lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${hospital.hasEmergency ? "text-green-600" : "text-gray-400"}`} />
                  <span>{hospital.hasEmergency ? "Emergency Available" : "No Emergency"}</span>
                </div>
                <hr className="border-gray-200 my-2" />
                {Object.entries(hospital.bedAvailability).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-medical-blue" />
                      {type} Beds
                    </span>
                    <span className={`font-bold ${count > 0 ? "text-green-700" : "text-red-500 line-through"}`}>
                      {count > 0 ? `${count} Available` : "Full"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

