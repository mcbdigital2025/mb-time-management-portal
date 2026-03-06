import React from "react";

const ActionButton = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
}) => {
  const styles = {
    purple: "bg-purple-600 hover:bg-purple-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    default: "bg-gray-600 hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";

  return (
    <span className={isActive ? "font-semibold text-green-600" : "font-semibold text-red-500"}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};

const ClientsSection = ({
  loading,
  error,
  clients,
  selectedClientId,
  onSelectClient,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  return (
    <fieldset className="rounded border border-gray-300 p-5">
      <legend className="px-2 text-xl font-semibold">Clients</legend>

      {loading ? (
        <div className="mt-4 text-center text-blue-500">Loading client list...</div>
      ) : error ? (
        <div className="mt-4 text-center text-red-500">{error}</div>
      ) : clients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="my-4 min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Client ID</th>
                <th className="border p-2">Company ID</th>
                <th className="border p-2">First Name</th>
                <th className="border p-2">Last Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Age</th>
                <th className="border p-2">Gender</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => {
                const isSelected = selectedClientId === client.clientId;

                return (
                  <tr
                    key={client.clientId}
                    onClick={() => onSelectClient(client.clientId)}
                    className={`cursor-pointer ${
                      isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <td className="border p-2 text-center">{client.clientId}</td>
                    <td className="border p-2 text-center">{client.companyId}</td>
                    <td className="border p-2 text-center">{client.firstName}</td>
                    <td className="border p-2 text-center">{client.lastName}</td>
                    <td className="border p-2">{client.email}</td>
                    <td className="border p-2">{client.phoneNumber || "N/A"}</td>
                    <td className="border p-2">{client.address || "N/A"}</td>
                    <td className="border p-2 text-center">{client.age}</td>
                    <td className="border p-2 text-center">{client.gender}</td>
                    <td className="border p-2 text-center">
                      <StatusBadge status={client.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No clients found.</p>
      )}

      <div className="mt-4 flex justify-center gap-4">
        <ActionButton onClick={onCreate} variant="purple">
          Create
        </ActionButton>

        <ActionButton
          onClick={onUpdate}
          disabled={!selectedClientId}
          variant="blue"
        >
          Update
        </ActionButton>

        <ActionButton
          onClick={onDelete}
          disabled={!selectedClientId}
          variant="red"
        >
          Delete
        </ActionButton>
      </div>
    </fieldset>
  );
};

export default ClientsSection;