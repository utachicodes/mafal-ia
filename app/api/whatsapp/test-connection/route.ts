import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { accessToken, phoneNumberId } = await request.json()

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json(
        { error: "Access token and phone number ID are required" },
        { status: 400 }
      )
    }

    // Test the connection by getting the phone number details
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}`
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { 
          error: `Failed to connect to WhatsApp API: ${errorData.error?.message || response.statusText}`,
          details: errorData
        },
        { status: response.status }
      )
    }

    const phoneData = await response.json()
    
    return NextResponse.json({
      success: true,
      phoneNumber: phoneData.display_phone_number,
      phoneNumberId: phoneData.id,
      verifiedName: phoneData.verified_name,
      qualityRating: phoneData.quality_rating,
      status: phoneData.status
    })

  } catch (error) {
    console.error("[WhatsApp Test Connection] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}