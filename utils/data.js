 export const badgeClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "Canceled":
        return "bg-rose-50 text-rose-700 ring-rose-200";
      case "Postponed":
      default:
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
  };

  export const noticeClasses = (status) => {
    switch (status) {
      case "Canceled":
        return "bg-rose-50 text-black ring-rose-200";
      case "Postponed":
      default:
        return "bg-amber-50 text-amber-950 ring-amber-200";
    }
  };

  export const formatDateTime = (value) => {
    if (!value) return "-";
  
    try {
      const isoValue = String(value).replace(" ", "T");
      const date = new Date(isoValue);
  
      if (Number.isNaN(date.getTime())) return value;
  
      const pad = (n) => String(n).padStart(2, "0");
  
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    } catch {
      return value;
    }
  };
  
  export const getCompanyInitials = (companyName) =>
    companyName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "CO";







  //? Dummy Data for Daily Schedules and Dummy Departments/Jobs
export const dailySchedules = [
  {
    id: 1,
    client: "St. Jude Hospital",
    time: "08:00 AM - 04:00 PM",
    status: "Confirmed",
    type: "On-site",
  },
  {
    id: 2,
    client: "Oakwood Care Home",
    time: "09:30 AM - 02:00 PM",
    status: "Postponed",
    type: "Clinical",
    alert: "Rescheduled to 11:00 AM",
  },
  {
    id: 3,
    client: "Global Security HQ",
    time: "10:00 AM - 06:00 PM",
    status: "Canceled",
    type: "Security",
    alert: "Client canceled due to site maintenance",
  },
  {
    id: 4,
    client: "Northside Clinic",
    time: "11:00 AM - 07:00 PM",
    status: "Confirmed",
    type: "Nursing",
  },
];

export const dummyDepartments = [
  {
    departmentId: 101,
    companyId: 900001,
    departmentName: "Operations",
    departmentDescription:
      "Day-to-day service delivery, rostering, and incident follow-ups.",
    createdDate: "2025-01-12 09:20:10",
    updatedDate: "2025-02-03 15:41:22",
  },
  {
    departmentId: 102,
    companyId: 900001,
    departmentName: "Clinical & Care",
    departmentDescription:
      "Care plans, medication oversight, and clinical governance.",
    createdDate: "2025-01-14 11:05:42",
    updatedDate: "2025-02-08 10:12:05",
  },
  {
    departmentId: 103,
    companyId: 900001,
    departmentName: "HR & People",
    departmentDescription:
      "Recruitment, onboarding, training, and compliance documentation.",
    createdDate: "2025-01-20 13:33:18",
    updatedDate: "2025-02-11 09:47:50",
  },
  {
    departmentId: 104,
    companyId: 900001,
    departmentName: "Finance",
    departmentDescription: "Billing, payroll, invoicing, and budget tracking.",
    createdDate: "2025-01-22 08:10:00",
    updatedDate: "2025-02-15 16:20:14",
  },
  {
    departmentId: 105,
    companyId: 900001,
    departmentName: "Quality & Compliance",
    departmentDescription:
      "Audits, policy control, incident reporting, and risk management.",
    createdDate: "2025-01-28 10:45:33",
    updatedDate: "2025-02-20 14:05:09",
  },
  {
    departmentId: 106,
    companyId: 900001,
    departmentName: "IT & Systems",
    departmentDescription:
      "User access, devices, integrations, and platform support.",
    createdDate: "2025-02-01 12:00:00",
    updatedDate: "2025-02-23 09:25:30",
  },
];

// Dummy Job Types

