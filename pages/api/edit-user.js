
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, permissionLevel } = req.body;

    const filePath = path.join(process.cwd(), 'users.json');
    const fileData = fs.readFileSync(filePath);
    let data = JSON.parse(fileData);

    const userIndex = data.findIndex((user) => user.username === username);

    if (userIndex > -1) {
      data[userIndex].permissionLevel = permissionLevel;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: 'User updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
