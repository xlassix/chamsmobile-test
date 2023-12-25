/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { GET as accountHandler } from '../../app/api/account/route';

jest.setTimeout(60000);

describe('backend', () => {
  describe('/api/account', () => {
    test('return UserData', async () => {
      const { req } = createMocks({
        method: 'GET',
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
      const res = (await accountHandler(req)) as any;
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user).toHaveProperty('account_type');
      expect(data.user).toHaveProperty('wallets');
      expect(Array.isArray(data.transactions)).toBe(true);
    });
    test('Not Authorized', async () => {
      const { req } = createMocks({
        method: 'GET',
      });
      const res = (await accountHandler(req)) as any;
      expect(res.status).toBe(401);
    });

    test('Not a customer', async () => {
      const { req } = createMocks({
        method: 'GET',
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
      const res = (await accountHandler(req)) as any;
      expect(res.status).toBe(406);
      const data = await res.json();
      expect(data).toHaveProperty('message');
    });
  });
});
