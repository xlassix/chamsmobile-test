import schemaValidator from '@/lib/apiSchemaValidator';
import chamsMobileAPI from '@/lib/axios';
import prismaClient from '@/lib/prisma';
import { IChamsUser } from '@/shared/hooks';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';

interface TransactionData {
  senderWalletNumber: string;
  transferAmount: string;
  receiverWalletNumber: string;
}

const schema = yup.object().shape({
  senderWalletNumber: yup
    .string()
    .matches(/^\d{12}$/, 'Sender Wallet Number must be 12 digits')
    .required('Sender Wallet Number is required'),

  transferAmount: yup
    .string()
    .matches(/^\d+(\.\d{1,2})?$/, 'Transfer Amount must be a valid number')
    .required('Transfer Amount is required'),

  receiverWalletNumber: yup
    .string()
    .matches(/^\d{12}$/, 'Receiver Wallet Number must be 12 digits')
    .required('Receiver Wallet Number is required'),
});

interface ITransferDetails {
  tx_ref: string;
  transferAmount: string;
  senderWalletNumber: string;
  receiverWalletNumber: string;
  beneficiary_account_name: string;
  originator_account_name: string;
  beneficiary_account_number: string;
  originator_account_number: string;
}

export async function POST(req: Request) {
  const token = (
    !req.headers?.get
      ? (req.headers as any)['authorization']
      : req.headers?.get('authorization')
  )?.split(' ')[1];

  if (!token) {
    return Response.json({ statusCode: 401 }, { status: 401 });
  }

  const data =
    typeof req.body?.locked === 'boolean' ? await req.json() : req.body;

  const { errors, payload } = await schemaValidator<TransactionData>(
    schema,
    data
  );
  if (errors || !payload) {
    return Response.json({ errors }, { status: 406 });
  }

  try {
    const { id } = jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'FailSafe Secret: SuperSecret'
    ) as any;
    const user: IChamsUser = (await chamsMobileAPI.get(`/wallets/${id}`)).data
      .user;

    // check if user owns wallet he is transferring from
    const wallet = user.wallets.find(
      (elem) => elem.account_no == payload.senderWalletNumber
    );

    if (!wallet) {
      return Response.json(
        {
          statusCode: 406,
          errors: {
            message: "You can't transfer from an account that isn't yours",
          },
        },
        { status: 406 }
      );
    }

    const transferred: ITransferDetails = (
      await chamsMobileAPI.post(`/transfers/wallet-to-wallet`, payload)
    ).data.transfer;

    const transferRecord = await prismaClient.user.update({
      where: {
        walletID: id,
      },
      data: {
        transactions: {
          create: {
            txRef: transferred.tx_ref,
            transferAmount: +transferred.transferAmount,
            receiverWalletNumber: transferred.receiverWalletNumber,
            beneficiary_account_number: transferred.beneficiary_account_number,
            beneficiary_account_name: transferred.beneficiary_account_name,
            senderWalletNumber: transferred.senderWalletNumber,
          },
        },
      },
      include: {
        transactions: true,
      },
    });

    return Response.json(
      { statusCode: 200, transferRecord: transferRecord.transactions[0] },
      { status: 200 }
    );
  } catch (e: any) {
    if (e?.code == 'P2025') {
      return Response.json(
        { statusCode: 406, message: 'Not A customer' },
        { status: 406 }
      );
    }
    if (e.response.status === '500') {
      return Response.json(
        { statusCode: 500, message: 'Transfer Failed' },
        { status: 500 }
      );
    }
    return Response.json(
      { statusCode: 401, message: 'user not Authorized' },
      { status: 401 }
    );
  }
}
