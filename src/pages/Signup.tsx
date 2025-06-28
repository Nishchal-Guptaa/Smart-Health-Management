import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, 
  EyeOff, 
  User, 
  Stethoscope, 
  Hospital,
  Mail,
  Lock,
  Phone,
  Calendar,
  MapPin,
  ArrowLeft,
  Check,
  X,
  UserCheck,
  GraduationCap,
  Award,
  Clock,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { UserRegistrationData, DoctorRegistrationData } from "@/lib/supabase";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    // Common fields
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    
    // User-specific fields
    emergency_contact_name: "",
    emergency_contact_phone: "",
    blood_group: "",
    allergies: "",
    medical_history: "",
    current_medications: "",
    
    // Doctor-specific fields
    specialization: "",
    license_number: "",
  
    years_of_experience: "",
    hospital_affiliation: "",
    clinic_address: "",
    consultation_fee: "",
    available_days: "",
    available_hours: "",
  });
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const handleSignup = async (e: React.FormEvent, userType: "user" | "doctor") => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }

    const allRequirementsMet = passwordRequirements.every(req => req.met);
    if (!allRequirementsMet) {
      return;
    }

    try {
      const userData = userType === "user" ? {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender as 'male' | 'female' | 'other',
        address: formData.address,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        blood_group: formData.blood_group || undefined,
        allergies: formData.allergies || undefined,
        medical_history: formData.medical_history || undefined,
        current_medications: formData.current_medications || undefined,
      } : {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender as 'male' | 'female' | 'other',
        address: formData.address,
        specialization: formData.specialization,
        license_number: formData.license_number,
        years_of_experience: parseInt(formData.years_of_experience),
        hospital_affiliation: formData.hospital_affiliation || undefined,
        clinic_address: formData.clinic_address || undefined,
        consultation_fee: formData.consultation_fee ? parseFloat(formData.consultation_fee) : undefined,
        available_days: formData.available_days || undefined,
        available_hours: formData.available_hours || undefined,
      };

      await signUp(formData.email, password, userData, userType);

// Optional: store user type locally for later use (e.g., on login redirect)
localStorage.setItem("user_type", userType);

// Redirect based on type
if (userType === "doctor") {
  navigate("/dashboard/doctor");
} else {
  navigate("/dashboard/patient");
}

    } catch (error) {
      // Error handling is done in the useAuth hook
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-medical-blue mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-gradient rounded-2xl mb-4">
            <Hospital className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join MediFlow</h1>
          <p className="text-gray-600 mt-2">Create your comprehensive healthcare account</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Doctor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user">
                <CardTitle className="text-xl text-center">Patient Registration</CardTitle>
                <CardDescription className="text-center">
                  Create your comprehensive patient profile with medical information
                </CardDescription>
              </TabsContent>

              <TabsContent value="doctor">
                <CardTitle className="text-xl text-center">Doctor Registration</CardTitle>
                <CardDescription className="text-center">
                  Join our network of healthcare professionals with detailed credentials
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="user" className="space-y-6">
                <form onSubmit={(e) => handleSignup(e, "user")} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-firstname">First Name *</Label>
                        <Input
                          id="user-firstname"
                          type="text"
                          placeholder="First name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange("first_name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-lastname">Last Name *</Label>
                        <Input
                          id="user-lastname"
                          type="text"
                          placeholder="Last name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange("last_name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="user-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="user-phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-dob">Date of Birth *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="user-dob"
                            type="date"
                            className="pl-10"
                            value={formData.date_of_birth}
                            onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-gender">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-address">Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="user-address"
                          placeholder="Enter your full address"
                          className="pl-10"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-emergency-name">Emergency Contact Name *</Label>
                        <Input
                          id="user-emergency-name"
                          type="text"
                          placeholder="Emergency contact name"
                          value={formData.emergency_contact_name}
                          onChange={(e) => handleInputChange("emergency_contact_name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-emergency-phone">Emergency Contact Phone *</Label>
                        <Input
                          id="user-emergency-phone"
                          type="tel"
                          placeholder="Emergency contact phone"
                          value={formData.emergency_contact_phone}
                          onChange={(e) => handleInputChange("emergency_contact_phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Medical Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-blood-group">Blood Group</Label>
                        <Select value={formData.blood_group} onValueChange={(value) => handleInputChange("blood_group", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                     
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-allergies">Allergies</Label>
                      <Textarea
                        id="user-allergies"
                        placeholder="List any allergies (separate with commas)"
                        value={formData.allergies}
                        onChange={(e) => handleInputChange("allergies", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-medical-history">Medical History</Label>
                      <Textarea
                        id="user-medical-history"
                        placeholder="Previous medical conditions, surgeries, etc."
                        value={formData.medical_history}
                        onChange={(e) => handleInputChange("medical_history", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-current-medications">Current Medications</Label>
                      <Textarea
                        id="user-current-medications"
                        placeholder="List current medications and dosages"
                        value={formData.current_medications}
                        onChange={(e) => handleInputChange("current_medications", e.target.value)}
                      />
                    </div>
                   
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user-password">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="user-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="user-confirm-password">Confirm Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="user-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 h-4" />
                            ) : (
                              <Eye className="h-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    {password && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Password Requirements</Label>
                        <div className="space-y-1">
                          {passwordRequirements.map((requirement, index) => (
                            <div key={index} className="flex items-center text-sm">
                              {requirement.met ? (
                                <Check className="w-4 h-4 text-green-500 mr-2" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 mr-2" />
                              )}
                              <span className={requirement.met ? "text-green-600" : "text-red-600"}>
                                {requirement.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms-user"
                      className="rounded border-gray-300"
                      required
                    />
                    <Label htmlFor="terms-user" className="text-sm">
                      I agree to the{" "}
                      <Link to="/terms" className="text-medical-blue hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-medical-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full medical-gradient text-white" 
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Patient Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="doctor" className="space-y-6">
                <form onSubmit={(e) => handleSignup(e, "doctor")} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <UserCheck className="w-5 h-5" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-firstname">First Name *</Label>
                        <Input
                          id="doctor-firstname"
                          type="text"
                          placeholder="First name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange("first_name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-lastname">Last Name *</Label>
                        <Input
                          id="doctor-lastname"
                          type="text"
                          placeholder="Last name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange("last_name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="doctor-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="doctor-phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-dob">Date of Birth *</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="doctor-dob"
                            type="date"
                            className="pl-10"
                            value={formData.date_of_birth}
                            onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-gender">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-address">Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="doctor-address"
                          placeholder="Enter your full address"
                          className="pl-10"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-specialization">Specialization *</Label>
                        <Input
                          id="doctor-specialization"
                          type="text"
                          placeholder="e.g., Cardiology, Pediatrics"
                          value={formData.specialization}
                          onChange={(e) => handleInputChange("specialization", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-license">Medical License Number *</Label>
                        <Input
                          id="doctor-license"
                          type="text"
                          placeholder="Enter your license number"
                          value={formData.license_number}
                          onChange={(e) => handleInputChange("license_number", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-experience">Years of Experience *</Label>
                        <Input
                          id="doctor-experience"
                          type="number"
                          placeholder="e.g., 15"
                          value={formData.years_of_experience}
                          onChange={(e) => handleInputChange("years_of_experience", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-hospital">Hospital Affiliation</Label>
                        <Input
                          id="doctor-hospital"
                          type="text"
                          placeholder="Hospital or clinic name"
                          value={formData.hospital_affiliation}
                          onChange={(e) => handleInputChange("hospital_affiliation", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor-clinic-address">Clinic Address</Label>
                      <Textarea
                        id="doctor-clinic-address"
                        placeholder="Clinic or practice address"
                        value={formData.clinic_address}
                        onChange={(e) => handleInputChange("clinic_address", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Practice Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Practice Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-consultation-fee">Consultation Fee ($)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="doctor-consultation-fee"
                            type="number"
                            placeholder="e.g., 150"
                            className="pl-10"
                            value={formData.consultation_fee}
                            onChange={(e) => handleInputChange("consultation_fee", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-available-days">Available Days</Label>
                        <Input
                          id="doctor-available-days"
                          type="text"
                          placeholder="e.g., Mon, Wed, Fri"
                          value={formData.available_days}
                          onChange={(e) => handleInputChange("available_days", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-available-hours">Available Hours</Label>
                        <Input
                          id="doctor-available-hours"
                          type="text"
                          placeholder="e.g., 9 AM - 5 PM"
                          value={formData.available_hours}
                          onChange={(e) => handleInputChange("available_hours", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="doctor-password">Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="doctor-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="doctor-confirm-password">Confirm Password *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="doctor-confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 h-4" />
                            ) : (
                              <Eye className="h-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    {password && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Password Requirements</Label>
                        <div className="space-y-1">
                          {passwordRequirements.map((requirement, index) => (
                            <div key={index} className="flex items-center text-sm">
                              {requirement.met ? (
                                <Check className="w-4 h-4 text-green-500 mr-2" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 mr-2" />
                              )}
                              <span className={requirement.met ? "text-green-600" : "text-red-600"}>
                                {requirement.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms-doctor"
                      className="rounded border-gray-300"
                      required
                    />
                    <Label htmlFor="terms-doctor" className="text-sm">
                      I agree to the{" "}
                      <Link to="/terms" className="text-medical-blue hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-medical-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full medical-gradient text-white" 
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Doctor Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-medical-blue hover:underline font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup; 