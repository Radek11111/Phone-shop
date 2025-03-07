"use server"
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const shippingAddress = await db.shippingAddress.create({
      data: {
        name: data.name,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        phoneNumber: data.phoneNumber || "",
        state: data.state || "",
      },
    });

    return NextResponse.json({ success: true, shippingAddress }, { status: 200 });
  } catch (error) {
    console.error("Error saving shipping details:", error);
    return NextResponse.json({ error: "Failed to save shipping details" }, { status: 500 });
  }
}
