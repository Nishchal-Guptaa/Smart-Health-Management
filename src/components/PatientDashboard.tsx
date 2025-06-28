import {
  CalendarCheck,
  CalendarDays,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Dot,
  Calendar as CalendarIcon,
  PlusCircle,
  Scale,
  User,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const patientDashboardIllustration = "https://images.unsplash.com/photo-1576091160550-fd42a8b4e720?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const formatDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const events = {
  "2025-07-05": [
    { label: "Dr. Anjali Mehta – Dermatology", icon: <CalendarCheck className="w-4 h-4 text-blue-500" />, type: "doctor", details: { name: "Anjali Mehta", specialty: "Dermatology", time: "11:00", avatar: "https://via.placeholder.com/60/FFDDC1/FF8C00?text=AM" } },
  ],
  "2025-07-10": [
    { label: "Free Eye Checkup Camp", icon: <CalendarDays className="w-4 h-4 text-purple-500" />, type: "vaccination", details: { name: "Eye Checkup", description: "Free camp at community center", time: "09:00", location: "Community Hall", avatar: "https://via.placeholder.com/60/D1C4E9/673AB7?text=EC" } },
    { label: "Volunteer: Health Camp", icon: <HeartHandshake className="w-4 h-4 text-yellow-500" />, type: "volunteering", details: { role: "Registration Assistant", organization: "Local Health Initiative", time: "10:00", avatar: "https://via.placeholder.com/60/C8E6C9/4CAF50?text=VO" } },
  ],
  "2025-07-14": [
    { label: "Volunteer: Health Camp", icon: <HeartHandshake className="w-4 h-4 text-yellow-500" />, type: "volunteering", details: { role: "Medical Aid", organization: "Red Cross", time: "08:00", avatar: "https://via.placeholder.com/60/FFE0B2/FF9800?text=RC" } },
  ],
  "2025-07-22": [
    { label: "Dental Checkup - Dr. Sharma", icon: <CalendarCheck className="w-4 h-4 text-blue-500" />, type: "doctor", details: { name: "Sharma", specialty: "Dentist", time: "14:00", avatar: "https://via.placeholder.com/60/BBDEFB/2196F3?text=DS" } },
  ],
  "2025-07-28": [
    { label: "Blood Donation Drive", icon: <HeartHandshake className="w-4 h-4 text-red-500" />, type: "vaccination", details: { name: "Blood Donation", description: "City Blood Bank", time: "09:00", location: "City Blood Bank", avatar: "https://via.placeholder.com/60/FFCDD2/F44336?text=BD" } },
    { label: "Dr. Ada Wafa - Herat Specialist", icon: <CalendarCheck className="w-4 h-4 text-blue-500" />, type: "doctor", details: { name: "Ada Wafa", specialty: "Herat Specialist", time: "9:00", avatar: "/boy.png" } },
    { label: "Dr. Sircane - Neurosurgeon", icon: <CalendarCheck className="w-4 h-4 text-blue-500" />, type: "doctor", details: { name: "Sircane", specialty: "Neurosurgeon", time: "9:00", avatar: "/girl.png" } },
  ],
};

const getDaysInMonth = (year, month) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const coreModules = [
  { title: "Smart Appointment Scheduling", icon: CalendarIcon, color: "bg-blue-500", path: "/appointments" },
  { title: "AI Symptom Checker", icon: CalendarDays, color: "bg-purple-500", path: "/symptom-checker" },
  { title: "Medical Test Booking", icon: CalendarCheck, color: "bg-green-500", path: "/test-booking" },
  { title: "Digital Medical Vault", icon: HeartHandshake, color: "bg-yellow-500", path: "/medical-vault" },
  { title: "Emergency e-Ambulance", icon: CalendarIcon, color: "bg-red-500", path: "/ambulance" },
];

const quickActions = [
  { title: "Book New Appointment", icon: PlusCircle, color: "text-blue-600", path: "/appointments/new" },
];

