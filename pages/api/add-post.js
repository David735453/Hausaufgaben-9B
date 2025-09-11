import { Buffer } from 'buffer';

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, date, description, content } = req.body;

    if (!title || !date || !description || !content) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env;

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !GITHUB_BRANCH) {
      return res.status(500).json({ message: 'GitHub environment variables are not configured.' });
    }

    const slug = slugify(title);
    const filePath = `posts/${slug}.mdx`;

    const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

    try {
      // Check if the file already exists
      const existingFileResponse = await fetch(githubApiUrl, {
        method: 'HEAD',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
        },
      });

      if (existingFileResponse.ok) {
        return res.status(409).json({ message: 'A post with this title already exists.' });
      }

      // If the file does not exist, create it
      const mdxContent = `---
title: ${title}
date: ${date}
description: ${description}
---

${content}
`;

      const encodedContent = Buffer.from(mdxContent).toString('base64');

      const createResponse = await fetch(githubApiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `feat: add new post "${title}"`,
          content: encodedContent,
          branch: GITHUB_BRANCH,
        }),
      });

      if (createResponse.ok) {
        res.status(200).json({ message: 'Post created successfully.' });
      } else {
        const errorData = await createResponse.json();
        res.status(createResponse.status).json({ message: `Error creating post: ${errorData.message}` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error communicating with GitHub API.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
