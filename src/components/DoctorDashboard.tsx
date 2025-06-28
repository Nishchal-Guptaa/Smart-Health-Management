import {
  CalendarCheck,
  CalendarDays,
  HeartPulse,
  Stethoscope,
  ClipboardList,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Dot,
  Calendar,
  Users,
  Clock
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Format date to YYYY-MM-DD
const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Doctor's appointments data
const events: Record<string, { label: string; icon: JSX.Element; note?: string }[]> = {
  "2025-07-05": [
    { label: "👩‍🦰 Priya Singh – 10:00 AM", icon: <CalendarCheck className="w-4 h-4 text-green-500" />, note: "Skin rash" }
  ],
  "2025-07-10": [
    { label: "👨‍🦱 Rahul Verma – 11:30 AM", icon: <CalendarCheck className="w-4 h-4 text-green-500" />, note: "Routine checkup" },
    { label: "🧓 Anil Joshi – 1:00 PM", icon: <CalendarCheck className="w-4 h-4 text-green-500" />, note: "Follow-up: Diabetes" }
  ],
  "2025-07-14": [
    { label: "👩‍🦳 Seema Sharma – 3:45 PM", icon: <CalendarCheck className="w-4 h-4 text-green-500" />, note: "Hypertension management" }
  ],
};

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const doctorModules = [
  {
    title: "Today’s Consultations",
    description: "Manage your appointments and view patient details.",
    icon: Stethoscope,
    color: "bg-blue-500",
    features: [
      "Live Patient Queue",
      "One-Click EMR Access",
      "Smart Time Reminders",
      "Instant Prescription"
    ]
  },
  {
    title: "Health Alerts & Notifications",
    description: "Stay updated on critical cases and emergencies.",
    icon: AlertTriangle,
    color: "bg-red-500",
    features: [
      "Emergency Patient Flags",
      "Critical Lab Results",
      "Medication Allergy Alerts"
    ]
  }
];

const DoctorDashboard = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthDays = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay();
  const formattedMonth = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const selectedDayEvents = selectedDate ? events[selectedDate] ?? [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Sidebar: Calendar */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Appointments Calendar</h2>
            <div className="flex items-center space-x-2">
              <button onClick={() => {
                const newDate = new Date(year, month - 1);
                setMonth(newDate.getMonth());
                setYear(newDate.getFullYear());
                setSelectedDate(null);
              }}>
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-sm text-gray-600">{formattedMonth}</span>
              <button onClick={() => {
                const newDate = new Date(year, month + 1);
                setMonth(newDate.getMonth());
                setYear(newDate.getFullYear());
                setSelectedDate(null);
              }}>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-[10px] text-center text-gray-500 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-800">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthDays.map((date) => {
              const dateStr = formatDateKey(date);
              const isSelected = selectedDate === dateStr;
              const hasEvents = events[dateStr];

              return (
                <div
                  key={dateStr}
                  className={`relative p-1 h-12 w-full rounded-md flex flex-col items-center justify-start cursor-pointer ${
                    isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <span className="font-medium">{date.getDate()}</span>
                  {hasEvents && (
                    <Dot className="text-red-500 w-3 h-3 absolute bottom-1" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {selectedDate
                ? `Scheduled Patients on ${new Date(selectedDate).toDateString()}`
                : "Click a date to see patients"}
            </h3>
            {selectedDate && selectedDayEvents.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-600">
                {selectedDayEvents.map((e, i) => (
                  <li key={i} className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      {e.icon}
                      <span className="font-medium">{e.label}</span>
                    </div>
                    {e.note && <span className="text-xs italic text-gray-500">{e.note}</span>}
                  </li>
                ))}
              </ul>
            ) : selectedDate ? (
              <p className="text-sm text-gray-500 italic">No patients scheduled for this day.</p>
            ) : null}
          </div>
        </div>

        {/* Main Content: Modules + Stats */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center shadow hover:shadow-lg">
              <CardContent className="py-4">
                <div className="flex justify-center items-center gap-2 text-2xl font-bold text-blue-600">
                  <Users className="w-5 h-5" /> 8
                </div>
                <div className="text-sm text-gray-600">Patients Today</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow hover:shadow-lg">
              <CardContent className="py-4">
                <div className="flex justify-center items-center gap-2 text-2xl font-bold text-green-600">
                  <Clock className="w-5 h-5" /> 4
                </div>
                <div className="text-sm text-gray-600">Pending Consults</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow hover:shadow-lg">
              <CardContent className="py-4">
                <div className="flex justify-center items-center gap-2 text-2xl font-bold text-red-500">
                  <AlertTriangle className="w-5 h-5" /> 1
                </div>
                <div className="text-sm text-gray-600">Critical Alert</div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor Tools */}
          <div>
            <Badge className="mb-4 bg-blue-100 text-blue-800">Doctor Tools</Badge>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Day Efficiently</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {doctorModules.map((module, index) => (
                <Card key={index} className="transition-shadow hover:shadow-xl">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`p-3 rounded-md ${module.color}`}>
                      <module.icon className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.title}</CardTitle>
                      <CardDescription className="text-sm">{module.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pl-16">
                    <ul className="list-disc pl-3 text-sm text-gray-600">
                      {module.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
