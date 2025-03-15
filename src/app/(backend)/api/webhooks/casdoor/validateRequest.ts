import { headers } from 'next/headers';

import { authEnv } from '@/config/auth';

export type CasdoorUserEntity = {
  avatar?: string;
  displayName: string;
  email?: string;
  id: string;
};

interface CasdoorWebhookPayload {
  action: string;
  // The object is the user entity that is updated.
  // ref: https://github.com/casdoor/casdoor/issues/1918#issuecomment-1572218847
  object: CasdoorUserEntity;
}

export const validateRequest = async (request: Request, secret?: string) => {
  const payloadString = await request.text();
  const headerPayload = headers();
  const casdoorSecret = headerPayload.get('casdoor-secret');
  
  try {
    // Validate the secret first
    if (!casdoorSecret || casdoorSecret !== secret) {
      console.warn(
        '[Casdoor]: secret verify failed, please check your secret in `CASDOOR_WEBHOOK_SECRET`',
      );
      return;
    }
    
    // First parse the main payload
    const parsedPayload = JSON.parse(payloadString);
    
    // Now handle the nested object properly
    if (parsedPayload && parsedPayload.object && typeof parsedPayload.object === 'string') {
      try {
        // Parse the nested object string
        parsedPayload.object = JSON.parse(parsedPayload.object);
      } catch (nestedError) {
        console.error('[Casdoor]: Failed to parse nested object JSON', nestedError);
        // If we can't parse the object, at least keep it as an object to prevent errors
        parsedPayload.object = { id: '', displayName: '' };
      }
    }
    
    // Validate that object has the required properties
    if (!parsedPayload.object || typeof parsedPayload.object !== 'object' || !parsedPayload.object.id) {
      console.error('[Casdoor]: Parsed payload is missing required object properties');
      return;
    }
    
    return parsedPayload as CasdoorWebhookPayload;
  } catch (e) {
    if (!authEnv.CASDOOR_WEBHOOK_SECRET) {
      throw new Error('`CASDOOR_WEBHOOK_SECRET` environment variable is missing.');
    }
    console.error('[Casdoor]: incoming webhook failed in verification.\n', e, payloadString);
    return;
  }
};