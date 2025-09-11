import { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getGlobalData } from '../utils/global-data';

export default function AddPostPage({ globalData }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  return (
    <Layout>
      <Header name={globalData.name} />
      <main className="w-full flex justify-center">
        <div className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-3xl lg:text-4xl text-center mb-8">Add New Blog Post</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-lg font-medium mb-2">Title</label>
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
              <label htmlFor="date" className="block text-lg font-medium mb-2">Date</label>
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
              <label htmlFor="description" className="block text-lg font-medium mb-2">Description</label>
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
              <label htmlFor="content" className="block text-lg font-medium mb-2">Content (MDX)</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="10"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700"
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
            <p className={`mt-4 text-center ${submitStatus.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
              {submitStatus === 'success' ? 'Post added successfully!' : submitStatus}
            </p>
          )}
        </div>
      </main>
      <Footer copyrightText={globalData.footerText} />
    </Layout>
  );
}

export function getStaticProps() {
  const globalData = getGlobalData();
  return { props: { globalData } };
}
