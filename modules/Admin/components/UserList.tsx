"use client";

import { useUsers } from "../Contexts/UserContext";
import { User } from "@/modules/user/types/auth";

export function UserList() {
	const { users, selectedUser, setSelectedUser, loading } = useUsers();

	return (
		<div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto">
			{!loading && users?.map((user: User) => (
				<button
					key={user._id}
					className={`w-full text-left rounded-md border px-4 py-3 transition ${selectedUser?._id === user._id ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-accent/60"}`}
					onClick={() => setSelectedUser(selectedUser?._id === user._id ? null : user)}
				>
					<div className="flex items-center justify-between gap-3">
						<div>
							<div className="font-medium">{user.name}</div>
							<div className="text-xs text-muted-foreground">{user.email}</div>
						</div>
						<span className={`text-xs px-2 py-1 rounded ${user.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
							{user.isBlocked ? "Blocked" : "Active"}
						</span>
					</div>
				</button>
			))}
			{!loading && !users?.length ? <div className="text-sm text-muted-foreground px-2 py-4">No users found.</div> : null}
		</div>
	);
}
