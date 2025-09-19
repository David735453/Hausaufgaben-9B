import { useState, useEffect } from 'react';
import Layout, { GradientBackground } from '../../components/Layout';
// Removed ConfirmationModal import
import { useUser } from '../../context/UserContext';
import PermissionDropdown from '../../components/PermissionDropdown'; // Import the new component
// I was here - Mitsuba100 the only one who forked this
export default function AdminDashboard() {
  const { user, logout } = useUser(); // Get user from context
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Removed isModalOpen and userToDelete states

  const [newPermissionLevel, setNewPermissionLevel] = useState(1);

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    };
    if (user && user.permissionLevel === 0) {
      // Only fetch users if admin
      fetchUsers();
    }
  }, [user]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: newUser,
        password: newPassword,
        permissionLevel: newPermissionLevel,
      }),
    });
    const data = await res.json();
    setUsers([...users, data]);
    setNewUser('');
    setNewPassword('');
  };

  // Removed handleDeleteUser and confirmDeleteUser functions

  const handlePermissionChange = async (username, permissionLevel) => {
    // Prevent changing David's permission level
    if (username === 'David 735453') {
      alert('Cannot change permission level for David 735453.');
      return;
    }

    const res = await fetch('/api/edit-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, permissionLevel }),
    });
    if (res.ok) {
      const updatedUsers = users.map(
        (
          u // Renamed 'user' to 'u' to avoid conflict with context 'user'
        ) => (u.username === username ? { ...u, permissionLevel } : u)
      );
      setUsers(updatedUsers);
    }
  };

  // Access control: Only level 0 accounts can access this dashboard
  if (!user || user.permissionLevel !== 0) {
    return (
      <Layout>
        <div className="prose dark:prose-dark mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You do not have permission to view this page.</p>
          <button
            onClick={() => (window.location.href = '/admin')}
            className="bg-primary hover:opacity-80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            login with another account
          </button>
        </div>
        <GradientBackground
          variant="large"
          className="fixed top-20 opacity-40 dark:opacity-60"
        />
        <GradientBackground
          variant="small"
          className="absolute bottom-0 opacity-20 dark:opacity-10"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="prose dark:prose-dark mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold my-4">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-primary hover:opacity-80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Create User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="newUser"
                >
                  Username
                </label>
                <input
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="newUser"
                  type="text"
                  placeholder="Username"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  Password
                </label>
                <input
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="newPassword"
                  type="password"
                  placeholder="******************"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-bold mb-2"
                  htmlFor="newPermissionLevel"
                >
                  Permission Level
                </label>
                <select
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  id="newPermissionLevel"
                  value={newPermissionLevel}
                  onChange={(e) =>
                    setNewPermissionLevel(parseInt(e.target.value))
                  }
                >
                  <option value={0}>0: Admin</option>
                  <option value={1}>1: Can create new post</option>
                  <option value={2}>2: Can create and edit</option>
                  <option value={3}>3: Can create, edit and delete</option>
                </select>
              </div>
              <button
                className="bg-primary hover:opacity-80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create User
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <ul className="list-none p-0">
              {users.map((u) => (
                <li
                  key={u.username}
                  className="flex justify-between items-start bg-white dark:bg-gray-800 shadow-md rounded px-4 py-2 mb-2"
                >
                  <span className="text-gray-900 dark:text-gray-100 flex-grow mr-2">
                    {u.username} (Level: {u.permissionLevel})
                  </span>
                  <div className="flex items-center flex-shrink-0 flex-col sm:flex-row">
                    <PermissionDropdown
                      currentPermissionLevel={u.permissionLevel}
                      onPermissionChange={handlePermissionChange}
                      username={u.username}
                      isDavid={u.username === 'David 735453'}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />
    </Layout>
  );
}
