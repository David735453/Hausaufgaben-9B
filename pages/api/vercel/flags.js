import { verifyAccess, version } from 'flags';
import { getProviderData } from 'flags/next';
import * as flags from 'flags';

export default async function handler(request, response) {
  const access = await verifyAccess(request.headers['authorization']);
  if (!access) return response.status(401).json(null);

  const apiData = getProviderData(flags);

  // set the required response header here, so it is
  // available on successful responses but not on the 401 above
  response.setHeader('x-flags-sdk-version', version);

  return response.json(apiData);
}
