-- CreateTable
CREATE TABLE "user" (
    "userId" TEXT NOT NULL,
    "walletID" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "isWalletActive" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "transactions" (
    "txRef" TEXT NOT NULL,
    "transferAmount" DOUBLE PRECISION NOT NULL,
    "receiverWalletNumber" TEXT NOT NULL,
    "beneficiary_account_number" TEXT NOT NULL,
    "beneficiary_account_name" TEXT NOT NULL,
    "senderWalletNumber" TEXT NOT NULL,
    "userWalletId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("txRef")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_walletID_key" ON "user"("walletID");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "user"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userWalletId_fkey" FOREIGN KEY ("userWalletId") REFERENCES "user"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
