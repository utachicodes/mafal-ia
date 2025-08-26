import { NextResponse } from "next/server"
import { getPrisma } from "@/src/lib/db"
import { subDays, startOfDay } from "date-fns"

export async function GET() {
  try {
    const prisma = await getPrisma()

    const totalLeads = await prisma.conversation.count()

    const today = startOfDay(new Date())
    const sevenDaysAgo = subDays(today, 6) // inclusive 7 days window
    const leadsLast7Days = await prisma.conversation.groupBy({
      by: ["createdAt"],
      _count: { _all: true },
      where: { createdAt: { gte: sevenDaysAgo } },
    })

    const todayLeads = await prisma.conversation.count({ where: { createdAt: { gte: today } } })

    return NextResponse.json({
      totalLeads,
      todayLeads,
      leadsLast7Days: leadsLast7Days
        .map((d: any) => ({ date: d.createdAt, count: d._count?._all || d._count || 0 }))
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load analytics" }, { status: 500 })
  }
}
