import { PrismaClient } from "@prisma/client";
import subscriptionPlans from "./plan_data.json"
const prisma = new PrismaClient();

export async function main() {
  console.log("[Elevator Music Cue] 🎸")
  for (let plan of subscriptionPlans) {
    await prisma.plan.create({
      data: {
        name: plan.name,
        price: plan.price,
        domainsAllowed: plan.domainsAllowed,
        creditsPerMonth: plan.creditsPerMonth,
      }
    })
  }
  console.log("Done 🎉")
}

main()