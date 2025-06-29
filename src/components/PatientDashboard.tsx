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
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useUserData } from "@/hooks/useUserData";

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
    path: "/appointments",
    description: "Book appointments with top doctors in seconds."
  },
  {
    title: "AI Symptom Checker",
    icon: CalendarDays,
    color: "bg-blue-500",
    path: "/symptom-checker",
    description: "Get instant health insights powered by AI."
  },
  {
    title: "Medical Test Booking",
    icon: CalendarCheck,
    color: "bg-blue-500",
    path: "/test-booking",
    description: "Find and book lab tests at your convenience."
  },
  {
    title: "Digital Medical Vault",
    icon: HeartHandshake,
    color: "bg-blue-500",
    path: "/Vault",
    description: "Securely store and access your medical records."
  },
  {
    title: "Emergency Services",
    icon: Calendar,
    color: "bg-blue-500",
    path: "/ambulance",
    description: "Quickly request emergency ambulance services."
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

  const { userData, userType, loading: userLoading } = useUserData();

  const selectedDayEvents = selectedDate ? events[selectedDate] ?? [] : [];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-0 px-0 sm:px-0 lg:px-0">
      {/* Hero Section */}
      <div className="w-full bg-white border-b border-gray-200 py-8 px-4 md:px-16 flex flex-col md:flex-row items-center justify-between shadow-sm">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Welcome, {userData?.first_name}!</h1>
          <p className="text-base md:text-lg text-gray-500">Your health, your control. Explore your smart health dashboard.</p>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <div className="rounded-full bg-blue-100 shadow p-2 mb-2">
            <CalendarDays className="w-10 h-10 text-blue-500" />
          </div>
          <span className="text-gray-700 text-base font-semibold">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8 items-start min-h-[500px] py-10 px-4 sm:px-6 lg:px-12">
        {/* Sidebar: User Info + Calendar */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center xl:items-start xl:col-span-1 mb-8 xl:mb-0 border border-gray-200">
          <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow">
            {userData?.first_name?.[0] || "U"}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{userData?.first_name} {userData?.last_name}</h2>
          <p className="text-gray-500 mb-2">{userData?.email}</p>
          <div className="flex flex-col gap-1 w-full mt-2 mb-6">
            <span className="text-sm text-gray-600"><b>Phone:</b> {userData?.phone || "-"}</span>
            {userType === 'user' && (
              <>
                {'blood_group' in userData ? (
                  <span className="text-sm text-gray-600"><b>Blood Group:</b> {userData.blood_group || "-"}</span>
                ) : null}
                {'emergency_contact_name' in userData ? (
                  <span className="text-sm text-gray-600"><b>Emergency Contact:</b> {userData.emergency_contact_name || "-"}</span>
                ) : null}
              </>
            )}
          </div>
          {/* Calendar in Sidebar */}
          <div className="w-full bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-700">Calendar</h2>
              <div className="flex items-center space-x-2">
                <button onClick={() => {
                  const newDate = new Date(year, month - 1);
                  setMonth(newDate.getMonth());
                  setYear(newDate.getFullYear());
                  setSelectedDate(null);
                }} className="rounded-full bg-gray-100 hover:bg-gray-200 p-1 transition">
                  <ChevronLeft className="w-4 h-4 text-blue-500" />
                </button>
                <span className="text-xs text-gray-600">{formattedMonth}</span>
                <button onClick={() => {
                  const newDate = new Date(year, month + 1);
                  setMonth(newDate.getMonth());
                  setYear(newDate.getFullYear());
                  setSelectedDate(null);
                }} className="rounded-full bg-gray-100 hover:bg-gray-200 p-1 transition">
                  <ChevronRight className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 text-[11px] text-center text-gray-500 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-[2px] text-center text-[13px] text-gray-800">
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

        {/* Main Content: Modules Only */}
        <div className="xl:col-span-3 flex flex-col gap-8">
          {/* Module Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreModules.map((module, index) => (
              <div
                key={index}
                className={`rounded-xl shadow p-6 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center bg-white border border-gray-200`}
                onClick={() => navigate(module.path)}
              >
                <div className="mb-4 bg-blue-100 rounded-full p-3 shadow">
                  <module.icon className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">{module.title}</h4>
                <p className="text-gray-600 text-center text-sm mb-2">{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
