"use client";

import { PageHeader } from "./PageHeader";
import { UserToolbar } from "./UserToolbar";
import { UserList } from "./UserList";
import { UserDetailsPanel } from "./UserDetailsPanel";

export default function UserManager() {
	return (
		<div className="flex h-screen bg-background text-foreground">
			<div className="flex-1 p-6 space-y-6">
				<PageHeader />
				<div className="bg-card rounded-lg shadow-sm border border-border p-4 space-y-4">
					<UserToolbar />
					<UserList />
				</div>
			</div>
			<UserDetailsPanel />
		</div>
	);
}
