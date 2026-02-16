import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const restaurant = await prisma.restaurant.findFirst({
        where: { name: 'Pro Tennis Shop' }
    })

    if (!restaurant) {
        console.error('Pro Tennis Shop not found')
        return
    }

    const updated = await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { webhookVerifyToken: 'mafalia-retail-verify' }
    })

    console.log(`Updated token for ${updated.name}: ${updated.webhookVerifyToken}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
