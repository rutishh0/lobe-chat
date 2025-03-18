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
  // Skip validation during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return { 
      action: 'test-action', 
      object: { id: 'test-id', displayName: 'Test User' }
    } as CasdoorWebhookPayload;
  }

  try {
    const payloadString = await request.text();
    const headerPayload = headers();
    const casdoorSecret = headerPayload.get('casdoor-secret');
    
    // Validate the secret first
    if (!casdoorSecret || casdoorSecret !== secret) {
      console.warn(
        '[Casdoor]: secret verify failed, please check your secret in `CASDOOR_WEBHOOK_SECRET`',
      );
      return;
    }
    
    // First parse the main payload
    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(payloadString);
    } catch (error) {
      console.error('[Casdoor]: Failed to parse payload JSON', error);
      return;
    }
    
    if (!parsedPayload || typeof parsedPayload !== 'object') {
      console.error('[Casdoor]: Payload is not a valid object');
      return;
    }
    
    // Handle the nested object - defensive approach
    if (parsedPayload.object) {
      if (typeof parsedPayload.object === 'string') {
        try {
          parsedPayload.object = JSON.parse(parsedPayload.object);
        } catch (nestedError) {
          parsedPayload.object = { id: '', displayName: '' };
        }
      } else if (typeof parsedPayload.object !== 'object') {
        parsedPayload.object = { id: '', displayName: '' };
      }
    } else {
      parsedPayload.object = { id: '', displayName: '' };
    }
    
    // Ensure action exists
    if (!parsedPayload.action) {
      parsedPayload.action = '';
    }
    
    return parsedPayload as CasdoorWebhookPayload;
  } catch (e) {
    if (!authEnv.CASDOOR_WEBHOOK_SECRET) {
      throw new Error('`CASDOOR_WEBHOOK_SECRET` environment variable is missing.');
    }
    console.error('[Casdoor]: incoming webhook failed in verification.\n', e);
    return;
  }
};