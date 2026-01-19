import { useEffect, useState } from "react";

/* ===== CONFIG ===== */
const RADIUS = 92;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const WORK_HOURS_MS = 8 * 60 * 60 * 1000;

const Dashboard = () => {
  const [isIn, setIsIn] = useState(false);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [user, setUser] = useState(null);
  const [, tick] = useState(0);

  /* ===== RESTORE STATE ===== */
  useEffect(() => {
    const u = localStorage.getItem("user");
    const ii = localStorage.getItem("isIn");
    const it = localStorage.getItem("inTime");
    const ot = localStorage.getItem("outTime");

    if (u) setUser(JSON.parse(u));
    if (ii === "true" && it) {
      setIsIn(true);
      setInTime(Number(it));
    }
    if (ot) setOutTime(Number(ot));
  }, []);

  /* ===== LIVE UI TICK ===== */
  useEffect(() => {
    if (!isIn) return;
    const t = setInterval(() => tick(v => v + 1), 1000);
    return () => clearInterval(t);
  }, [isIn]);

  /* ===== ACTIONS ===== */
  const handleIn = () => {
    const now = Date.now();
    setIsIn(true);
    setInTime(now);
    setOutTime(null);
    localStorage.setItem("isIn", "true");
    localStorage.setItem("inTime", now);
    localStorage.removeItem("outTime");
  };

  const handleOut = () => {
    const now = Date.now();
    setIsIn(false);
    setOutTime(now);

    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    reports.push({
      name: user?.name || "User",
      email: user?.email || "-",
      inTime,
      outTime: now,
      status: "OUT",
    });
    localStorage.setItem("reports", JSON.stringify(reports));

    localStorage.removeItem("isIn");
    localStorage.removeItem("inTime");
    localStorage.setItem("outTime", now);
  };

  /* ===== HELPERS ===== */
  const runningTime = isIn && inTime ? Date.now() - inTime : 0;

  const formatHHMMSS = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const formatDateTime = (t) => {
    if (!t) return "--";
    const d = new Date(t);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    let h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${dd}/${mm}/${yyyy} ${String(h).padStart(2, "0")}:${min} ${ampm}`;
  };

  const today = (() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  })();

  const progress = Math.min(runningTime / WORK_HOURS_MS, 1);
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const completed = runningTime >= WORK_HOURS_MS;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* 🔥 TOP DASHBOARD HEADING (WHITE SPACE AREA) */}
      <div className="mt-10 mb-8 text-center">
        <h1
          className="text-4xl font-extrabold tracking-tight
          bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500
          bg-clip-text text-transparent animate-fadeSlide"
        >
          Smart Attendance Dashboard
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Track your daily work hours in real time
        </p>
      </div>

      {/* ===== CARDS ===== */}
      <div className="flex gap-10 mt-4">

        {/* LEFT CIRCLE */}
        <div className="bg-white rounded-3xl shadow-xl p-6 w-[280px] text-center">
          <svg width="240" height="240" className="rotate-[-90deg] mx-auto">
            <circle cx="120" cy="120" r={RADIUS} stroke="#e5e7eb" strokeWidth="14" fill="none" />
            <circle
              cx="120"
              cy="120"
              r={RADIUS}
              stroke={completed ? "#22c55e" : "#3b82f6"}
              strokeWidth="14"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="-mt-[150px]">
            <p className="text-gray-500 text-sm">WORKING TIME</p>
            <p className="text-3xl font-mono font-bold">{formatHHMMSS(runningTime)}</p>
            <span className={`text-sm font-semibold ${isIn ? "text-green-600" : "text-red-600"}`}>
              {completed ? "COMPLETED (8H)" : isIn ? "IN" : "OUT"}
            </span>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-6 w-[420px]">
          <div className="flex gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <p className="font-semibold">{user?.name || "User"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2 text-center">{today}</p>

          <p className="text-center text-sm font-semibold tracking-wide mb-1
            bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500
            bg-clip-text text-transparent animate-fadeSlide">
            Smart Attendance Tracking
          </p>

          <h2 className="text-2xl font-extrabold text-center mb-5">
            Attendance
          </h2>

          <div className="flex justify-center gap-4 mb-6">
            <button onClick={handleIn} disabled={isIn} className="px-6 py-2 bg-green-500 text-white rounded-xl">
              IN
            </button>
            <button onClick={handleOut} disabled={!isIn} className="px-6 py-2 bg-red-500 text-white rounded-xl">
              OUT
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <p><b>IN Time:</b> {formatDateTime(inTime)}</p>
            <p><b>OUT Time:</b> {formatDateTime(outTime)}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
