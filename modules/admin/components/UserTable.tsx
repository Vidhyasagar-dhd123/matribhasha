import React, {useEffect, useState} from "react";
import { User } from "@/modules/user/types/auth";
import { useUsers } from "../contexts/UserContext";


export function UserTable() {
  const { users,selectedUser, setSelectedUser } = useUsers();
  useEffect(() => {
  }, []);

  return (
    <table className="w-full text-sm">

      <thead className="border-b border-border text-muted-foreground">
        <tr className="text-left">
          <th className="p-2.5 w-10">
            <span className="sr-only">Select</span>
          </th>
          <th className="p-2.5">User</th>
          <th className="p-2.5">Email</th>
          <th className="p-2.5">Role</th>
          <th className="p-2.5">Status</th>
        </tr>
      </thead>

      <tbody>
        {users?.map((user: User) => {
          const isSelected = (selectedUser?._id && selectedUser._id === user._id) || selectedUser?.email === user.email;
          return (
            <tr 
              key={user._id || user.email} 
              className={`border-b border-border transition-colors cursor-pointer ${
                isSelected ? "bg-primary/10 border-primary/30" : "hover:bg-muted/50"
              }`}
              onClick={() => isSelected ? setSelectedUser(null) : setSelectedUser(user)}
            >
              <td className="p-2.5 w-10">
                <input 
                  type="checkbox" 
                  checked={isSelected} 
                  onChange={() => {}}
                  className="rounded border-input text-primary focus:ring-primary"
                />
              </td>
              <td className="p-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                    {(user.name || user.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{user.name}</div>
                    {user.username && <div className="text-xs text-muted-foreground">@{user.username}</div>}
                  </div>
                </div>
              </td>
              <td className="p-2.5 text-muted-foreground text-xs">{user.email}</td>
              <td className="p-2.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  user.role === "admin" 
                    ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {user.role || "user"}
                </span>
              </td>
              <td className="p-2.5">
                {user.isBlocked ? (
                  <span className="text-xs bg-destructive/15 text-destructive font-medium px-2 py-0.5 rounded-full">Blocked</span>
                ) : (
                  <span className="text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full">Active</span>
                )}
              </td>
            </tr>
          );
        })}
        {(!users || users.length === 0) && (
          <tr>
            <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
              No users found matching current filters.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}