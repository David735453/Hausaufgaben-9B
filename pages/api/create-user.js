
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, permissionLevel } = req.body;
    const newUser = { username, password, permissionLevel };

    const filePath = path.join(process.cwd(), 'users.json');
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    data.push(newUser);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.status(201).json(newUser);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
