import { NAVIGATION } from ".";

export const mockFetchAccessPages = async (storedUser: any) => {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 200));

  // Build from NAVIGATION so it always matches your UI config
  const roleNav = NAVIGATION.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roles.includes(storedUser.role)),
  })).filter((section) => section.items.length > 0);

  // Backend would return page keys (NOT labels)
  return roleNav.flatMap((section) => section.items.map((item) => item.key));
};


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
  role: "COMPANY_ADMIN", // ✅ must match NAVIGATION roles
  isVerified: true,
};


// This is just a fake JWT string (3 parts separated by dots)
export const dummyJWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpZCI6InUxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoiYWRtaW4ifQ." +
  "dummy-signature-123456";