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

// for testing purposes only, to simulate a logged in user
export const dummyUsers = {
  id: "u123456",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 555-123-4567",
  username: "johndoe",
  role: "admin", // or "user"
  avatar: "https://i.pravatar.cc/150?img=12",
  isVerified: true,
  createdAt: "2026-02-16T10:30:00Z",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  }
};

export const dummyUser = {
  id: "u123456",
  name: "John Doe",
  firstName: "John",
  email: "john@example.com",
  role: "admin",
  isVerified: true
};

// This is just a fake JWT string (3 parts separated by dots)
export const dummyJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpZCI6InUxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoiYWRtaW4ifQ." +
  "dummy-signature-123456";


