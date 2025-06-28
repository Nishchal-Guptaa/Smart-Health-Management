
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, Search, MapPin, Clock, Hospital, Star } from "lucide-react";
import { Link } from "react-router-dom";


const TestBooking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const testCategories = [
    "Blood Tests", "Imaging", "Cardiac", "Neurological", "Cancer Screening", "Hormonal"
  ];

  const popularTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "Blood Tests",
      description: "Comprehensive blood analysis including RBC, WBC, platelets",
      price: 45,
      duration: "15 min",
      fasting: false,
      labs: 12
    },
    {
      id: 2,
      name: "Lipid Profile",
      category: "Blood Tests",
      description: "Cholesterol and triglyceride levels assessment",
      price: 55,
      duration: "10 min",
      fasting: true,
      labs: 8
    },
    {
      id: 3,
      name: "Chest X-Ray",
      category: "Imaging",
      description: "Digital chest radiography for lung and heart assessment",
      price: 120,
      duration: "20 min",
      fasting: false,
      labs: 15
    },
    {
      id: 4,
      name: "ECG (Electrocardiogram)",
      category: "Cardiac",
      description: "Heart rhythm and electrical activity monitoring",
      price: 80,
      duration: "30 min",
      fasting: false,
      labs: 10
    },
    {
      id: 5,
      name: "Thyroid Function Test",
      category: "Hormonal",
      description: "TSH, T3, T4 levels for thyroid health assessment",
      price: 95,
      duration: "15 min",
      fasting: false,
      labs: 18
    },
    {
      id: 6,
      name: "MRI Brain Scan",
      category: "Imaging",
      description: "Detailed brain imaging for neurological conditions",
      price: 850,
      duration: "45 min",
      fasting: false,
      labs: 5
    }
  ];

  const featuredLabs = [
    {
      id: 1,
      name: "MediLab Central",
      rating: 4.9,
      distance: "1.2 km",
      tests: 450,
      homeService: true,
      sameDay: true,
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "HealthCheck Plus",
      rating: 4.8,
      distance: "2.1 km",
      tests: 380,
      homeService: true,
      sameDay: false,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "QuickTest Labs",
      rating: 4.7,
      distance: "0.8 km",
      tests: 290,
      homeService: false,
      sameDay: true,
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"
    }
  ];

  const filteredTests = popularTests.filter(test => 
    test.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === "" || test.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Test Booking</h1>
            <p className="text-gray-600 mt-2">Search and book from 1000+ medical tests with transparent pricing</p>
          </div>
          <Link to="/dashboard/patient" className="flex items-center space-x-2 text-gray-700 hover:underline">
            <ArrowUp className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Find Medical Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  placeholder="Search tests (e.g., blood test, MRI, ECG)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {testCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                🏆 Top-Rated Labs
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                📍 Nearest First
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                🕒 Same-Day Available
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                🏠 Home Collection
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Results */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Tests</h2>
              <Badge className="bg-purple-100 text-purple-700">
                {filteredTests.length} tests found
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTests.map((test) => (
                <Card key={test.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <Badge variant="secondary" className="mt-2">{test.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">${test.price}</div>
                        <div className="text-sm text-gray-500">{test.labs} labs available</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="mb-4">
                      {test.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{test.duration}</span>
                      </div>
                      {test.fasting && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Fasting Required
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="medical-gradient text-white">
                        Book Now
                      </Button>
                      <Button variant="outline">
                        Compare Labs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Labs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Featured Labs</CardTitle>
                <CardDescription>
                  Top-rated laboratories in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredLabs.map((lab) => (
                  <div key={lab.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <img
                      src={lab.image}
                      alt={lab.name}
                      className="w-full h-24 object-cover rounded-md mb-3"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{lab.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-sm">{lab.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{lab.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Hospital className="w-3 h-3" />
                          <span>{lab.tests} tests</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {lab.homeService && (
                          <Badge variant="outline" className="text-xs">🏠 Home Service</Badge>
                        )}
                        {lab.sameDay && (
                          <Badge variant="outline" className="text-xs">⚡ Same Day</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Test Packages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Health Checkup Basic</h4>
                  <p className="text-sm text-gray-600">10 essential tests</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-green-600">$199</span>
                    <Badge className="bg-green-100 text-green-700">Save 30%</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Comprehensive Health</h4>
                  <p className="text-sm text-gray-600">25 detailed tests</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-green-600">$449</span>
                    <Badge className="bg-green-100 text-green-700">Save 40%</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium">Senior Citizen Special</h4>
                  <p className="text-sm text-gray-600">15 age-specific tests</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-green-600">$299</span>
                    <Badge className="bg-green-100 text-green-700">Save 35%</Badge>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  View All Packages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBooking;
