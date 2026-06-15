import { useEffect, useState } from "react"
import { useUsers } from "../Contexts/UserContext";
import { deleteUser, toggleBlockUser, updateUser } from "../Services/users";

export function UserDetailsPanel() {
  const { selectedUser, refreshUsers, setSelectedUser } = useUsers()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [languages, setLanguages] = useState("")

  useEffect(() => {
    setName(selectedUser?.name || "")
    setEmail(selectedUser?.email || "")
    setBio(selectedUser?.bio || "")
    setLanguages((selectedUser?.languages || []).map((item) => item.name).filter(Boolean).join(", "))
  }, [selectedUser])

  return (
    <div className="w-[420px] border-l border-border bg-card p-6 overflow-y-auto">

      <h2 className="text-lg font-semibold mb-6">
        User Details
      </h2>

      {/* Author Profile */}

      <div className="space-y-3 mb-6">

        <h3 className="text-sm font-medium">
          Detailed Author Profiles
        </h3>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full border border-input rounded-md px-3 py-2"
          placeholder="Name"
        />

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full border border-input rounded-md px-3 py-2"
          placeholder="Email"
        />

        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Description"
          className="w-full border border-input rounded-md px-3 py-2"
        />

      </div>

      {/* Metadata */}

      <div className="grid grid-cols-3 gap-3 mb-6">

        <input
          value={languages}
          onChange={(event) => setLanguages(event.target.value)}
          className="border border-input rounded-md px-3 py-2 col-span-3"
          placeholder="Languages separated by commas"
        />

      </div>

      {/* Version History */}

      {/* Buttons */}

      <div className="flex gap-3 mt-6">

        <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md" onClick={async () => {
          if (!selectedUser) return;
          await updateUser(selectedUser._id, {
            name,
            email,
            bio,
            languages: languages.split(",").map((item) => ({ name: item.trim() })).filter((item) => item.name),
          });
          await refreshUsers();
        }}>
          Save Detailed Changes
        </button>

        <button className="flex-1 border border-border rounded-md py-2 bg-amber-600/80 text-white" onClick={async () => {
          if (!selectedUser) return;
          await toggleBlockUser(selectedUser._id);
          await refreshUsers();
        }}>
          {selectedUser?.isBlocked ? "UNBLOCK" : "BLOCK"}
        </button>

        <button className="flex-1 border border-border rounded-md py-2 bg-red-600/80 text-white" onClick={async () => {
          if (!selectedUser) return;
          await deleteUser(selectedUser._id);
          setSelectedUser(null)
          await refreshUsers();
        }}>
          DELETE
        </button>

      </div>

    </div>
  )
}