import schemaValidator from '@/lib/apiSchemaValidator';
import chamsMobileAPI from '@/lib/axios';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';

type LoginData = {
  userIdentifier: string;
  password: string;
};

const schema = yup.object().shape({
  userIdentifier: yup.string().required(),
  password: yup.string().required().min(5),
});

export async function GET(req: Request) {
  return Response.json({ statusCode: 200, message: 'API service' });
}
export async function POST(req: Request) {
  const data =
    typeof req.body?.locked === 'boolean' ? await req.json() : req.body;
  const { errors, payload } = await schemaValidator<LoginData>(schema, data);
  if (errors || !payload) {
    return Response.json({ errors }, { status: 406 });
  }
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [
          { email: payload.userIdentifier },
          { phoneNumber: payload.userIdentifier },
        ],
      },
    });
    if (user && bcrypt.compareSync(payload.password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user.walletID,
          time: Date.now(),
        },
        process.env.JWT_SECRET ?? 'FailSafe Secret: SuperSecret',
        { expiresIn: '8h' }
      );

      const { password, ...rest } = user;
      return Response.json({ statusCode: 200, token, user: rest });
    }
    return Response.json(
      { statusCode: 401, message: 'user not Authorized' },
      { status: 401 }
    );
  } catch (e: any) {
    console.log(e);
    return Response.json(
      { statusCode: 406, error: e.response?.data || e.message },
      { status: e.response.status ?? 406 }
    );
  }
}
