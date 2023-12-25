import prismaClient from "../src/lib/prisma";
import bcrypt from "bcrypt"

async function main() {
  const salt = bcrypt.genSaltSync();
  const data = await prismaClient.user.upsert(
    {
      where: {
        email: "john.doe@example.com",
      },
      update: {},
      create: {
        walletID: `109`,
        firstName: "Test",
        lastName: "Test",
        middleName: "Test",
        phoneNumber: "",
        email: "john.doe@example.com",
        photoUrl: "https://google.com",
        gender: "male",
        password: bcrypt.hashSync("superSecret", salt),
      }
    }

  );

}

main()
  .then(_ => process.exit(0))
  .catch(e => {
    console.error();
    process.exit(0);
  });
