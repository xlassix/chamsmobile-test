/**
 * @jest-environment node
 */

import { createMocks } from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { POST as loginHandler } from '../../app/api/account/login/route';

describe('backend', () => {
  describe('/api/account/login', () => {
    test('return UserData', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          password: 'superSecret',
          userIdentifier: 'john.doe@example.com',
        },
      });
      const res = (await loginHandler(req)) as any;
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.user).toHaveProperty('firstName');
      expect(data.user).toHaveProperty('gender');
      expect(data).toHaveProperty('token');
      expect(typeof data.token).toEqual('string');
    });
    test('Empty Request', async () => {
      const { req } = createMocks();
      const res = (await loginHandler(req)) as any;
      expect(res.status).toBe(406);
    });

    test('Not a customer', async () => {
      const { req } = createMocks({
        method: 'POST',
        body: {
          password: 'supersecrer',
          userIdentifier: 'john3.doe3@example.com',
        },
      });
      const res = (await loginHandler(req)) as any;
      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data).toHaveProperty('message');
    });
  });
});
