import { Octokit } from '@octokit/rest';
import matter from 'gray-matter';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { slug, title, date, description, content } = req.body;

  if (!slug || !title || !date || !description || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main'; // Default to 'main' branch

  if (!githubToken || !owner || !repo) {
    return res.status(500).json({ message: 'GitHub credentials not configured' });
  }

  const octokit = new Octokit({
    auth: githubToken,
  });

  const filePath = `posts/${slug}.mdx`;

  // Construct the new MDX content with frontmatter
  const newMdxContent = matter.stringify(content, {
    title,
    date,
    description,
  });

  try {
    // 1. Get the current file to retrieve its SHA
    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });

    const sha = fileData.sha;

    // 2. Update the file content
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Update post: ${title}`,
      content: Buffer.from(newMdxContent).toString('base64'),
      sha,
      branch,
    });

    res.status(200).json({ message: 'Post updated successfully!' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: `Error updating post: ${error.message}` });
  }
}
