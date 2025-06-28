import {
  CalendarCheck,
  CalendarDays,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Dot,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Format date to YYYY-MM-DD
const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Events data
const events: Record<string, { label: string; icon: JSX.Element }[]> = {
  "2025-07-05": [
    { label: "Dr. Anjali Mehta – Dermatology", icon: <CalendarCheck className="w-4 h-4 text-blue-500" /> }
  ],
  "2025-07-10": [
    { label: "Free Eye Checkup Camp", icon: <CalendarDays className="w-4 h-4 text-purple-500" /> },
    { label: "Volunteer: Health Camp", icon: <HeartHandshake className="w-4 h-4 text-yellow-500" /> }
  ],
  "2025-07-14": [
    { label: "Volunteer: Health Camp", icon: <HeartHandshake className="w-4 h-4 text-yellow-500" /> }
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

const coreModules = [
  {
    title: "Smart Appointment Scheduling",
    description: "AI-powered doctor discovery with real-time availability and surge pricing",
    icon: Calendar,
    color: "bg-blue-500",
    features: [
      "Dynamic Doctor Discovery",
      "AI Slot Optimization",
      "Smart Filters",
      "Automated Reminders"
    ]
  }
];

const PatientDashboard = () => {
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Calendar Section */}
        <div className="lg:col-span-1 w-full bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
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
                  {hasEvents && hasEvents.length > 0 && (
                    <div className="absolute bottom-1">
                      <Dot className="text-red-500 w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              {selectedDate
                ? `Events on ${new Date(selectedDate).toDateString()}`
                : "Click a date to view events"}
            </h3>
            {selectedDate && selectedDayEvents.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-600">
                {selectedDayEvents.map((e, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {e.icon}
                    <span>{e.label}</span>
                  </li>
                ))}
              </ul>
            ) : selectedDate ? (
              <p className="text-sm text-gray-500 italic">No events for this day.</p>
            ) : null}
          </div>
        </div>

        {/* Core Module Card */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Badge className="mb-4 bg-medical-lightBlue text-medical-blue">Smart AI Feature</Badge>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Smart Appointment Scheduling
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {coreModules.map((module, index) => (
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

export default PatientDashboard;
