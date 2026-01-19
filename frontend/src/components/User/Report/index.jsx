import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Report = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("reports") || "[]");
    setReports(data);
  }, []);

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

  const getDuration = (inT, outT) => {
    if (!inT || !outT) return "--";
    const diff = outT - inT;
    const s = Math.floor(diff / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // ✅ FIXED PDF EXPORT
  const exportPDF = () => {
    if (reports.length === 0) {
      alert("No attendance data to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Attendance Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [["#", "Name", "Email", "IN Time", "OUT Time", "Status", "Duration"]],
      body: reports.map((r, i) => [
        i + 1,
        r.name,
        r.email,
        formatDateTime(r.inTime),
        formatDateTime(r.outTime),
        r.status,
        getDuration(r.inTime, r.outTime),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] }, // blue header
    });

    doc.save("attendance-report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Attendance Report
            </h1>
            <p className="text-sm text-gray-500">
              Daily login & logout activity
            </p>
          </div>

          <button
            onClick={exportPDF}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
          >
            📄 Export PDF
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 text-slate-600 text-sm uppercase">
                <tr>
                  <th className="px-5 py-4 text-left">#</th>
                  <th className="px-5 py-4 text-left">User</th>
                  <th className="px-5 py-4 text-left">Email</th>
                  <th className="px-5 py-4 text-left">IN Time</th>
                  <th className="px-5 py-4 text-left">OUT Time</th>
                  <th className="px-5 py-4 text-left">Status</th>
                  <th className="px-5 py-4 text-left">Duration</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {reports.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-400">
                      No attendance data available
                    </td>
                  </tr>
                )}

                {reports.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-5 py-4 font-medium">{i + 1}</td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                          {r.name?.[0] || "U"}
                        </div>
                        <span className="font-medium text-gray-800">
                          {r.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {r.email}
                    </td>

                    <td className="px-5 py-4">
                      {formatDateTime(r.inTime)}
                    </td>

                    <td className="px-5 py-4">
                      {formatDateTime(r.outTime)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        {r.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {getDuration(r.inTime, r.outTime)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Report;
