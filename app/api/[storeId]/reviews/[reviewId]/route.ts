import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; reviewId: string; }; }
) {
  try {
    if (!params.reviewId) return new NextResponse("Review ID is required", { status: 400 });

    const review = await prismadb.review.deleteMany({
      where: {
        id: params.reviewId,
      }
    });

    return NextResponse.json(review, { headers: corsHeaders });
  } catch (error) {
    console.log("[REVIEW_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
