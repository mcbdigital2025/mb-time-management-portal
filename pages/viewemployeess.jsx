"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api";
import ReusableTable from "../components/ReusableTable";
import { toast } from "react-toastify";
import ViewEmployeesSkeleton from "../components/loaders/ViewEmployeesSkeleton";
import CreateEmployeeModal from "../components/modal/CreateEmployeeModal";
import EditEmployeeModal from "../components/modal/EditEmployeeModal";
import ResetPasswordModal from "../components/modal/ResetPasswordModal";
import EmployeeSkillsCard from "../components/modal/EmployeeSkillsCard";
import UpdateSkillModal from "../components/modal/UpdateSkillModal";




const GENDER_OPTIONS = ["Male", "Female", "Other"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const ACCESS_LEVEL_OPTIONS = ["Basic", "Administrator", "Supervisor"];

const REQUIRED_FIELDS = [
  "employeeId",
  "firstName",
  "lastName",
  "email",
  "dateOfBirth",
  "hireDate",
  "accessLevel",
];

const INITIAL_CREATE_FORM_DATA = {
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  hireDate: "",
  gender: GENDER_OPTIONS[0],
  departmentId: "",
  jobTitle: "",
  status: STATUS_OPTIONS[0],
  accessLevel: ACCESS_LEVEL_OPTIONS[0],
};

const INITIAL_EDIT_FORM_DATA = {
  employeeId: "",
  companyId: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  hireDate: "",
  gender: "",
  departmentId: "",
  jobTitle: "",
  status: "",
  accessLevel: "",
};

const formatDateForInput = (value) => {
  if (!value) return "";
  return String(value).split("T")[0];
};

const normalizeAccessLevelForForm = (value) => {
  if (!value) return "";
  return value.replace("ROLE_", "");
};

const ViewEmployees = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdateSkillModalOpen, setIsUpdateSkillModalOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState(INITIAL_CREATE_FORM_DATA);
  const [createFormError, setCreateFormError] = useState("");
  const [createFormSuccess, setCreateFormSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(INITIAL_EDIT_FORM_DATA);
  const [editFormError, setEditFormError] = useState("");
  const [editFormSuccess, setEditFormSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [employeeToReset, setEmployeeToReset] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);


  const fetchEmployees = async (currentUser) => {
    try {
      setLoading(true);
      setError("");

      const activeUser =
        currentUser || JSON.parse(localStorage.getItem("user") || "null");

      if (!activeUser) {
        setError("User information missing. Redirecting to login.");
        setTimeout(() => router.replace("/login"), 500);
        return;
      }

      if (!activeUser?.companyId) {
        setError("Company ID missing. Redirecting to login.");
        setTimeout(() => router.replace("/login"), 500);
        return;
      }

      setUser(activeUser);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/${encodeURIComponent(
          activeUser.companyId
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(
          `Failed to fetch employees: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const text = await response.text();
      const data = JSONbig.parse(text);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message || "Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUserRaw = localStorage.getItem("user");

    if (!storedUserRaw) {
      setError("User information missing. Redirecting to login.");
      setLoading(false);
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    const storedUser = JSON.parse(storedUserRaw);

    if (!storedUser?.jwtToken || !storedUser?.companyId) {
      setError("Session expired. Redirecting to login.");
      setLoading(false);
      setTimeout(() => router.replace("/login"), 500);
      return;
    }

    setUser(storedUser);
    fetchEmployees(storedUser);
  }, [router]);

  const hasEditPermission =
    user?.accessLevel === "ROLE_Administrator" ||
    user?.accessLevel === "ROLE_SuperAdministrator";

  const handleRowClick = async (emp) => {
    setSelectedEmployee(emp);
    setError("");
    setSuccessMessage("");

    setSkillsLoading(true);

    try {
      const skillRes = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/skill/${encodeURIComponent(user.companyId)}/${encodeURIComponent(emp.employeeId)}`,
        { method: "GET", headers: { Accept: "application/json" } }
      );
      if (skillRes.ok) {
        const skillData = await skillRes.json();
        setSkills(Array.isArray(skillData) ? skillData : []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setSkillsLoading(false);
    }
  };

  const openUpdateSkillModal = () => {
    if (!selectedSkill) return;
    setIsUpdateSkillModalOpen(true);
  };

  const closeUpdateSkillModal = () => {
    setIsUpdateSkillModalOpen(false);
  };

  // Directly invokes the updateEmployeeSkill endpoint
  const handleAddSkill = async () => {
    if (!selectedEmployee) return;

    // This is a placeholder for the skill object you want to pass.
    const newSkill = {
      companyId: user.companyId,
      employeeId: selectedEmployee.employeeId,
      skillName: "New Skill", // Placeholder
      skillLevel: "BEGINNER",
      yearsExperience: 0.0
    };

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/updateEmployeeSkill/${encodeURIComponent(user.companyId)}/${encodeURIComponent(selectedEmployee.employeeId)}`,
        {
          method: "POST", // or PUT depending on your backend API design
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSkill),
        }
      );

      if (!response.ok) throw new Error("Failed to add skill");
      setSuccess("Skill added successfully!");
      handleRowClick(selectedEmployee); // Refresh skills list
    } catch (err) {
      setError(err.message);
    }
  };

  const openCreateModal = () => {
    if (!hasEditPermission) {
      setError("You do not have permission to create employees.");
      return;
    }

    setCreateFormData(INITIAL_CREATE_FORM_DATA);
    setCreateFormError("");
    setCreateFormSuccess("");
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (isCreating) return;
    setIsCreateModalOpen(false);
    setCreateFormError("");
    setCreateFormSuccess("");
    setCreateFormData(INITIAL_CREATE_FORM_DATA);
  };

  const openEditModal = (emp) => {
    if (!hasEditPermission) {
      setError("You do not have permission to edit employees.");
      return;
    }

    setSelectedEmployee(emp);
    setEditFormError("");
    setEditFormSuccess("");

    setEditFormData({
      employeeId: emp.employeeId || "",
      companyId: emp.companyId || user?.companyId || "",
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      phoneNumber: emp.phoneNumber || "",
      dateOfBirth: formatDateForInput(emp.dateOfBirth),
      hireDate: formatDateForInput(emp.hireDate),
      gender: emp.gender || "",
      departmentId: emp.departmentId || "",
      jobTitle: emp.jobTitle || "",
      status: emp.status || "",
      accessLevel: normalizeAccessLevelForForm(emp.accessLevel) || "",
    });

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setIsEditModalOpen(false);
    setEditFormError("");
    setEditFormSuccess("");
    setEditFormData(INITIAL_EDIT_FORM_DATA);
  };

  const handleResetPassword = async () => {
    if (!hasEditPermission) {
      setError("You do not have permission to reset passwords.");
      return;
    }

    if (!employeeToReset) {
      setError("No employee selected for password reset.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsResettingPassword(true);

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/resetPassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeToReset),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to reset password: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      setSuccessMessage(
        `Password for ${employeeToReset.firstName} ${employeeToReset.lastName} reset successfully.`
      );
      toast.success(
        `Password for ${employeeToReset.firstName} ${employeeToReset.lastName} reset successfully.`
      );

      closeResetModal();
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "Failed to reset password.");
      setSuccessMessage("");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const openResetModal = (emp) => {
    if (!hasEditPermission) {
      setError("You do not have permission to reset passwords.");
      return;
    }

    if (!emp) {
      setError("Please select an employee first.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setEmployeeToReset(emp);
    setIsResetModalOpen(true);
  };

  const closeResetModal = () => {
    if (isResettingPassword) return;
    setIsResetModalOpen(false);
    setEmployeeToReset(null);
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEmployeeSubmit = async (e) => {
    e.preventDefault();
    setCreateFormError("");
    setCreateFormSuccess("");
    setIsCreating(true);

    try {
      if (!user?.companyId) {
        throw new Error("Session expired. Please log in again.");
      }

      const payload = {
        ...createFormData,
        companyId: user.companyId,
        accessLevel: `ROLE_${createFormData.accessLevel}`,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create employee profile: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      setCreateFormSuccess("Employee created successfully.");
      setSuccessMessage("Employee created successfully.");

      await fetchEmployees(user);

      setTimeout(() => {
        closeCreateModal();
      }, 700);
    } catch (err) {
      console.error("Create employee error:", err);
      setCreateFormError(err.message || "Failed to create employee profile.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
    setEditFormError("");
    setEditFormSuccess("");
    setIsUpdating(true);

    try {
      const payload = {
        ...editFormData,
        accessLevel: editFormData.accessLevel
          ? `ROLE_${editFormData.accessLevel}`
          : null,
      };

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Update failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      setEditFormSuccess("Employee updated successfully.");
      setSuccessMessage("Employee updated successfully.");

      await fetchEmployees(user);

      toast.success("Employee updated successfully")

      setTimeout(() => {
        closeEditModal();
      }, 700);
    } catch (err) {
      console.error("Update employee error:", err);
      setEditFormError(err.message || "Failed to update employee.");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatLabel = (key) => {
    const labels = {
      employeeId: "Employee ID",
      companyId: "Company ID",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phoneNumber: "Phone Number",
      dateOfBirth: "Date of Birth",
      hireDate: "Hire Date",
      gender: "Gender",
      departmentId: "Department ID",
      jobTitle: "Job Title",
      status: "Employment Status",
      accessLevel: "Access Level",
    };
    return labels[key] || key;
  };

  const renderCreateInputField = (key, value) => {
    const commonProps = {
      name: key,
      value,
      onChange: handleCreateFormChange,
      className:
        "w-full px-3 py-2.5 border border-[#008080]/20 bg-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none disabled:bg-gray-100",
      required: REQUIRED_FIELDS.includes(key),
      disabled: isCreating,
    };

    if (["gender", "status", "accessLevel"].includes(key)) {
      const options =
        key === "gender"
          ? GENDER_OPTIONS
          : key === "status"
            ? STATUS_OPTIONS
            : ACCESS_LEVEL_OPTIONS;

      return (
        <select {...commonProps}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    const type =
      key === "email"
        ? "email"
        : ["dateOfBirth", "hireDate"].includes(key)
          ? "date"
          : "text";

    return <input type={type} {...commonProps} />;
  };

  const renderEditInputField = (key, value) => {
    const isDisabled = ["employeeId", "companyId", "email"].includes(key);

    const commonProps = {
      name: key,
      value,
      onChange: handleEditFormChange,
      className: `w-full px-3 py-2.5 border rounded-lg outline-none ${isDisabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
        : "border-[#008080]/20 bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        }`,
      disabled: isUpdating || isDisabled,
    };

    if (["gender", "status", "accessLevel"].includes(key)) {
      const options =
        key === "gender"
          ? GENDER_OPTIONS
          : key === "status"
            ? STATUS_OPTIONS
            : ACCESS_LEVEL_OPTIONS;

      return (
        <select {...commonProps}>
          <option value="">Select {formatLabel(key)}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    const type =
      key === "email"
        ? "email"
        : ["dateOfBirth", "hireDate"].includes(key)
          ? "date"
          : "text";

    return <input type={type} {...commonProps} />;
  };

  const fetchSkills = async (employee) => {
  if (!employee || !employee.companyId || !employee.employeeId) return;

  try {
    const response = await authenticatedFetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/employee/skills/${encodeURIComponent(
        employee.companyId
      )}/${encodeURIComponent(employee.employeeId)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch skills");
    }

    const data = await response.json();
    setSkills(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Fetch skills error:", err);
  }
};

  const employeeColumns = [
    {
      header: "ID",
      render: (emp) => emp.employeeId?.toString?.() ?? "-",
    },
    {
      header: "Name",
      render: (emp) => (
        <span className="font-medium text-gray-900">
          {emp.firstName} {emp.lastName}
        </span>
      ),
    },
    {
      header: "Email",
      render: (emp) => emp.email || "-",
    },
    {
      header: "Access Level",
      render: (emp) => {
        const access = emp.accessLevel || "ROLE_User";
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-gray-50 text-gray-700 ring-gray-200">
            {access.replace("ROLE_", "")}
          </span>
        );
      },
    },
    {
      header: "Department",
      render: (emp) => emp.departmentId ?? "-",
    },
    {
      header: "Status",
      render: (emp) => {
        const isActive = emp.status === "Active";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${isActive
              ? "bg-green-50 text-green-700 ring-green-200"
              : "bg-red-50 text-red-700 ring-red-200"
              }`}
          >
            {emp.status || "Unknown"}
          </span>
        );
      },
    },
  ];

  const employeeActions = hasEditPermission
    ? [
      {
        label: "Edit",
        icon: "edit",
        variant: "primary",
        showLabel: true,
        onClick: (emp) => {
          openEditModal(emp);
        },
      },
      {
        label: "Reset Password",
        icon: "key",
        variant: "danger",
        showLabel: true,
        onClick: (emp) => {
          setSelectedEmployee(emp);
          openResetModal(emp);
        },
      },
    ]
    : [];

  return (
    <div className="relative min-h-[90vh] w-full overflow-x-hidden flex flex-col items-center justify-center hero-radial-background bg-[radial-gradient(12%_14.08%_at_9.42%_89.81%,#D1E5FF,#F8FAFC),radial-gradient(13.98%_18.61%_at_186.74%_119.73%,rgba(110,178,188,0.4),rgba(217,217,217,0.4))] px-3 sm:px-4 md:px-6 py-6 md:py-10">
      <div className="pointer-events-none absolute top-10 left-6 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-300 opacity-20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-6 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-teal-300 opacity-20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-300 opacity-10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl">
        <div className="bg-white/70 rounded-2xl shadow-sm border border-teal-400/30 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                Employee Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View employees, update records, and manage passwords.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 justify-start md:justify-end">
              <button
                onClick={openCreateModal}
                disabled={!hasEditPermission}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${hasEditPermission
                  ? "bg-[#008080] text-white hover:bg-teal-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                + Create Employee
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-4">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm mt-2">
                {" "}
              </div>
            )}
          </div>

          {loading && (
            <>
              <ViewEmployeesSkeleton />
            </>
          )}

          {!loading && !error && employees.length === 0 && (
            <div className="px-4 sm:px-6 py-10 text-center text-gray-500">
              No employees found.
            </div>
          )}

          {!loading && employees.length > 0 && (
            <ReusableTable
              data={employees}
              columns={employeeColumns}
              actions={employeeActions}
              getRowKey={(emp) => emp.employeeId?.toString?.() ?? emp.email}
              onRowClick={handleRowClick}
              isRowSelected={(emp) =>
                selectedEmployee?.employeeId === emp.employeeId
              }
              footerLeft={`Showing ${employees.length} employees`}
              footerRight="Click a row to select"
            />
          )}
        </div>
      </div>

      <CreateEmployeeModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        isCreating={isCreating}
        createFormError={createFormError}
        createFormSuccess={createFormSuccess}
        createFormData={createFormData}
        handleCreateEmployeeSubmit={handleCreateEmployeeSubmit}
        formatLabel={formatLabel}
        renderCreateInputField={renderCreateInputField}
        requiredFields={REQUIRED_FIELDS}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        isUpdating={isUpdating}
        editFormError={editFormError}
        editFormData={editFormData}
        handleEditEmployeeSubmit={handleEditEmployeeSubmit}
        formatLabel={formatLabel}
        renderEditInputField={renderEditInputField}
      />

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        onConfirm={handleResetPassword}
        isResettingPassword={isResettingPassword}
        employeeToReset={employeeToReset}
      />

      <EmployeeSkillsCard
        selectedEmployee={selectedEmployee}
        skills={skills}
        selectedSkill={selectedSkill}
        onSelectSkill={setSelectedSkill}
        onAddSkill={handleAddSkill}
        onUpdateSkill={openUpdateSkillModal}
      />

      <UpdateSkillModal
        isOpen={isUpdateSkillModalOpen}
        onClose={closeUpdateSkillModal}
        selectedSkill={selectedSkill}
        onSuccess={async () => {
          await fetchSkills(selectedEmployee);
          setSelectedSkill(null);
        }}
      />
    </div>
  );
};

export default ViewEmployees;