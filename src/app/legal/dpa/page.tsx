"use client"

import DashboardLayout from "@/src/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export default function DpaPage() {
  const handleDownload = () => {
    window.print()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Data Processing Agreement (DPA)</h1>
          <p className="text-muted-foreground">This document outlines data processing terms between Mafal-IA and Controllers.</p>
        </div>

        <Card>
          <CardHeader className="flex md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <CardTitle>DPA v1.0</CardTitle>
              <CardDescription>Effective date: {new Date().toLocaleDateString()}</CardDescription>
            </div>
            <Button onClick={handleDownload} className="w-fit">
              <FileDown className="h-4 w-4 mr-2" />
              Download / Print PDF
            </Button>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h2>1. Parties</h2>
            <p>
              This Data Processing Agreement ("DPA") is entered into between the Customer ("Controller") and Mafal-IA ("Processor").
            </p>
            <h2>2. Subject Matter</h2>
            <p>
              The Processor provides conversational AI and messaging services, processing personal data on behalf of the Controller for customer communications and order handling.
            </p>
            <h2>3. Duration</h2>
            <p>
              This DPA remains in force for the duration of the main Services Agreement.
            </p>
            <h2>4. Nature and Purpose</h2>
            <ul>
              <li>Message processing via WhatsApp and web chat</li>
              <li>Menu queries, booking, order management</li>
              <li>Analytics and service improvement</li>
            </ul>
            <h2>5. Categories of Data Subjects</h2>
            <p>End customers, representatives of the Controller, and platform users.</p>
            <h2>6. Categories of Personal Data</h2>
            <p>Contact details, message content, order and booking details, and metadata.</p>
            <h2>7. Processor Obligations</h2>
            <ul>
              <li>Process data only on Controller documented instructions</li>
              <li>Ensure confidentiality and security (encryption in transit, access controls)</li>
              <li>Assist with data subject requests and DPIAs where applicable</li>
              <li>Notify Controller of data breaches without undue delay</li>
            </ul>
            <h2>8. Subprocessors</h2>
            <p>Processor may engage vetted subprocessors with equivalent obligations; a current list is available upon request.</p>
            <h2>9. International Transfers</h2>
            <p>Where applicable, Processor uses appropriate safeguards (e.g., SCCs) for cross-border transfers.</p>
            <h2>10. Return or Deletion</h2>
            <p>Upon termination, Processor will delete or return personal data, unless law requires retention.</p>
            <h2>11. Audits</h2>
            <p>Processor will make available information necessary to demonstrate compliance and allow audits subject to confidentiality.</p>
            <h2>12. Contact</h2>
            <p>Privacy inquiries: privacy@mafal-ia.com</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
