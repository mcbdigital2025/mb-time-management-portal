import { Testimonial } from "../types";

export const links = [
  { name: "Product", href: "/product" },
  { name: "Industrie", href: "/industries" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const productLinks = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Integrations", href: "#" },
  { label: "Updates", href: "#" },
];

export const companyLinks = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

export const supportLinks = [
  { label: "Help Center", href: "#" },
  { label: "API Docs", href: "#" },
  { label: "Status", href: "#" },
];

export const navItems = [
  { label: "Product", href: "/" },
  { label: "Industrie", href: "/industrie" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const steps = [
  {
    num: "01",
    title: "Create schedules",
    desc: "Drag and drop shifts, assign staff, and publish to their mobile app instantly.",
  },
  {
    num: "02",
    title: "Staff check in",
    desc: "Drag and drop shifts, assign staff, and publish to their mobile app instantly.",
  },
  {
    num: "03",
    title: "Create schedules",
    desc: "Drag and drop shifts, assign staff, and publish to their mobile app instantly.",
  },
];

export type Feature = {
  title: string;
  desc: string;
  icon: React.ReactNode;
};




export const testimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Operations Manager",
    company: "HomeFirst Care",
    quote: "“Cut scheduling time in half. Our team loves the mobile app.”",
  },
  {
    name: "Mike Johnson",
    role: "Director",
    company: "SecureGuard Solutions",
    quote: "“Cut scheduling time in half. Our team loves the mobile app.”",
  },
  {
    name: "Dr. Lisa Patel",
    role: "Clinic Manager",
    company: "City Health Dental",
    quote: "“Cut scheduling time in half. Our team loves the mobile app.”",
  },
  {
    name: "Dr. Lisa Patel",
    role: "Clinic Manager",
    company: "City Health Dental",
    quote: "“Cut scheduling time in half. Our team loves the mobile app.”",
  },
];

export const ROLES = {
  PLATFORM_ADMIN: "PLATFORM_ADMIN",
  COMPANY_ADMIN: "COMPANY_ADMIN",
  STAFF: "STAFF",
};

export const NAVIGATION = [
  {
    group: "Home",
    items: [
      { key: "home", label: "Home", roles: ["PLATFORM_ADMIN", "COMPANY_ADMIN", "STAFF"] },
    ],
  },
  {
    group: "Conversations",
    items: [
      { key: "conversations", label: "Conversations", roles: ["PLATFORM_ADMIN", "COMPANY_ADMIN", "STAFF"] },
    ],
  },
   {
    group: "Workforce",
    items: [
      { key: "profile", label: "Profile", href: "/profile", roles: ["PLATFORM_ADMIN","COMPANY_ADMIN","STAFF"] },
      { key: "company", label: "Company", href: "/company", roles: ["PLATFORM_ADMIN","COMPANY_ADMIN","STAFF"] },

      // ✅ set these to the real existing routes in your app:
      { key: "viewEmployees", label: "View Employees", href: "/employees", roles: ["PLATFORM_ADMIN","COMPANY_ADMIN"] },
      { key: "loginEmployees", label: "Login Employees", href: "/employees/login", roles: ["PLATFORM_ADMIN","COMPANY_ADMIN"] },

      { key: "jobs", label: "Jobs", href: "/jobs", roles: ["PLATFORM_ADMIN","COMPANY_ADMIN"] },
      { key: "mySchedule", label: "My Schedule", href: "/my-schedule", roles: ["PLATFORM_ADMIN","COMPANY_ADMIN","STAFF"] },
    ],
  },
  {
    group: "Clients",
    items: [
      { key: "clients", label: "Clients", roles: ["PLATFORM_ADMIN", "COMPANY_ADMIN"] },
      { key: "quoteClient", label: "Quote Client", roles: ["PLATFORM_ADMIN", "COMPANY_ADMIN"] },
      { key: "employeeSchedules", label: "Employee Schedules", roles: ["PLATFORM_ADMIN", "COMPANY_ADMIN"] },
    ],
  },
  {
    group: "About",
    items: [
      { key: "about", label: "About", roles: ["PLATFORM_ADMIN", "COMPANY_ADMIN", "STAFF"] },
    ],
  },
];






export const NAVIGATIONS = [
  {
    "group": "Home",
    "items": [
      { "key": "home", "label": "Home", "href": "/" }
    ]
  },
  {
    "group": "Workforce",
    "items": [
      { "key": "profile", "label": "Profile", "href": "/profile" },
      { "key": "company", "label": "Company", "href": "/company" },
      { "key": "viewEmployees", "label": "View Employees", "href": "/employees" },
      { "key": "loginEmployees", "label": "Login Employees", "href": "/employees/login" }
    ]
  },
  {
    "group": "Clients",
    "items": [
      { "key": "clients", "label": "Clients", "href": "/clients" },
      { "key": "quoteClient", "label": "Quote Client", "href": "/quoteClient" },
      { "key": "employeeSchedules", "label": "Employee Schedules", "href": "/employeeSchedules" },
    ],
  },
  {
    "group": "About",
    "items": [
      { "key": "about", "label": "About", "href": "/about" },
    ],
  },
]