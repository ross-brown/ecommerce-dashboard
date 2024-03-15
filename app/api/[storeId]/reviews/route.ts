import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS(req: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string; }; }
) {
  try {
    const { values, productId, storeUserId }: {
      values: {
        name: string;
        stars: number;
        review: string;
      },
      productId: string;
      storeUserId: string;
    } = await req.json();

    if (!productId) return new NextResponse("Product ID is required", { status: 400 });
    if (!storeUserId) return new NextResponse("Store User ID is required", { status: 400 });
    if (!values.name) return new NextResponse("Name is required", { status: 400 });
    if (!values.stars) return new NextResponse("Rating is required", { status: 400 });
    if (!params.storeId) return new NextResponse("Store ID is required", { status: 400 });

    const productById = await prismadb.product.findFirst({
      where: {
        id: productId,
      }
    });

    if (!productById) return new NextResponse("Product ID does not exist", { status: 400 });

    const newReview = await prismadb.review.create({
      data: {
        author: values.name,
        text: values.review,
        stars: Number(values.stars),
        storeUserId,
        product: {
          connect: {
            id: productId
          }
        }
      }
    });

    return NextResponse.json(newReview, { headers: corsHeaders });
  } catch (error) {
    console.log('[REVIEWS_POST]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
