import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../utils/api"; // Assuming api.js is in a 'utils' folder one level up
import EmployeeProfileSkeleton from "../components/loaders/EmployeeProfileSkeleton";

const EmployeeProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState(null);

  const [formData, setFormData] = useState({
    firstName: employee?.firstName,
    lastName: employee?.lastName,
    timeZone: employee?.timeZone,
    phoneNumber: employee?.phoneNumber,
    email: employee?.email,
    dateOfBirth: employee?.dateOfBirth,
    gender: employee?.gender,
    jobTitle: employee?.jobTitle,
    hireDate: employee?.hireDate,
    departmentId: employee?.departmentId,
    status: employee?.status,
    employeeId: employee?.employeeId,
    companyId: user?.companyId,
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // ✅ Check for JWT token in storedUser
    if (!storedUser || !storedUser.companyId || !storedUser.email || !storedUser.jwtToken) {
      setError("User session or token is missing. Please log in again.");
      setTimeout(() => {
        router.replace("/login");
      }, 500);
      return; // Exit early if user data is incomplete
    }

    setUser(storedUser);

    const fetchEmployee = async () => {
      try {
        // ✅ Use authenticatedFetch instead of direct fetch
        // authenticatedFetch automatically adds the Authorization header with the JWT token
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/email/${encodeURIComponent(storedUser.companyId)}/${encodeURIComponent(storedUser.email)}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
            // ✅ Removed credentials: "include" as JWT is stateless and doesn't rely on cookies
          }
        );

        if (!response.ok) {
          const errorText = await response.text(); // Get raw text for more info
          throw new Error(`Failed to fetch employee data: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log("🚀 ~ fetchEmployee ~ data:", data)
        setEmployee(data);
        setFormData({
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          timeZone: data?.timeZone || "",
          phoneNumber: data?.phoneNumber || "",
          email: data?.email || "",
          dateOfBirth: data?.dateOfBirth || "",
          gender: data?.gender || "",
          jobTitle: data?.jobTitle || "",
          hireDate: data?.hireDate || "",
          departmentId: data?.departmentId || "",
          status: data?.status || "",
          employeeId: data?.employeeId || "",
          companyId: data?.companyId || storedUser.companyId || "",
        });
      } catch (err) {
        console.error("Error in fetchEmployee:", err);
        setError(err.message);
        // If fetching fails due to token issues (e.g., token expired/invalid),
        // consider redirecting to login after a delay.
        if (err.message.includes("Authentication token missing") || err.message.includes("401 Unauthorized")) {
          setTimeout(() => {
            router.replace("/login");
          }, 1500); // Give user a moment to see the error before redirect
        }
      }
    };

    fetchEmployee();
  }, []); // Dependency array can be empty as storedUser is accessed inside the effect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) return;

    console.log("Submitting formData:", formData);

    // await updateEmployee(formData);

    setEmployee(formData); // optional: keep UI in sync after save
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (employee && user) {
      const passwordInfo = {
        email: employee.email,
        companyId: user.companyId,
      };

      sessionStorage.setItem(
        "changePasswordEmployee",
        JSON.stringify(passwordInfo)
      );

      router.push("/changeLoginEmployeePassword");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  }
  const image = formData?.gender === "Male" ? "/male_employee.jpg" : "/female_employee.jpg";

  if (!employee) {
    return <EmployeeProfileSkeleton/>;
  }

  return (
    <div className="min-h-screen w-full  py-10 hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white/20 backdrop-blur-xl shadow-[0_10px_10px_rgba(0,0,0,0.15)] rounded-lg   overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-10">
              {/* LEFT: Avatar + actions (like the image) */}
              <div className="md:w-1/3 flex flex-col items-center">
                <img
                  src={
                    employee?.profileImage || image
                  }
                  alt="Profile"
                  className="w-38 h-38 rounded-full object-cover  shadow-sm md:mt-6"
                />

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-3 text-gray-500 text-sm hover:underline"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              {/* RIGHT: Profile fields */}
              <div className="flex-1">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className=" text-base sm:text-2xl font-semibold  bg-linear-to-r from-[#008080] via-cyan-600 to-[#008080] bg-clip-text text-transparent ">
                      Employee {" "}
                      <br className="sm:hidden block" />
                      Profile
                    </h2>

                    <button
                      type="button"
                      onClick={handleChangePassword}
                      className=" px-2 sm:px-4 py-2 bg-teal-500 text-xs sm:text-sm text-white font-semibold rounded-lg hover:bg-teal-600 cursor-pointer"
                    >
                      Change  Password
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-[#008080] text-gray-100 text-xs sm:text-base px-4 md:px-8 py-2 rounded-lg hover:bg-[#006666] transition-colors font-bold cursor-pointer"
                    >
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {/* Top section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <ProfileField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Company Id"
                      name="companyId"
                      value={formData.companyId}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Phone Number"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="mt-6">
                    <ProfileField
                      label="Email Address"
                      name="email"
                      value={formData.email}
                      isEditing={isEditing}
                      onChange={handleChange}
                      full
                    />
                  </div>

                  {/* Remaining content */}
                  <div className="mt-8 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ProfileField
                      label="Date of Birth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Job Title"
                      name="jobTitle"
                      value={formData.jobTitle}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Hire Date"
                      name="hireDate"
                      value={formData.hireDate}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Department Id"
                      name="departmentId"
                      value={formData.departmentId}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />

                    <ProfileField
                      label="Status"
                      name="status"
                      value={formData.status}
                      isEditing={isEditing}
                      onChange={handleChange}
                    />
                  </div>

                  <ProfileField
                    label="Employee Id"
                    name="employeeId"
                    value={formData.employeeId}
                    isEditing={isEditing}
                    onChange={handleChange}
                  />

                  {/* Submit button */}
                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={!isEditing}
                      className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors
          ${isEditing ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"}`}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, isEditing, onChange, full }) => (
  <div className={`flex flex-col ${full ? "col-span-2" : ""}`}>
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>

    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={!isEditing}
      className={`w-full rounded-xl border  border-gray-200 px-3 py-3 text-gray-800 transition
        ${isEditing
          ? "bg-black/10 focus:outline-none focus:ring-2 focus:ring-teal-500"
          : "bg-black/10 cursor-not-allowed"
        }`}
    />
  </div>
);

export default EmployeeProfile;
