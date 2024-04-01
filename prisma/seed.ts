import { PrismaClient } from "@prisma/client";
import subscriptionPlans from "./plan_data.json"
const prisma = new PrismaClient();

export async function main() {
  console.log("[Elevator Music Cue] 🎸")
  // const deletePlans = await prisma.plan.deleteMany();
  // console.log("Deleted plans: ", deletePlans.count)
  for (let plan of subscriptionPlans) {
    await prisma.plan.upsert({
      where: {
        name: plan.name,
      },
      create: {
        name: plan.name,
        price: plan.price,
        domainsAllowed: plan.domainsAllowed,
        creditsPerMonth: plan.creditsPerMonth,
      },
      update: {
        price: plan.price,
        domainsAllowed: plan.domainsAllowed,
        creditsPerMonth: plan.creditsPerMonth,
      },
    })
  }
  console.log("Done 🎉")
}

main()