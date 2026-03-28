import React, {useEffect, useState} from "react";
import { User } from "@/modules/user/types/auth";
import { useUsers } from "../Contexts/UserContext";


export function UserTable() {
  const { users,selectedUser, setSelectedUser } = useUsers();
  useEffect(() => {
  }, []);

  return (
    <table className="w-full text-sm">

      <thead className="border-b border-border text-muted-foreground">
        <tr className="text-left">

          <th className="p-2 w-10">
            <input type="checkbox"/>
          </th>

          <th className="p-2">Profile</th>
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Block status</th>

        </tr>
      </thead>

      <tbody>
        {users?.map((user: User) => (
          <tr 
            key={user.email} 
            className="border-b border-border hover:bg-accent cursor-pointer"
            onClick={() => selectedUser?.email === user.email ? setSelectedUser(null) : setSelectedUser(user)}
          >
            <td className="p-2 w-10">
              <input type="checkbox" checked={selectedUser?.email === user.email} onChange={() => {}}/>
            </td>
            <td className="p-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </td>
            <td className="p-2">{user.name}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2">
              {user.isBlocked ? (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Blocked</span>
              ) : (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              )}
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  )
}