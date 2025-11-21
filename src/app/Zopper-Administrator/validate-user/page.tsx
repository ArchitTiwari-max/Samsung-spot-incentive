"use client";

import { useEffect, useState } from "react";

const TABS = [
  { id: "PENDING" as const, label: "Pending Users" },
  { id: "APPROVED" as const, label: "Approved Users" },
];

interface StoreOption {
  id: string;
  label: string;
}

interface ManagerOption {
  id: string;
  label: string;
}

const STORE_OPTIONS_STATIC: StoreOption[] = [
  { id: "croma-a189-noida-gaur-mall", label: "Croma - A189 - Noida-Gaur Mall" },
  { id: "croma-a151-noida-mall-of-india", label: "Croma - A151 - Noida-Mall of India" },
  {
    id: "croma-a062-chhatrapati-sambhaji-nagar",
    label: "Croma - A062 - Chhatrapati Sambhaji Nagar-Prozone Mall",
  },
  { id: "croma-a041-mumbai-oberoi-mall", label: "Croma - A041 - Mumbai-Oberoi Mall" },
  { id: "vs-pune-chinchwad", label: "VS - Pune(Chinchwad)" },
  { id: "croma-a316-gurugram-mgf-fifty-one", label: "Croma - A316 - Gurugram-MGF Fifty One" },
];

const MANAGER_OPTIONS_STATIC: ManagerOption[] = [
  { id: "zse-north", label: "ZSE - North Region" },
  { id: "zse-south", label: "ZSE - South Region" },
  { id: "zse-east", label: "ZSE - East Region" },
  { id: "zse-west", label: "ZSE - West Region" },
  { id: "zse-central", label: "ZSE - Central Region" },
];

interface AdminUser {
  id: string;
  username?: string;
  email?: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
  role: string;
  validation: "PENDING" | "APPROVED" | "BLOCKED" | string;
  createdAt?: string;
  storeIds?: string[];
  managerId?: string | null;
  roleProfileId?: string | null;
}

async function fetchUsers(status: "PENDING" | "APPROVED") {
  const res = await fetch(`/api/user-validate/users?status=${status}`, {
    cache: "no-store",
  });

  if (res.status === 401) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      data.error ||
        "You are not authorized to view this page. Please log in as a Zopper Administrator.",
    );
  }

  if (!res.ok) {
    throw new Error("Failed to load users");
  }

  const data = await res.json();
  return (data.users || []) as AdminUser[];
}

async function approveUser(
  id: string,
  metadataOverrides?: {
    fullName?: string;
    phoneNumber?: string;
    storeIds?: string[];
    managerId?: string;
  },
) {
  const res = await fetch(`/api/user-validate/users/${id}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ validation: "APPROVED", metadata: metadataOverrides }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to approve user");
  }
}

async function deleteUser(id: string) {
  const res = await fetch(`/api/user-validate/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to delete user");
  }
}

