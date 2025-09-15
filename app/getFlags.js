import { decrypt } from '@vercel/flags';
 
async function getFlags(request) {
  const overrideCookie = request.cookies['vercel-flag-overrides'];
  const overrides = await decrypt(overrideCookie);
 
  const flags = {
    exampleFlag: overrides?.exampleFlag ?? false,
  };
 
  return flags;
}