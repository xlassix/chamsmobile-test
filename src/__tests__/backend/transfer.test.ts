/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { POST as transferHandler } from '../../app/api/transfer/route';

describe('backend', () => {
  describe('/api/transfer', () => {
    test('return UserData', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          receiverWalletNumber: '101000001150',
          transferAmount: '2',
          senderWalletNumber: '101000001143',
        },
        headers: {
          authorization: `Bearer ${jwt.sign(
            {
              email: 'john.doe@example.com',
              id: `109`,
              time: Date.now(),
            },
            process.env.JWT_SECRET ?? 'FailSafe Secret: SuperSecret'
          )}`,
        },
      });
      const res = (await transferHandler(req)) as any;
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.transferRecord).toHaveProperty('txRef');
      expect(data.transferRecord).toHaveProperty('transferAmount');
    });
    test('Not Authorized', async () => {
      const { req } = createMocks({
        method: 'GET',
      });
      const res = (await transferHandler(req)) as any;
      expect(res.status).toBe(401);
    });

    test('Not a customer', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          receiverWalletNumber: '101000000000',
          transferAmount: '2',
          senderWalletNumber: '101000001143',
        },
        headers: {
          authorization: `Bearer ${jwt.sign(
            {
              email: 'john.doe@example.com',
              id: `101`,
              time: Date.now(),
            },
            process.env.JWT_SECRET ?? 'FailSafe Secret: SuperSecret'
          )}`,
        },
      });
      const res = (await transferHandler(req)) as any;
      expect(res.status).toBe(406);
      const data = await res.json();
      expect(data).toHaveProperty('errors');
    });

    test('Not a customer Details', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          receiverWalletNumber: '101000000000',
          transferAmount: '2',
          senderWalletNumber: '101000001143',
        },
        headers: {
          authorization: `Bearer ${jwt.sign(
            {
              email: 'john.doe@example.com',
              id: `109`,
              time: Date.now(),
            },
            process.env.JWT_SECRET ?? 'FailSafe Secret: SuperSecret'
          )}`,
        },
      });
      const res = (await transferHandler(req)) as any;
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('statusCode');
    });
  });
});
