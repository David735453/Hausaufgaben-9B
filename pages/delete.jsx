import { useState } from 'react';
import Head from 'next/head';
import Layout, { GradientBackground } from '../components/Layout';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPosts } from '../utils/mdx-utils';
import { getGlobalData } from '../utils/global-data';
import ConfirmationModal from '../components/ConfirmationModal'; // Import the new component
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router'; // Import useRouter

export default function DeleteIndexPage({ posts, globalData }) {
  const { user, logout } = useUser();
  const router = useRouter(); // Initialize useRouter
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [postToDelete, setPostToDelete] = useState(null); // State to store post info for modal

  const handleDeleteClick = (slug, title) => {
    setPostToDelete({ slug, title });
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowModal(false); // Close modal
    if (!postToDelete) return;

    setDeleting(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/delete-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: postToDelete.slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        window.location.reload(); // Simple refresh for now
      } else {
        setError(data.message || 'An unknown error occurred.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
      console.error(err);
    } finally {
      setDeleting(false);
      setPostToDelete(null); // Clear post info
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false); // Close modal
    setPostToDelete(null); // Clear post info
  };

  if (!user || ![0, 3].includes(user.permissionLevel)) {
    return (
      <Layout>
        <Header name={globalData.name} />
        <main className="w-full flex justify-center">
          <div className="w-full max-w-2xl p-8 my-12 rounded-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10">
            <h1 className="text-3xl lg:text-4xl text-center mb-8">
              Access Denied
            </h1>
            <p className="text-center mb-4">
              You do not have permission to view this page.
            </p>
            <div className="text-center">
              <button
                onClick={() =>
                  (window.location.href = `/login?redirect=${router.asPath}`)
                }
                className="bg-primary hover:opacity-80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                login with another account
              </button>
            </div>
          </div>
        </main>
        <Footer copyrightText={globalData.footerText} />
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
      <SEO title={globalData.name} description="Delete Blog Posts" />
      <Header name={globalData.name} />
      <main className="w-full">
        <h1 className="text-3xl lg:text-5xl text-center mb-12">
          Delete Blog Posts
        </h1>
        {message && (
          <p className="mt-4 text-green-600 text-center">{message}</p>
        )}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        <ul className="w-full">
          {posts.length ? (
            posts.map((post) => (
              <li
                key={post.filePath}
                className="md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hovered-sibling:border-t-0"
              >
                <div className="py-6 lg:py-10 px-6 lg:px-16 block focus:outline-none focus:ring-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl md:text-3xl">{post.data.title}</h2>
                    {post.data.description && (
                      <p className="mt-3 text-lg opacity-60">
                        {post.data.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      handleDeleteClick(
                        post.filePath.replace(/\.mdx?$/, ''),
                        post.data.title
                      )
                    }
                    disabled={deleting}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts found.</p>
          )}
        </ul>
      </main>
      <Footer copyrightText={globalData.footerText} />
      <GradientBackground
        variant="large"
        className="fixed top-20 opacity-40 dark:opacity-60"
      />
      <GradientBackground
        variant="small"
        className="absolute bottom-0 opacity-20 dark:opacity-10"
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the post "${postToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getPosts();
  const globalData = getGlobalData();

  return {
    props: {
      posts,
      globalData,
    },
  };
}
