
"use client";

type User = {
  id: string;
  name: string;
  color: string;
};

export default function Presence({ users }: { users: User[] }) {
  return (
    <div className="mb-4">
      <h2 className="font-semibold mb-2">Active Users</h2>

      <div className="flex gap-3">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-sm">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}