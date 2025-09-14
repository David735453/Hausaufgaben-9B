import { useState, useRef, useEffect } from 'react';
import Layout, { GradientBackground } from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getGlobalData } from '../utils/global-data';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/router';

export default function AddPostPage({ globalData }) {
  const { user, logout } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState(
    `Title, ${new Date().toLocaleDateString('de-DE')}`
  );
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [content, setContent] = useState(`## Informatik: nichts

## Geschichte: nichts

## Englisch: nichts

## Deutsch: nichts

## Französisch: nichts

## Mathe: nichts

## Physik: nichts

## Chemie: nichts

## Biologie: nichts

## Katholisch: nichts

## Musik: nichts`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'; // Reset height to recalculate
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/add-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, date, description, content }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setTitle('');
        setDate('');
        setDescription('');
        setContent('');
      } else {
        const errorData = await response.json();
        setSubmitStatus(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setSubmitStatus('Error: Could not submit the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || ![0, 1, 2, 3].includes(user.permissionLevel)) {
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
                Re-login with another account
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
      <Header name={globalData.name} />
      <main className="w-full flex justify-center">
        <div className="w-full max-w-2xl p-8 my-12 rounded-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10">
          <h1 className="text-3xl lg:text-4xl text-center mb-8">
            Add New Blog Post
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-lg font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="date" className="block text-lg font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-lg font-medium mb-2"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="content"
                className="block text-lg font-medium mb-2"
              >
                Content (MDX)
              </label>
              <textarea
                id="content"
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 resize-none overflow-hidden"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-opacity-80 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Add Post'}
              </button>
            </div>
          </form>
          {submitStatus && (
            <p
              className={`mt-4 text-center ${
                submitStatus.startsWith('Error')
                  ? 'text-red-500'
                  : 'text-green-500'
              }`}
            >
              {submitStatus === 'success'
                ? 'Post added successfully!'
                : submitStatus}
            </p>
          )}
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

export function getStaticProps() {
  const globalData = getGlobalData();
  return { props: { globalData } };
}
