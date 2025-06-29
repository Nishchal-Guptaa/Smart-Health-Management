import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/lib/userService";
import { supabase } from "@/lib/supabase";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Format date to YYYY-MM-DD
const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const DoctorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<Record<string, any>>({});
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const { toast } = useToast();
  const [vaultModalUserId, setVaultModalUserId] = useState<string | null>(null);
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [vaultLoading, setVaultLoading] = useState(false);

  // Fetch doctor id after auth loads
  useEffect(() => {
    if (!authLoading && user?.email) {
      console.log("[DoctorDashboard] Fetching doctor by email:", user.email);
      userService.getDoctorByEmail(user.email)
        .then(doctor => {
          console.log("[DoctorDashboard] Doctor fetched:", doctor);
          setDoctorId(doctor?.id || null);
        })
        .catch(err => {
          console.error("[DoctorDashboard] Error fetching doctor:", err);
        });
    }
  }, [authLoading, user]);

  // Fetch appointments after doctorId or month/year changes
  useEffect(() => {
    if (doctorId) {
      setLoading(true);
      // Calculate the last day of the month correctly
      const lastDay = new Date(year, month + 1, 0).getDate();
      const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      console.log("[DoctorDashboard] Fetching appointments for doctorId:", doctorId, "from", start, "to", end);
      supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", doctorId)
        .gte("appointment_date", start)
        .lte("appointment_date", end)
        .then(async ({ data, error }) => {
          if (error) {
            console.error("[DoctorDashboard] Error fetching appointments:", error);
          } else {
            console.log("[DoctorDashboard] Appointments fetched:", data);
          }
          if (!error && data) {
            setAppointments(data);
            // Fetch all unique patient IDs
            const patientIds = Array.from(new Set(data.map(a => a.patient_id)));
            console.log("[DoctorDashboard] Unique patient IDs:", patientIds);
            // Batch fetch all patients
            if (patientIds.length > 0) {
              const { data: patientData, error: patientError } = await supabase
                .from("users")
                .select("id,first_name,last_name")
                .in("id", patientIds);
              if (patientError) {
                console.error("[DoctorDashboard] Error fetching patients:", patientError);
              } else {
                console.log("[DoctorDashboard] Patients fetched:", patientData);
              }
              if (!patientError && patientData) {
                // Map patient id to patient object
                const patientMap: Record<string, any> = {};
                patientData.forEach((p: any) => {
                  patientMap[p.id] = p;
                });
                setPatients(patientMap);
              }
            }
          }
          setLoading(false);
        });
    } else {
      console.log("[DoctorDashboard] doctorId not set, skipping appointments fetch.");
    }
  }, [doctorId, month, year]);

  // Group appointments by date
  const events: Record<string, any[]> = {};
  appointments.forEach((appt) => {
    if (!events[appt.appointment_date]) events[appt.appointment_date] = [];
    events[appt.appointment_date].push(appt);
  });

  const today = new Date();
  const monthDays = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay();
  const formattedMonth = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const selectedDayEvents = selectedDate ? events[selectedDate] ?? [] : [];

  // Calculate stats for cards
  const todayStr = formatDateKey(new Date());
  const appointmentsToday = appointments.filter(a => a.appointment_date === todayStr).length;
  const appointmentsThisMonth = appointments.length;
  const pendingInvites = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length;

  // Handler for accepting/rejecting appointments
  const handleStatusChange = async (id: string, status: string) => {
    setActionLoadingId(id);
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);
    setActionLoadingId(null);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Appointment ${status === 'completed' ? 'accepted' : 'rejected'}.` });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  const fetchUserVaultFiles = async (userId: string) => {
    setVaultLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/files/user/${userId}`);
      const data = await res.json();
      setVaultFiles(
        (data.files || []).map((file: any) => ({
          ...file,
          prescribedAt: file.prescribed_at,
        }))
      );
    } catch (err) {
      setVaultFiles([]);
    } finally {
      setVaultLoading(false);
    }
  };

  if (authLoading || loading) return <div>Loading...</div>;

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
                {selectedDayEvents.map((appt, i) => (
                  <li key={i} className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-green-500" />
                      <span className="font-medium">
                        {patients[appt.patient_id]
                          ? `${patients[appt.patient_id].first_name} ${patients[appt.patient_id].last_name}`
                          : "Unknown Patient"} – {appt.appointment_time}
                      </span>
                    </div>
                    {appt.reason && (
                      <span className="text-xs italic text-gray-500">{appt.reason}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : selectedDate ? (
              <p className="text-sm text-gray-500 italic">No patients scheduled for this day.</p>
            ) : null}
          </div>
        </div>

        {/* Pending and Confirmed Appointments to the right of calendar */}
        <div className="lg:col-span-3 mt-8 flex flex-col gap-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <Card className="text-center shadow hover:shadow-lg">
              <CardContent className="py-4">
                <div className="flex justify-center items-center gap-2 text-2xl font-bold text-blue-600">
                  <CalendarCheck className="w-5 h-5" /> {appointmentsToday}
                </div>
                <div className="text-sm text-gray-600">Appointments Today</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow hover:shadow-lg">
              <CardContent className="py-4">
                <div className="flex justify-center items-center gap-2 text-2xl font-bold text-green-600">
                  <CalendarDays className="w-5 h-5" /> {appointmentsThisMonth}
                </div>
                <div className="text-sm text-gray-600">Appointments This Month</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow hover:shadow-lg">
              <CardContent className="py-4">
                <div className="flex justify-center items-center gap-2 text-2xl font-bold text-yellow-600">
                  <ClipboardList className="w-5 h-5" /> {pendingInvites}
                </div>
                <div className="text-sm text-gray-600">Pending Invites</div>
              </CardContent>
            </Card>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Appointments for {selectedDate ? new Date(selectedDate).toDateString() : '...'}
          </h2>
          {selectedDate ? (
            <>
              {/* Pending Appointments */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-700 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" /> Pending Appointments
                </h3>
                {selectedDayEvents.filter(appt => appt.status !== 'completed' && appt.status !== 'cancelled').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {selectedDayEvents.filter(appt => appt.status !== 'completed' && appt.status !== 'cancelled').map((appt, i) => {
                      const patient = patients[appt.patient_id];
                      const initials = patient ? `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase() : 'U';
                      return (
                        <div
                          key={i}
                          className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-yellow-500 p-5 flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-xl font-bold text-yellow-700">
                              {initials}
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <Clock className="w-4 h-4 inline-block text-yellow-400" /> {appt.appointment_time}
                              </div>
                            </div>
                          </div>
                          <div className="text-gray-700 mb-1">
                            <span className="font-semibold">Reason:</span> {appt.reason || '-'}
                          </div>
                          {appt.notes && (
                            <div className="text-gray-500 text-sm">
                              <span className="font-semibold">Notes:</span> {appt.notes}
                            </div>
                          )}
                          <div className="flex gap-2 mt-2">
                            <button
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded transition disabled:opacity-50"
                              disabled={actionLoadingId === appt.id}
                              onClick={() => handleStatusChange(appt.id, 'completed')}
                            >
                              {actionLoadingId === appt.id ? 'Accepting...' : 'Accept'}
                            </button>
                            <button
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition disabled:opacity-50"
                              disabled={actionLoadingId === appt.id}
                              onClick={() => handleStatusChange(appt.id, 'cancelled')}
                            >
                              {actionLoadingId === appt.id ? 'Rejecting...' : 'Reject'}
                            </button>
                            <button
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition disabled:opacity-50"
                              onClick={() => {
                                if (patient?.id) {
                                  setVaultModalUserId(patient.id);
                                  fetchUserVaultFiles(patient.id);
                                }
                              }}
                            >
                              View Vault
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <ClipboardList className="w-10 h-10 mb-2" />
                    <div className="text-base font-semibold">No pending appointments for this day.</div>
                  </div>
                )}
              </div>
              {/* Confirmed Appointments */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-green-500" /> Confirmed Appointments
                </h3>
                {selectedDayEvents.filter(appt => appt.status === 'completed').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {selectedDayEvents.filter(appt => appt.status === 'completed').map((appt, i) => {
                      const patient = patients[appt.patient_id];
                      const initials = patient ? `${patient.first_name[0] || ''}${patient.last_name[0] || ''}`.toUpperCase() : 'U';
                      return (
                        <div
                          key={i}
                          className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 border-green-500 p-5 flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl font-bold text-green-700">
                              {initials}
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                {patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient'}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <Clock className="w-4 h-4 inline-block text-green-400" /> {appt.appointment_time}
                              </div>
                            </div>
                          </div>
                        
                          {appt.notes && (
                            <div className="text-gray-500 text-sm">
                              <span className="font-semibold">Notes:</span> {appt.notes}
                            </div>
                          )}
                          <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 self-start">Confirmed</span>
                          <div className="flex gap-2 mt-2">
                            <button
                              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition disabled:opacity-50"
                              onClick={() => {
                                if (patient?.id) {
                                  setVaultModalUserId(patient.id);
                                  fetchUserVaultFiles(patient.id);
                                }
                              }}
                            >
                              View Vault
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <CalendarCheck className="w-10 h-10 mb-2" />
                    <div className="text-base font-semibold">No confirmed appointments for this day.</div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <CalendarDays className="w-12 h-12 mb-2" />
              <div className="text-lg font-semibold">Select a date to view appointments.</div>
            </div>
          )}
        </div>

      </div>
      {vaultModalUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setVaultModalUserId(null)}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">User Medical History </h2>
            {vaultLoading ? (
              <p>Loading files...</p>
            ) : vaultFiles.length === 0 ? (
              <p>No files found for this user.</p>
            ) : (
              <div className="space-y-4">
                {vaultFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center p-3 rounded border hover:shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        Type: {file.type} | Prescribed: {file.prescribedAt ? new Date(file.prescribedAt).toLocaleString() : "N/A"}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => window.open(file.url, "_blank")}
                        className="inline-block px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
