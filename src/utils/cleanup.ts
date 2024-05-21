import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanup(email: string) {
  await prisma.user.delete({
    where: {
      email: email
    }
  })
}
export default cleanup
