"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ReusableTable from "../components/ReusableTable";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";
import { toast } from "react-toastify";

// const EmployeeClientSchedule = () => {
//     const [schedule, setSchedule] = useState( dummySchedule || []);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const router = useRouter();

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem("user"));

//         if (!user || !user.companyId || !user.employeeId) {
//             setError("User information is missing from local storage.");
//             setLoading(false);
//             setTimeout(() => {
//                              router.replace("/login");
//                          }, 500);
//         }

//         const fetchSchedule = async () => {
//             try {
//                 const response = await fetch(
//                     `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/id/${user.companyId}/${user.employeeId}`,
//                     {
//                         method: "GET",
//                         headers: { "Accept": "application/json" },
//                         credentials: "include",
//                     }
//                 );

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch schedule data");
//                 }

//                 const data = await response.json();
//                 setSchedule(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchSchedule();
//     }, []);

//     if (loading) {
//         return <div className="text-center mt-10 text-blue-500">Loading schedule...</div>;
//     }

//     if (!error) {
//         return <div className="text-red-500 text-center mt-10 h-[80vh] flex justify-center items-center">Error: {error}</div>;
//     }

//     return (
//         <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//             <h1 className="text-2xl font-bold text-center mb-4">Employee Client Schedule</h1>
//             {schedule.length > 0 ? (
//                 <table className="min-w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-100">
//                             <th className="border p-2">Booking ID</th>
//                             <th className="border p-2">Client Name</th>
//                             <th className="border p-2">Email</th>
//                             <th className="border p-2">Phone</th>
//                             <th className="border p-2">Job Code</th>
//                             <th className="border p-2">Start Time</th>
//                             <th className="border p-2">End Time</th>
//                             <th className="border p-2">Work Location</th>
//                             <th className="border p-2">Client Cancel</th>
//                              <th className="border p-2">Client Reschedule</th>
//                             <th className="border p-2">Employee Cancel</th>
//                             <th className="border p-2">Date Complete</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {schedule.map((item) => (
//                             <tr key={item.clientBookingId} className="hover:bg-gray-100">
//                                 <td className="border p-2 text-center">{item.clientBookingId}</td>
//                                 <td className="border p-2">{`${item?.firstName} ${item.lastName}`}</td>
//                                 <td className="border p-2">{item?.email}</td>
//                                 <td className="border p-2">{item?.phoneNumber || "N/A"}</td>
//                                 <td className="border p-2">{item?.jobCode}</td>
//                                 <td className="border p-2">{item?.startTime}</td>
//                                 <td className="border p-2">{item?.endTime}</td>
//                                 <td className="border p-2">{item?.workLocation || "N/A"}</td>
//                                 <td className="border p-2 text-center">
//                                     {item?.clientCancel ? (
//                                         <span className="text-red-500">Yes</span>
//                                     ) : (
//                                         <span className="text-green-500">No</span>
//                                     )}
//                                 </td>
//                                 <td className="border p-2 text-center">
//                                     {item.clientReschedule ? (
//                                          <span className="text-red-500">Yes</span>
//                                     ) : (
//                                         <span className="text-green-500">No</span>
//                                     )}
//                                 </td>
//                                 <td className="border p-2 text-center">
//                                     {item.employeeCancel ? (
//                                         <span className="text-red-500">Yes</span>
//                                     ) : (
//                                         <span className="text-green-500">No</span>
//                                     )}
//                                 </td>
//                                 <td className="border p-2">{item.dateComplete || "Not Completed"}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : (
//                 <p className="text-center text-gray-500">No schedule found.</p>
//             )}
//             {/* Home Button */}
//             <div className="text-center mt-6">
//                 <Link href="/home">
//                     <button className="inline-block px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200">
//                         Home
//                     </button>
//                 </Link>
//             </div>
//         </div>
//     );
// };

