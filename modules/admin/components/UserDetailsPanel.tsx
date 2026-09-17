import { useEffect, useState } from "react"
import { useUsers } from "../contexts/UserContext";
import { deleteUser, toggleBlockUser, updateUser } from "../services/users";
import { Shield, ShieldAlert, UserCheck, Loader2 } from "lucide-react";

export function UserDetailsPanel() {
  const { selectedUser, refreshUsers, setSelectedUser } = useUsers()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")
  const [languages, setLanguages] = useState("")
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    setName(selectedUser?.name || "")
    setEmail(selectedUser?.email || "")
    setBio(selectedUser?.bio || "")
    setRole(selectedUser?.role || "user")
    setLanguages((selectedUser?.languages || []).map((item) => item.name).filter(Boolean).join(", "))
    setStatusMessage(null)
  }, [selectedUser])

  if (!selectedUser) {
    return (
      <div className="w-[420px] border-l border-border bg-card p-6 flex flex-col items-center justify-center text-center text-muted-foreground">
        <UserCheck className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium">Select a user to view and edit details</p>
      </div>
    )
  }

  const handleSave = async () => {
    const userId = selectedUser?._id || selectedUser?.id;
    if (!userId) return;
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await updateUser(userId, {
        name,
        email,
        bio,
        role,
        languages: languages.split(",").map((item) => ({ name: item.trim() })).filter((item) => item.name),
      });
      if (res?.user) {
        setStatusMessage("User updated successfully");
      }
      await refreshUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
      setStatusMessage("Failed to update user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-[420px] border-l border-border bg-card p-6 overflow-y-auto flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">
            User Details
          </h2>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            role === "admin" 
              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20" 
              : "bg-muted text-muted-foreground"
          }`}>
            <Shield className="h-3 w-3" />
            {role.toUpperCase()}
          </span>
        </div>

        {statusMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
            {statusMessage}
          </div>
        )}

        {/* User Profile Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background"
              placeholder="Name"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Email Address</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" /> Role & Permissions
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "admin")}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background font-medium"
            >
              <option value="user">User (Standard Access)</option>
              <option value="admin">Admin (Full System Access)</option>
            </select>
            <p className="text-[11px] text-muted-foreground mt-1">
              Admins can manage platform catalog, users, documents, and assign roles.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Bio / Description</label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="User bio..."
              rows={3}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Languages (comma separated)</label>
            <input
              value={languages}
              onChange={(event) => setLanguages(event.target.value)}
              className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background"
              placeholder="e.g. Hindi, Sanskrit, Bengali"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-border">
        <button
          disabled={saving}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
          onClick={handleSave}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save User Changes
        </button>

        <div className="flex gap-2">
          <button
            className={`flex-1 border rounded-lg py-2 text-xs font-semibold transition ${
              selectedUser?.isBlocked
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                : "border-amber-500/50 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
            }`}
            onClick={async () => {
              const userId = selectedUser?._id || selectedUser?.id;
              if (!userId) return;
              await toggleBlockUser(userId);
              await refreshUsers();
            }}
          >
            {selectedUser?.isBlocked ? "Unblock Account" : "Block User"}
          </button>

          <button
            className="flex-1 border border-destructive/30 bg-destructive/10 text-destructive rounded-lg py-2 text-xs font-semibold hover:bg-destructive/20 transition"
            onClick={async () => {
              const userId = selectedUser?._id || selectedUser?.id;
              if (!userId) return;
              if (confirm(`Are you sure you want to delete user ${name || email}?`)) {
                await deleteUser(userId);
                setSelectedUser(null);
                await refreshUsers();
              }
            }}
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  )
}