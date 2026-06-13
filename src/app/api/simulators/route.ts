import { NextResponse } from "next/server";
import { getSimulators } from "@/lib/data";

// GET /api/simulators - جلب كل المحاكيات
export async function GET() {
  try {
    const simulators = getSimulators();
    return NextResponse.json({ simulators });
  } catch (error) {
    console.error("Error fetching simulators:", error);
    return NextResponse.json(
      { error: "Failed to fetch simulators" },
      { status: 500 }
    );
  }
}
