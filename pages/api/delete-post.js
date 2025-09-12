import { Octokit } from '@octokit/rest';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ message: 'Post slug is required.' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main'; // Default to 'main' branch

  if (!githubToken || !owner || !repo) {
    return res.status(500).json({ message: 'GitHub credentials not configured.' });
  }

  const octokit = new Octokit({
    auth: githubToken,
  });

  const filePath = `posts/${slug}.mdx`;

  try {
    // 1. Get the file to retrieve its SHA
    let fileData;
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref: branch,
      });
      fileData = response.data;
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ message: 'Post not found.' });
      }
      throw error; // Re-throw other errors
    }

    const sha = fileData.sha;

    // 2. Delete the file
    await octokit.repos.deleteFile({
      owner,
      repo,
      path: filePath,
      message: `feat: delete post "${slug}"`, // Use feat: for new features
      sha,
      branch,
    });

    res.status(200).json({ message: `Post "${slug}" deleted successfully!` });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: `Error deleting post: ${error.message}` });
  }
}