export const dummyJobTypes = [
  {
    jobId: 1,
    jobType: "Course",
    jobCode: "COURSE",
    description: "Educational or training sessions",
  },
  {
    jobId: 2,
    jobType: "Support",
    jobCode: "SUPPORT",
    description: "Assistance provided to clients",
  },
  {
    jobId: 3,
    jobType: "Service",
    jobCode: "SERVICE",
    description: "General service tasks",
  },
  {
    jobId: 4,
    jobType: "Assessment",
    jobCode: "ASSESS",
    description: "Skills or needs assessments",
  },
  {
    jobId: 5,
    jobType: "Planning",
    jobCode: "PLAN",
    description: "Session for goal or schedule planning",
  },
  {
    jobId: 6,
    jobType: "Transport",
    jobCode: "TRANSPORT",
    description: "Travel or transportation jobs",
  },
  {
    jobId: 7,
    jobType: "Administration",
    jobCode: "ADMIN",
    description: "Administrative and clerical work",
  },
  {
    jobId: 8,
    jobType: "Community Engagement",
    jobCode: "COMM",
    description: "Activities that involve the community",
  },
  {
    jobId: 9,
    jobType: "Supervision",
    jobCode: "SUPERV",
    description: "Monitoring or oversight tasks",
  },
  {
    jobId: 10,
    jobType: "Technology Support",
    jobCode: "TECH",
    description: "Help with devices or digital systems",
  },
  {
    jobId: 11,
    jobType: "Consultation",
    jobCode: "CONSULT",
    description: "Advisory or professional consulting sessions",
  },
];

// Dummy Jobs
export const dummyJobs = [
  {
    jobId: "NDIS_OT1",
    jobCode: "NDIS_OT",
    jobType: "Support",
    companyId: "6647711000079186391",
    ratesPerHour: 120.0,
    discount1: 0.0,
    discount2: 0.0,
    employeePercent: "0.00%",
    currency: "AUD",
  },
  {
    jobId: "NDIS_Dental1",
    jobCode: "NDIS_Dental",
    jobType: "Support",
    companyId: "6647711000079186391",
    ratesPerHour: 120.0,
    discount1: 0.0,
    discount2: 0.0,
    employeePercent: "0.00%",
    currency: "AUD",
  },
  {
    jobId: "NDIS_PHYS1",
    jobCode: "NDIS_Physio",
    jobType: "Support",
    companyId: "6647711000079186391",
    ratesPerHour: 115.0,
    discount1: 5.0,
    discount2: 0.0,
    employeePercent: "2.50%",
    currency: "AUD",
  },
  {
    jobId: "NDIS_NUR1",
    jobCode: "NDIS_Nursing",
    jobType: "Support",
    companyId: "6647711000079186391",
    ratesPerHour: 130.0,
    discount1: 0.0,
    discount2: 3.0,
    employeePercent: "3.00%",
    currency: "AUD",
  },
  {
    jobId: "NDIS_SPCH1",
    jobCode: "NDIS_Speech",
    jobType: "Support",
    companyId: "6647711000079186391",
    ratesPerHour: 110.0,
    discount1: 2.0,
    discount2: 1.0,
    employeePercent: "1.50%",
    currency: "AUD",
  },
];

export const dummyLogins = [
  {
    email: "john.doe@acme.com",
    companyId: 1001,
    accessLevel: "ADMIN",
    lastLogin: "2026-03-03 08:45:12",
    failedLoginAttempts: 0,
  },
  {
    email: "jane.smith@acme.com",
    companyId: 1001,
    accessLevel: "SUPERVISOR",
    lastLogin: "2026-03-02 17:21:45",
    failedLoginAttempts: 1,
  },
  {
    email: "samuel.okafor@acme.com",
    companyId: 1001,
    accessLevel: "USER",
    lastLogin: "2026-03-01 10:05:02",
    failedLoginAttempts: 3,
  },
  {
    email: "fatima.yusuf@acme.com",
    companyId: 1001,
    accessLevel: "USER",
    lastLogin: null,
    failedLoginAttempts: 0,
  },
  {
    email: "support@acme.com",
    companyId: 1001,
    accessLevel: "AUDITOR",
    lastLogin: "2026-02-28 13:11:30",
    failedLoginAttempts: 0,
  },
];