
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Phone, MapPin, Clock, Hospital, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";


const EmergencyServices = () => {
  const [activeEmergency, setActiveEmergency] = useState(false);
  const [ambulanceETA, setAmbulanceETA] = useState(8);

  useEffect(() => {
    if (activeEmergency) {
      const interval = setInterval(() => {
        setAmbulanceETA(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeEmergency]);

  const emergencyTypes = [
    {
      type: "Heart Attack",
      priority: "Critical",
      color: "bg-red-500",
      description: "Chest pain, shortness of breath"
    },
    {
      type: "Stroke",
      priority: "Critical",
      color: "bg-red-500",
      description: "Sudden weakness, speech difficulty"
    },
    {
      type: "Severe Injury",
      priority: "High",
      color: "bg-orange-500",
      description: "Major bleeding, fractures"
    },
    {
      type: "Breathing Emergency",
      priority: "High",
      color: "bg-orange-500",
      description: "Severe difficulty breathing"
    },
    {
      type: "Allergic Reaction",
      priority: "Medium",
      color: "bg-yellow-500",
      description: "Severe allergic symptoms"
    },
    {
      type: "Other Emergency",
      priority: "Medium",
      color: "bg-blue-500",
      description: "Other urgent medical needs"
    }
  ];

  const nearbyHospitals = [
    {
      name: "City General Hospital",
      distance: "2.1 km",
      eta: "6 min",
      departments: ["Emergency", "Cardiac", "Trauma"],
      beds: 12,
      rating: 4.8
    },
    {
      name: "St. Mary's Medical Center",
      distance: "3.4 km",
      eta: "8 min",
      departments: ["Emergency", "Neurology", "ICU"],
      beds: 8,
      rating: 4.9
    },
    {
      name: "Metro Health Hospital",
      distance: "4.2 km",
      eta: "10 min",
      departments: ["Emergency", "Pediatric", "Surgery"],
      beds: 15,
      rating: 4.7
    }
  ];

  const handleEmergencyCall = (emergencyType: string) => {
    setActiveEmergency(true);
    console.log(`Emergency call initiated for: ${emergencyType}`);
  };

  if (activeEmergency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
        <div className="max-w-4xl mx-auto">
          {/* Emergency Active Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">EMERGENCY ACTIVE</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Ambulance Dispatched</h1>
            <p className="text-gray-600 mt-2">Help is on the way. Stay calm and follow the instructions below.</p>
          </div>

          {/* ETA Card */}
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {ambulanceETA} minutes
                </div>
                <div className="text-gray-600 mb-4">Estimated arrival time</div>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>Unit: AMB-247</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-red-500" />
                    <span>Direct Line: Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Tracking */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Live Ambulance Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    🚑
                  </div>
                  <p className="text-gray-600">Real-time GPS tracking</p>
                  <p className="text-sm text-gray-500">Ambulance is 2.3 km away</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">✓</div>
                  <div className="text-sm text-gray-600">Dispatched</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-blue-600">🚑</div>
                  <div className="text-sm text-gray-600">En Route</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-400">⏱️</div>
                  <div className="text-sm text-gray-400">Arriving</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-red-600">Emergency Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p>Stay calm and remain in your current location</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p>Keep your phone nearby for paramedic contact</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p>If conscious, try to unlock your door for easy access</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p>Gather your medical information if possible</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white p-6">
              <Phone className="w-5 h-5 mr-2" />
              Call Paramedic Directly
            </Button>
            <Button variant="outline" onClick={() => setActiveEmergency(false)} className="p-6">
              Cancel Emergency
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Services</h1>
            <p className="text-gray-600 mt-2">24/7 emergency response with live tracking and priority dispatch</p>
          </div>
          <Link to="/dashboard/patient" className="flex items-center space-x-2 text-gray-700 hover:underline">
                      <ArrowUp className="w-4 h-4" />
                      <span>Back to Dashboard</span>
                    </Link>
        </div>

        {/* Emergency Alert */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">Emergency Hotline: 911</h3>
                <p className="text-red-600">For life-threatening emergencies, call 911 immediately</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Types */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Emergency Type</h2>
            <div className="space-y-4">
              {emergencyTypes.map((emergency, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => handleEmergencyCall(emergency.type)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 ${emergency.color} rounded-full`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{emergency.type}</h3>
                          <Badge 
                            className={emergency.priority === 'Critical' ? 
                              'bg-red-100 text-red-700' : 
                              emergency.priority === 'High' ? 
                              'bg-orange-100 text-orange-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }
                          >
                            {emergency.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{emergency.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Emergency Button */}
            <Card className="mt-6 bg-red-600 text-white">
              <CardContent className="p-6">
                <Button 
                  className="w-full bg-white text-red-600 hover:bg-gray-100 text-lg py-6"
                  onClick={() => handleEmergencyCall("General Emergency")}
                >
                  <Phone className="w-6 h-6 mr-3" />
                  CALL EMERGENCY AMBULANCE NOW
                </Button>
                <p className="text-center text-red-100 text-sm mt-3">
                  Average response time: 8-12 minutes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Nearby Hospitals */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Hospitals</h2>
            <div className="space-y-4">
              {nearbyHospitals.map((hospital, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{hospital.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{hospital.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>ETA: {hospital.eta}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {hospital.beds} beds available
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hospital.departments.map((dept, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm">{hospital.rating}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Hospital className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Features */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Emergency Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      📍
                    </div>
                    <div>
                      <div className="font-medium">Live GPS Tracking</div>
                      <div className="text-sm text-gray-600">Real-time ambulance location</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      🏥
                    </div>
                    <div>
                      <div className="font-medium">Hospital Coordination</div>
                      <div className="text-sm text-gray-600">Pre-arrival patient information</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      🚨
                    </div>
                    <div>
                      <div className="font-medium">Priority Dispatch</div>
                      <div className="text-sm text-gray-600">AI-based severity assessment</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
