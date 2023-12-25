import chamsMobileAPI from '@/lib/axios';
import prismaClient from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  const token = (
    !req.headers?.get
      ? (req.headers as any)['authorization']
      : req.headers?.get('authorization')
  )?.split(' ')[1];

  if (!token) {
    return Response.json({ statusCode: 401 }, { status: 401 });
  }

  try {
    const { id } = jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'FailSafe Secret: SuperSecret'
    ) as any;
    const [chams_res, user] = await Promise.all([
      chamsMobileAPI.get(`/wallets/${id}`),
      prismaClient.user.findUniqueOrThrow({
        where: {
          walletID: id,
        },
        include: {
          transactions: true,
        },
      }),
    ]);
    return Response.json(
      {
        statusCode: 200,
        user: chams_res.data.user,
        transactions: user?.transactions ?? [],
      },
      { status: 200 }
    );
  } catch (e: any) {
    if (e?.code == 'P2025') {
      return Response.json(
        { statusCode: 406, message: 'Not A customer' },
        { status: 406 }
      );
    }
    return Response.json(
      { statusCode: 401, message: 'user not Authorized' },
      { status: 401 }
    );
  }
}
