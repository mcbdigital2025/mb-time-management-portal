export type IndustryCard = {
  title: string;
  desc: string;
  href: string;
  iconBg: string; // tailwind class
  icon: React.ReactNode;
};

export interface User {
  firstName?: string;
  email?: string;
}

export interface NavbarProps {
  user?: User | null;
  handleLogout?: () => void;
}

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
};