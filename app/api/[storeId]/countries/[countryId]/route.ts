import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { countryId: string; }; }
) {
  try {
    if (!params.countryId) return new NextResponse("Country ID is required", { status: 400 });

    const country = await prismadb.country.findUnique({
      where: {
        id: params.countryId,
      }
    });

    return NextResponse.json(country);
  } catch (error) {
    console.log("[COUNTRY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, countryId: string; }; }
) {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });
    if (!params.countryId) return new NextResponse("Country ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const country = await prismadb.country.updateMany({
      where: {
        id: params.countryId,
      },
      data: {
        name,
        value
      }
    });

    return NextResponse.json(country);
  } catch (error) {
    console.log("[COUNTRY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; countryId: string; }; }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!params.countryId) return new NextResponse("Country ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

    const country = await prismadb.country.deleteMany({
      where: {
        id: params.countryId,
      }
    });

    return NextResponse.json(country);
  } catch (error) {
    console.log("[COUNTRY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
