import schemaValidator from '@/lib/apiSchemaValidator';
import chamsMobileAPI from '@/lib/axios';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcrypt';
import cuid from 'cuid';
import * as yup from 'yup';

type BvnDetails = {
  bvn: string;
  bvnDateOfBirth: Date;
};

interface ICustomerData {
  firstName: string;
  middleName: string;
  lastName: string;
  bvnDetails: BvnDetails;
  customerEmail: string;
  phoneNumber: string;
  photoUrl: string;
  gender: 'male' | 'female';
}

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required()
    .transform((value) => value.toLowerCase()),
  middleName: yup
    .string()
    .required()
    .transform((value) => value.toLowerCase()),
  lastName: yup
    .string()
    .required()
    .transform((value) => value.toLowerCase()),
  bvnDetails: yup
    .object()
    .shape({
      bvn: yup
        .string()
        .matches(/^\d{11}$/, 'BVN must be 11 digits')
        .required(),
      bvnDateOfBirth: yup.date().required(),
    })
    .required(),
  customerEmail: yup
    .string()
    .email()
    .required()
    .transform((value) => value.toLowerCase()),
  phoneNumber: yup
    .string()
    .matches(/^\+\d{13}$/, 'Phone number must be in the format +234xxxxxxxxxx')
    .required(),
  gender: yup.mixed().oneOf(['male', 'female']).required(),
  photoUrl: yup
    .string()
    .url()
    .required()
    .default(
      'https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png'
    ),
  password: yup.string().required().min(5),
});

export async function GET(req: Request) {
  return Response.json({ statusCode: 200, message: 'API service' });
}
export async function POST(req: Request) {
  const data =
    typeof req.body?.locked === 'boolean' ? await req.json() : req.body;
  const { errors, payload } = await schemaValidator<
    ICustomerData & { password: string }
  >(schema, data);
  if (errors || !payload) {
    return Response.json({ errors }, { status: 406 });
  }
  const { password, ...rest } = payload;
  try {
    const ccuid = cuid();
    const salt = bcrypt.genSaltSync();
    const _user = await prismaClient.user.findUnique({
      where: {
        email: rest.customerEmail,
      },
    });
    if (_user) {
      return Response.json(
        {
          statusCode: 406,
          error: { message: 'An Account already exist with this email' },
        },
        { status: 406 }
      );
    }
    const chams_res = (
      await chamsMobileAPI.post('/wallets/', {
        ...rest,
        walletReference: ccuid,
        walletName: 'default',
        bvnDetails: {
          ...rest.bvnDetails,
          bvnDateOfBirth: rest.bvnDetails.bvnDateOfBirth
            .toISOString()
            .split('T')[0],
        },
      })
    ).data;
    const user = await prismaClient.user.create({
      data: {
        userId: ccuid,
        walletID: `${chams_res.id}`,
        firstName: rest.firstName,
        lastName: rest.lastName,
        middleName: rest.middleName,
        phoneNumber: rest.phoneNumber,
        email: rest.customerEmail,
        photoUrl: rest.photoUrl,
        gender: rest.gender,
        isWalletActive: true,
        password: bcrypt.hashSync(password, salt),
      },
    });
    return Response.json({ statusCode: 200, ...chams_res });
  } catch (e: any) {
    return Response.json(
      { statusCode: 406, error: e.response?.data || e.message },
      { status: e?.response?.status ?? 406 }
    );
  }
}
