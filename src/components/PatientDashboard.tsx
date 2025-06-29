import {
  CalendarCheck,
  CalendarDays,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Dot,
  Calendar
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/lib/supabase";
import { userService } from "@/lib/userService";

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const events: Record<string, { label: string; icon: React.ReactElement }[]> = {
  "2025-07-05": [
    { label: "Dr. Anjali Mehta – Dermatology", icon: <CalendarCheck className="w-4 h-4 text-blue-500" /> }
  ],
  "2025-07-10": [
    { label: "Free Eye Checkup Camp", icon: <CalendarDays className="w-4 h-4 text-purple-500" /> },
    { label: "Volunteer: Health Camp", icon: <HeartHandshake className="w-4 h-4 text-yellow-500" /> }
  ],
  "2025-07-14": [
    { label: "Volunteer: Health Camp", icon: <HeartHandshake className="w-4 h-4 text-yellow-500" /> }
  ]
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
    icon: Calendar,
    color: "bg-blue-500",
    path: "/appointments"
  },
  {
    title: "AI Symptom Checker",
    icon: CalendarDays,
    color: "bg-purple-500",
    path: "/symptom-checker"
  },
  {
    title: "Medical Test Booking",
    icon: CalendarCheck,
    color: "bg-green-500",
    path: "/test-booking"
  },
  {
    title: "Digital Medical Vault",
    icon: HeartHandshake,
    color: "bg-yellow-500",
    path: "/Vault"
  },
  {
    title: "Emergency e-Ambulance",
    icon: Calendar,
    color: "bg-red-500",
    path: "/ambulance"
  }
];

const PatientDashboard = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const monthDays = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay();
  const formattedMonth = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const { user } = useAuth();
  const { userData, userId, loading: userLoading } = useUserData();

  // Debug logging
  console.log("=== PatientDashboard Debug ===");
  console.log("Supabase Auth User:", user);
  console.log("Supabase Auth User ID:", user?.id);
  console.log("UserData from useUserData:", userData);
  console.log("UserId from useUserData:", userId);
  console.log("UserLoading:", userLoading);
  console.log("==============================");

  const selectedDayEvents = selectedDate ? events[selectedDate] ?? [] : [];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6 items-start min-h-[500px]">

        {/* Modules */}
        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm p-4 h-fit">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-700">Calendar</h2>
            <div className="flex items-center space-x-2">
              <button onClick={() => {
                const newDate = new Date(year, month - 1);
                setMonth(newDate.getMonth());
                setYear(newDate.getFullYear());
                setSelectedDate(null);
              }}>
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-xs text-gray-600">{formattedMonth}</span>
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

          <div className="grid grid-cols-7 gap-[2px] text-center text-[11px] text-gray-800">
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
                  className={`relative py-[6px] h-9 w-full rounded flex items-center justify-center cursor-pointer ${
                    isSelected ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  {date.getDate()}
                  {hasEvents && (
                    <div className="absolute bottom-[-6px]">
                      <Dot className="text-red-500 w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-600 mb-1">
                {`Events on ${new Date(selectedDate).toDateString()}`}
              </h3>
              {selectedDayEvents.length > 0 ? (
                <ul className="space-y-1 text-xs text-gray-600">
                  {selectedDayEvents.map((e, i) => (
                    <li key={i} className="flex items-center gap-1">
                      {e.icon}
                      <span>{e.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 italic">No events.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
