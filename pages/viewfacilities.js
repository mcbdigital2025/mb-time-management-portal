"use client";

import React, { useEffect, useState, useMemo } from "react";
import JSONbig from "json-bigint";
import { authenticatedFetch } from "../utils/api";
import {
  Building2,
  Trash2,
  Edit,
  AlertCircle,
  Search,
  Plus
} from "lucide-react";
import { toast } from "react-toastify";

const ViewFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Filter Search
  const [searchQuery, setSearchQuery] = useState("");

  // Modals Controller
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);

  // Confirmation Alert Dialog Context
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState("Confirm Action");
  const [confirmAction, setConfirmAction] = useState(null);

  // Form payload mapping matching custom entity getters
  const [formData, setFormData] = useState({
    facilitiesName: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia"
  });

  // Pull active credential wrapper from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Session profile parsing error:", e);
      }
    }
  }, []);

  const fetchFacilities = async () => {
    if (!user?.companyId) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/facilities/${user.companyId}`;
      const res = await authenticatedFetch(endpoint, { method: "GET" });

      if (res.ok) {
        const textData = await res.text();
        const parsedData = JSONbig.parse(textData);
        setFacilities(Array.isArray(parsedData) ? parsedData : []);
      } else {
        setError("Failed to fetch facilities list data records.");
      }
    } catch (err) {
      console.error(err);
      setError("Network pipeline exception loading active facility grids.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.companyId) {
      fetchFacilities();
    }
  }, [user]);

  // Search filter implementation
  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) return facilities;
    const query = searchQuery.toLowerCase();
    return facilities.filter(
      (f) =>
        f.facilitiesName?.toLowerCase().includes(query) ||
        f.city?.toLowerCase().includes(query) ||
        f.state?.toLowerCase().includes(query)
    );
  }, [facilities, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openFormModal = (facility = null) => {
    if (facility) {
      setEditingFacility(facility);
      setFormData({
        facilitiesName: facility.facilitiesName || "",
        address: facility.address || "",
        city: facility.city || "",
        state: facility.state || "",
        postcode: facility.postcode || "",
        country: facility.country || "Australia"
      });
    } else {
      setEditingFacility(null);
      setFormData({
        facilitiesName: "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        country: "Australia"
      });
    }
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user?.companyId) return;

    try {
      const payload = {
        facilitiesId: editingFacility ? editingFacility.facilitiesId : null,
        companyId: user.companyId,
        ...formData
      };

      const isUpdate = !!editingFacility;
      const endpoint = isUpdate
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/facilities/update`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/facilities/create`;

      const res = await authenticatedFetch(endpoint, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSONbig.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Facility successfully ${isUpdate ? "updated" : "saved"}!`);
        setIsFormModalOpen(false);
        fetchFacilities();
      } else {
        toast.error("Database tracking layer rejected processing request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unhandled exception blocked transmission execution.");
    }
  };

  const handleDeleteClick = (facilityId) => {
    setConfirmTitle("Delete Operational Facility");
    setConfirmMessage("Are you certain you wish to delete this facility instance context map? The action cannot be undone.");
    setConfirmAction(() => async () => {
      try {
        const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/mcbtt/api/timesheet/facilities/delete/${user.companyId}/${facilityId}`;
        const res = await authenticatedFetch(endpoint, { method: "DELETE" });

        if (res.ok) {
          toast.success("Facility row dropped successfully.");
          setFacilities((prev) => prev.filter((f) => f.facilitiesId !== facilityId));
        } else {
          toast.error("Constraints violation blocked delete command processing.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Network communication timeout error.");
      } finally {
        setConfirmMessage(null);
      }
    });
  };

  return (
    // Matches identical full screen viewport background scaling rules from viewemployees.js
    <div className="w-full min-h-screen hero-radial-background px-4 md:px-12 py-6">
      <div className="max-w-[1600px] mx-auto space-y-6">

        {/* Header Alignment Element Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Building2 size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Facilities Management</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage and configure active operational job locations and corporate facility centers.</p>
            </div>
          </div>
          <button
            onClick={() => openFormModal()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus size={18} />
            <span>Add New Facility</span>
          </button>
        </div>

        {/* Filters Panel Area */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by facility name, city or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-xs text-sm"
            />
          </div>
          <div className="text-sm font-semibold text-slate-500 bg-white/60 px-4 py-2 rounded-xl border border-slate-100">
            Active Records Count: <span className="text-blue-600 font-bold">{filteredFacilities.length}</span>
          </div>
        </div>

        {/* EXACT TABLE LAYOUT SIZE MATCH FOR VIEWEMPLOYEES.JS */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-200/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md border border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <Building2 className="mx-auto text-gray-300 mb-3" size={44} />
            <p className="text-gray-500 font-medium">No facility profiles matched your current structural filter string.</p>
          </div>
        ) : (
          /* Employs the identical overflow-x layout container metrics to match sizes smoothly */
          <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 font-bold tracking-wide uppercase text-[11px]">
                    <th className="px-8 py-4">Facility Name</th>
                    <th className="px-8 py-4">Street Address</th>
                    <th className="px-8 py-4">City</th>
                    <th className="px-8 py-4">State</th>
                    <th className="px-8 py-4">Postcode</th>
                    <th className="px-8 py-4 text-right">Action Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-gray-700 font-medium">
                  {filteredFacilities.map((facility) => (
                    <tr key={facility.facilitiesId?.toString()} className="hover:bg-slate-50/60 transition group">
                      <td className="px-8 py-4 font-semibold text-blue-600 max-w-[250px] truncate">
                        {facility.facilitiesName}
                      </td>
                      <td className="px-8 py-4 text-gray-500 max-w-[300px] truncate">
                        {facility.address}
                      </td>
                      <td className="px-8 py-4 text-gray-900">{facility.city}</td>
                      <td className="px-8 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold rounded-md text-[11px] tracking-wider uppercase">
                          {facility.state}
                        </span>
                      </td>
                      <td className="px-8 py-4 font-mono text-gray-400">{facility.postcode || "——"}</td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openFormModal(facility)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                            title="Edit Location Properties"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(facility.facilitiesId)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                            title="Remove Location Entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Input Form Dialog Component Drawer */}
        {isFormModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  {editingFacility ? "Update Facility Settings" : "Create New Corporate Location"}
                </h2>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Facility Name *</label>
                  <input
                    type="text"
                    name="facilitiesName"
                    required
                    value={formData.facilitiesName}
                    onChange={handleInputChange}
                    placeholder="e.g. Bonnyrigg Medical Center"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Shop 3/51 Bonnyrigg Ave"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Bonnyrigg"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NSW"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-gray-800 uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Postcode</label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      placeholder="2177"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Country *</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm text-gray-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-gray-500 rounded-xl hover:bg-slate-50 transition font-medium cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold shadow-md cursor-pointer text-sm"
                  >
                    {editingFacility ? "Apply System Update" : "Confirm Facility"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Modal layout aligned precisely with employee view execution rules */}
        {confirmMessage && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110] px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold text-gray-900">{confirmTitle}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{confirmMessage}</p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmMessage(null)}
                  className="px-4 py-2 border border-slate-200 text-gray-500 rounded-xl hover:bg-slate-50 transition font-medium cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="px-4 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 transition cursor-pointer text-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ViewFacilities;