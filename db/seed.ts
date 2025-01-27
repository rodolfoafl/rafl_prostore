import { Prisma, PrismaClient} from "@prisma/client"
import sampleData from "@/db/sample-data"

async function main(){
  const prisma = new PrismaClient()

  await prisma.product.deleteMany()

  await prisma.product.createMany({ data: sampleData.products})

  console.log('Database seeded successfully!')
}

main()

// To run: npx tsx ./db/seed