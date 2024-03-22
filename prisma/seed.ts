import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test user
  // const user = await prisma.user.upsert({
  //   where: { email: 'test@testmageai.com' },
  //   update: {},
  //   create: {
  //     email: 'test@testmageai.com',
  //     name: 'Test User',
  //     // password: `$2y$12$GBfcgD6XwaMferSOdYGiduw3Awuo95QAPhxFE0oNJ.Ds8qj3pzEZy`
  //   }
  // })
  // console.log({ user })

  // Delete test user
  const deletedUser = await prisma.user.delete({
    where: { email: 'test@testmageai.com' },
  })
  console.log({ deletedUser })
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })