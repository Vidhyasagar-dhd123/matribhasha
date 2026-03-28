import { useEffect, useState } from "react"
import { useBooks } from "../Contexts/BooksContext";
import { useUsers } from "../Contexts/UserContext";
import { deleteUser } from "../Services/users";

export function UserDetailsPanel() {
  const { users, selectedUser } = useUsers()

  useEffect(() => {
  }, []);

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

        <div
          className="w-full border border-input rounded-md px-3 py-2">
            {selectedUser?.name || "Select a user"}
        </div>

        <div
          className="w-full border border-input rounded-md px-3 py-2">
            {selectedUser?.email || "Email"}
        </div>

        <textarea
          placeholder="Description"
          className="w-full border border-input rounded-md px-3 py-2"
        />

      </div>

      {/* Metadata */}

      <div className="grid grid-cols-3 gap-3 mb-6">

        <select className="border border-input rounded-md px-3 py-2">
          <option>Genre</option>
        </select>

        <select className="border border-input rounded-md px-3 py-2">
          <option>EN</option>
          <option>ES</option>
          <option>FR</option>
        </select>

      </div>

      {/* Version History */}

      {/* Buttons */}

      <div className="flex gap-3 mt-6">

        <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-md">
          Save Detailed Changes
        </button>

        <button className="flex-1 border border-border rounded-md py-2 bg-red-600/80 text-white" onClick={() => selectedUser && deleteUser(selectedUser._id)}>
          DELETE
        </button>

      </div>

    </div>
  )
}