const dummySchedule = [
  {
    clientBookingId: "BK001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+2348012345678",
    jobCode: "HC-101",
    startTime: "2026-03-20T09:00:00",
    endTime: "2026-03-20T12:00:00",
    workLocation: "Abuja - Wuse Zone 2",
    clientCancel: false,
    clientReschedule: false,
    employeeCancel: false,
    dateComplete: "2026-03-20",
  },
  {
    clientBookingId: "BK002",
    firstName: "Amina",
    lastName: "Yusuf",
    email: "amina.yusuf@example.com",
    phoneNumber: "+2348098765432",
    jobCode: "HC-202",
    startTime: "2026-03-21T13:00:00",
    endTime: "2026-03-21T16:00:00",
    workLocation: "Abuja - Garki",
    clientCancel: true,
    clientReschedule: false,
    employeeCancel: false,
    dateComplete: null,
  },
  {
    clientBookingId: "BK003",
    firstName: "Michael",
    lastName: "Okafor",
    email: "michael.okafor@example.com",
    phoneNumber: null,
    jobCode: "HC-303",
    startTime: "2026-03-22T08:00:00",
    endTime: "2026-03-22T11:00:00",
    workLocation: null,
    clientCancel: false,
    clientReschedule: true,
    employeeCancel: false,
    dateComplete: null,
  },
  {
    clientBookingId: "BK004",
    firstName: "Grace",
    lastName: "Ibrahim",
    email: "grace.ibrahim@example.com",
    phoneNumber: "+2348076543210",
    jobCode: "HC-404",
    startTime: "2026-03-23T10:00:00",
    endTime: "2026-03-23T14:00:00",
    workLocation: "Abuja - Maitama",
    clientCancel: false,
    clientReschedule: false,
    employeeCancel: true,
    dateComplete: null,
  },
  {
    clientBookingId: "BK005",
    firstName: "David",
    lastName: "Balogun",
    email: "david.balogun@example.com",
    phoneNumber: "+2348031122334",
    jobCode: "HC-505",
    startTime: "2026-03-24T15:00:00",
    endTime: "2026-03-24T18:00:00",
    workLocation: "Abuja - Asokoro",
    clientCancel: false,
    clientReschedule: false,
    employeeCancel: false,
    dateComplete: "2026-03-24",
  },
];

const EmployeeClientSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false); // false if you want dummy data visible immediately
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.companyId || !user.employeeId) {
      setError("User information is missing from local storage.");
      setLoading(false);
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    }

    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/clientschedule/id/${user.companyId}/${user.employeeId}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            credentials: "include",
          },
        );

        if (!response.ok) {
          toast.error("Failed to fetch schedule data");
        }

        const data = await response.json();
        setSchedule(data);
      } catch (err) {
        toast.error(err.message)
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const formatDateTime = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

const formatDateOnly = (value) => {
  if (!value) return "Not Completed";

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

  const yesNoBadge = (value) => (
    <span
      className={
        value ? "text-red-500 font-medium" : "text-green-500 font-medium"
      }
    >
      {value ? "Yes" : "No"}
    </span>
  );

  const columns = [
    {
      header: "Booking ID",
      accessor: "clientBookingId",
      align: "center",
    },
    {
      header: "Client Name",
      render: (row) =>
        `${row?.firstName || ""} ${row?.lastName || ""}`.trim() || "N/A",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      render: (row) => row?.phoneNumber || "N/A",
    },
    {
      header: "Job Code",
      accessor: "jobCode",
      align: "center",
    },
    {
      header: "Start Time",
      render: (row) => formatDateTime(row?.startTime),
    },
    {
      header: "End Time",
      render: (row) => formatDateTime(row?.endTime),
    },
    {
      header: "Work Location",
      render: (row) => row?.workLocation || "N/A",
    },
    {
      header: "Client Cancel",
      render: (row) => yesNoBadge(row?.clientCancel),
      align: "center",
    },
    {
      header: "Client Reschedule",
      render: (row) => yesNoBadge(row?.clientReschedule),
      align: "center",
    },
    {
      header: "Employee Cancel",
      render: (row) => yesNoBadge(row?.employeeCancel),
      align: "center",
    },
    {
      header: "Date Complete",
      render: (row) => formatDateOnly(row?.dateComplete),
    },
  ];

  if (loading) {
    return <ViewEmployeesSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 h-[80vh] flex justify-center items-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="h-[85vh]  py-4 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] ">
      <div className="max-w-360 mx-auto mt-20  pt-6  bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Employee Client Schedule
        </h1>

        <ReusableTable
          data={schedule}
          columns={columns}
          getRowKey={(row) => row.clientBookingId}
          emptyText="No schedule found."
          footerLeft={`Total schedules: ${schedule.length}`}
          footerRight="Employee schedule overview"
        />
      </div>
    </div>
  );
};

export default EmployeeClientSchedule;
