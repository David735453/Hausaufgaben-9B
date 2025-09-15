import { createClient } from 'flags/next';
 
export default async function getFlags(request) {
  const client = createClient(request);
  const flags = await client.getFlags();
 
  return flags;
}