const PatientDashboard = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState("2025-07-28");
  const navigate = useNavigate();

  const monthDays = getDaysInMonth(year, month);
  const formattedMonth = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

  const selectedDayEvents = selectedDate ? events[selectedDate] ?? [] : [];

  const getNextFiveDays = (startDateStr) => {
    const startDate = new Date(startDateStr);
    const days = [];
    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        day: currentDate.toLocaleDateString("en-US", { weekday: "short" }),
        date: currentDate.getDate().toString(),
        fullDate: formatDateKey(currentDate),
        appointments: ["09:00", "10:00", "12:00", "18:00"]
      });
    }
    return days;
  };

  const scheduleDisplayDays = getNextFiveDays(selectedDate || formatDateKey(today));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6 items-start min-h-[500px]">
        <div className="xl:col-span-3 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-500" /> Welcome, Patient Name!
              </h1>
              <p className="text-gray-600 text-sm mt-1">Your health dashboard at a glance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="border rounded-xl p-4 shadow-sm bg-white cursor-pointer hover:shadow-md transition-all duration-200 flex items-center justify-center text-center h-[100px]"
                onClick={() => navigate(action.path)}
              >
                <div className="flex flex-col items-center">
                  <action.icon className={`w-6 h-6 mb-2 ${action.color}`} />
                  <p className="text-sm font-semibold text-gray-700">{action.title}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {coreModules.map((module, index) => (
              <Card
                key={index}
                className="border rounded-xl p-6 shadow-md bg-white cursor-pointer hover:shadow-xl transition-all duration-200 flex items-center h-[120px]"
                onClick={() => navigate(module.path)}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className={`p-3 rounded-lg ${module.color} flex items-center justify-center`}>
                    <module.icon className="text-white w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800">{module.title}</h4>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="xl:col-span-1 flex flex-col gap-6">
          <Card className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Schedule</h2>
              <div className="flex items-center space-x-2">
                <button><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
                <button><ChevronRight className="w-5 h-5 text-gray-500" /></button>
              </div>
            </div>
            <div className="flex justify-between items-start text-center mb-4 border-b pb-2 border-gray-100">
              {scheduleDisplayDays.map((day, index) => (
                <div key={index}
                  className={`flex flex-col items-center p-2 cursor-pointer ${day.fullDate === selectedDate ? "bg-purple-600 text-white rounded-lg shadow" : "text-gray-600 hover:bg-gray-50 rounded-lg"}`}
                  onClick={() => setSelectedDate(day.fullDate)}
                >
                  <span className="text-xs font-medium">{day.day}</span>
                  <span className="text-lg font-bold">{day.date}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col text-sm text-gray-700">
              {["9:00", "10:00", "12:00", "18:00"].map((timeSlot) => (
                <div key={`time-slot-${timeSlot}`} className="grid grid-cols-6 gap-2 items-center py-1.5 border-b border-gray-50 last:border-b-0">
                  <div className="col-span-1 font-semibold text-xs text-gray-500">{timeSlot}</div>
                  {scheduleDisplayDays.map((day) => {
                    const dayEvents = events[day.fullDate] || [];
                    const hasAppointmentAtTime = dayEvents.some(
                      (event) => event.type === "doctor" && event.details.time === timeSlot
                    );
                    return (
                      <div key={`${day.fullDate}-${timeSlot}`} className="col-span-1 flex justify-center items-center">
                        {hasAppointmentAtTime ? (
                          <Dot className="w-12 h-12 text-green-500" />
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Doctor Appointment</h2>
            <div className="grid grid-cols-1 gap-4">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event, index) => {
                  if (event.type === "doctor") {
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 flex flex-col items-start shadow-sm">
                        <div className="flex items-center mb-2">
                          <img
                            src={event.details.avatar}
                            alt={event.details.name}
                            className={`mr-3 ${["Ada Wafa", "Sircane"].includes(event.details.name) ? "w-16 h-16 rounded-md" : "w-10 h-10 rounded-full border-2 border-gray-200"}`}
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-800">Dr. {event.details.name}</p>
                            <p className="text-xs text-gray-500">{event.details.specialty}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600 text-xs mb-1">
                          <Clock className="w-3 h-3 mr-1" /> {event.details.time}
                        </div>
                        <div className="flex items-center text-gray-600 text-xs">
                          <CalendarIcon className="w-3 h-3 mr-1" /> {new Date(selectedDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="text-sm text-gray-500 italic p-3">No appointments for selected date.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
