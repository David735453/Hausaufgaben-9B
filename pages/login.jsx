import { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/users');
    const users = await res.json();

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      login(user);
      const { redirect } = router.query;
      router.push(redirect || '/'); // Redirect to the 'redirect' parameter or homepage
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center h-full">
        <form
          className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
          onSubmit={handleLogin}
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
