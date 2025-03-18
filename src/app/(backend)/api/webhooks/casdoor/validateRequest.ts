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
    
    // Now handle the nested object properly
    if (parsedPayload.object) {
      if (typeof parsedPayload.object === 'string') {
        try {
          // Parse the nested object string
          parsedPayload.object = JSON.parse(parsedPayload.object);
        } catch (nestedError) {
          console.error('[Casdoor]: Failed to parse nested object JSON', nestedError);
          // If we can't parse the object, at least keep it as an object to prevent errors
          parsedPayload.object = { id: '', displayName: '' };
        }
      } else if (typeof parsedPayload.object !== 'object') {
        // If object is neither a string nor an object, initialize it as an empty object
        parsedPayload.object = { id: '', displayName: '' };
      }
    } else {
      // Ensure object exists
      parsedPayload.object = { id: '', displayName: '' };
    }
    
    // Validate that object has the required properties
    if (!parsedPayload.object.id) {
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