export default function ZopperUserValidationPage() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED">("PENDING");

  const [storeOptions, setStoreOptions] = useState<StoreOption[]>(STORE_OPTIONS_STATIC);
  const [zbmOptions, setZbmOptions] = useState<ManagerOption[]>([]);
  const [zseOptions, setZseOptions] = useState<ManagerOption[]>([]);
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editStoreSearch, setEditStoreSearch] = useState("");
  const [editManagerSearch, setEditManagerSearch] = useState("");
  const [editStoreIds, setEditStoreIds] = useState<string[]>([]);
  const [editManagerId, setEditManagerId] = useState<string>("");
  const [expandedStoreUserId, setExpandedStoreUserId] = useState<string | null>(null);

  const load = async (status: "PENDING" | "APPROVED") => {
    try {
      setError(null);
      setLoading(true);
      const users = await fetchUsers(status);
      if (status === "PENDING") setPendingUsers(users);
      if (status === "APPROVED") setApprovedUsers(users);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load("PENDING");
    void load("APPROVED");

    // load master data (stores + managers)
    void (async () => {
      try {
        const res = await fetch("/api/auth/signup");
        if (!res.ok) return;
        const data = await res.json();

        const stores: StoreOption[] = (data.stores || []).map((s: any) => ({
          id: s.id,
          label: s.name,
        }));

        const zbms: ManagerOption[] = (data.zbms || []).map((z: any) => ({
          id: z.id,
          label: `${z.fullName} (${z.region || "N/A"})`,
        }));

        const zses: ManagerOption[] = (data.zses || []).map((z: any) => ({
          id: z.id,
          label: `${z.fullName} (${z.region || "N/A"})`,
        }));

        setStoreOptions(stores.length ? stores : STORE_OPTIONS_STATIC);
        setZbmOptions(zbms);
        setZseOptions(zses);
      } catch (e) {
        console.error("Failed to load master options", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (user: AdminUser) => {
    try {
      setActionLoadingId(user.id);
      await approveUser(user.id, {
        fullName: user.fullName || undefined,
        phoneNumber: user.phoneNumber || undefined,
        storeIds: user.storeIds,
        managerId: user.managerId || undefined,
      });
      // Move from pending to approved list locally
      setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));
      setApprovedUsers((prev) => [
        { ...user, validation: "APPROVED" },
        ...prev,
      ]);
    } catch (err: any) {
      alert(err.message || "Failed to approve user");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    const confirmed = window.confirm(
      "Are you sure you want to block & delete this user? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setActionLoadingId(user.id);
      await deleteUser(user.id);
      if (user.validation === "PENDING") {
        setPendingUsers((prev) => prev.filter((u) => u.id !== user.id));
      } else {
        setApprovedUsers((prev) => prev.filter((u) => u.id !== user.id));
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete user");
    } finally {
      setActionLoadingId(null);
    }
  };

  const users = activeTab === "PENDING" ? pendingUsers : approvedUsers;

  const startEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditStoreIds(user.storeIds || []);
    setEditManagerId(user.managerId || "");
    setEditStoreSearch("");
    setEditManagerSearch("");
  };

  const toggleEditStore = (storeId: string) => {
    setEditStoreIds((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId],
    );
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    const primaryStoreId = editStoreIds[0] || "";

    try {
      setActionLoadingId(editingUser.id);

      if (editingUser.validation === "PENDING") {
        await approveUser(editingUser.id, {
          fullName: editingUser.fullName || undefined,
          phoneNumber: editingUser.phoneNumber || undefined,
          storeIds: editStoreIds,
          managerId: editManagerId || undefined,
        });

        setPendingUsers((prev) => prev.filter((u) => u.id !== editingUser.id));
        setApprovedUsers((prev) => [
          {
            ...editingUser,
            validation: "APPROVED",
            storeIds: editStoreIds,
            managerId: editManagerId || null,
          },
          ...prev,
        ]);
      } else {
        // APPROVED: update role-specific profile
        if (editingUser.role === "ABM" && editingUser.roleProfileId) {
          const res = await fetch(`/api/user-validate/abm/${editingUser.roleProfileId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeIds: editStoreIds, zbmId: editManagerId || undefined }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to update ABM mapping");
          }
        } else if (editingUser.role === "ASE" && editingUser.roleProfileId) {
          const res = await fetch(`/api/user-validate/ase/${editingUser.roleProfileId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeIds: editStoreIds, zseId: editManagerId || undefined }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Failed to update ASE mapping");
          }
        } else if (editingUser.role === "ABM" || editingUser.role === "ASE") {
          throw new Error("Missing role profile id for approved user; cannot update mapping.");
        }

        setApprovedUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, storeIds: editStoreIds, managerId: editManagerId || null }
              : u,
          ),
        );
      }

      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || "Failed to save mapping");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Validation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage SalesDost ABM / ASE / ZBM / ZSE users. Pending and approved users are
            separated into tabs. Blocking a user will delete them using the delete API.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              void load("PENDING");
              void load("APPROVED");
            }}
            className="px-3 py-2 rounded-lg text-sm bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.id === "PENDING" ? pendingUsers.length : approvedUsers.length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap border-b-2 -mb-px ${
                isActive
                  ? "border-blue-600 text-blue-600 bg-white"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-gray-100 px-2 text-xs text-gray-600">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3 text-xs text-gray-500">
          <div>
            {loading ? "Loading users..." : `${users.length} user(s) in ${activeTab.toLowerCase()} state`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Store Mapping</th>
                <th className="px-4 py-2 text-left">Manager Mapping</th>
                <th className="px-4 py-2 text-left">Created</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    No users in this state right now.
                  </td>
                </tr>
              )}

              {users.map((user) => {
                const storeCount = user.storeIds?.length || 0;
                const isExpanded = expandedStoreUserId === user.id;
                const managerLabel = (user.role === "ABM" ? zbmOptions : zseOptions).find(
                  (m) => m.id === user.managerId,
                )?.label;

                return (
                <tr key={user.id} className="border-t hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {user.fullName || "—"}
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-xs">
                      {user.username || user.id}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-800">
                    {user.phoneNumber || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">
                    {user.role}
                  </td>
                  <td className="px-4 py-3">
                    {storeCount === 0 ? (
                      <span className="text-xs text-gray-400">—</span>
                    ) : (
                      <div className="space-y-1">
                        <button
                          onClick={() => setExpandedStoreUserId(isExpanded ? null : user.id)}
                          className="text-xs text-blue-600 hover:underline focus:outline-none"
                        >
                          {storeCount} store{storeCount > 1 ? "s" : ""} {isExpanded ? "▲" : "▼"}
                        </button>
                        {isExpanded && (
                          <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5 mt-1">
                            {user.storeIds?.map((storeId) => {
                              const store = storeOptions.find((s) => s.id === storeId);
                              return (
                                <li key={storeId} className="truncate max-w-xs">
                                  {store?.label || storeId}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">
                    {managerLabel || user.managerId || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {user.role !== "ZBM" && user.role !== "ZSE" && (
                        <button
                          onClick={() => startEdit(user)}
                        disabled={actionLoadingId === user.id}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-200 disabled:opacity-60"
                      >
                        {user.validation === "PENDING" ? "Edit & Approve" : "Edit Mapping"}
                      </button>
                      )}
                      {activeTab === "PENDING" && (
                        <button
                          onClick={() => void handleApprove(user)}
                          disabled={actionLoadingId === user.id}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {actionLoadingId === user.id ? "Approving..." : "Quick Approve"}
                        </button>
                      )}
                      <button
                        onClick={() => void handleDelete(user)}
                        disabled={actionLoadingId === user.id}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {actionLoadingId === user.id ? "Processing..." : "Block & Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit mapping modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingUser.validation === "PENDING" ? "Edit & Approve User" : "Edit Mapping"}
              </h2>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-medium">{editingUser.fullName || "Unnamed user"}</div>
              <div className="text-xs text-gray-500">Role: {editingUser.role}</div>
            </div>

            {/* Stores */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Store(s)</label>
              <input
                type="text"
                value={editStoreSearch}
                onChange={(e) => setEditStoreSearch(e.target.value)}
                placeholder="Search store..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {storeOptions
                  .filter((store) =>
                    store.label.toLowerCase().includes(editStoreSearch.toLowerCase()),
                  )
                  .map((store) => {
                  const checked = editStoreIds.includes(store.id);
                  return (
                    <label
                      key={store.id}
                      className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEditStore(store.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-800">{store.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Manager */}
          {(editingUser.role === "ABM" || editingUser.role === "ASE") && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  {editingUser.role === "ABM" ? "Select ZBM" : "Select ZSE"}
                </label>
                <input
                  type="text"
                  value={editManagerSearch}
                  onChange={(e) => setEditManagerSearch(e.target.value)}
                  placeholder={editingUser.role === "ABM" ? "Search ZBM..." : "Search ZSE..."}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                  {(editingUser.role === "ABM" ? zbmOptions : zseOptions)
                    .filter((manager) =>
                      manager.label.toLowerCase().includes(editManagerSearch.toLowerCase()),
                    )
                    .map((manager) => (
                    <label
                      key={manager.id}
                      className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="edit-manager"
                        value={manager.id}
                        checked={editManagerId === manager.id}
                        onChange={() => setEditManagerId(manager.id)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-800">{manager.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-medium text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSaveEdit()}
                disabled={actionLoadingId === editingUser.id}
                className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
              >
                {actionLoadingId === editingUser.id
                  ? editingUser.validation === "PENDING"
                    ? "Approving..."
                    : "Saving..."
                  : editingUser.validation === "PENDING"
                  ? "Save & Approve"
                  : "Save Mapping"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
