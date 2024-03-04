import Stripe from "stripe";
import { NextResponse } from "next/server";
import { Product } from "@prisma/client";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

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
  const { items }: {
    items: {
      product: Product;
      quantity: number;
    }[];
  } = await req.json();

  if (!items || items.length === 0) {
    return new NextResponse("Items are required", { status: 400 });
  }

  const productIds = items.map(item => item.product.id);

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach(product => {
    const productQuantity = items.find(item => item.product.id === product.id)?.quantity;

    line_items.push({
      quantity: productQuantity,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100
      }
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((id: string) => ({
          product: {
            connect: {
              id
            }
          }
        }))
      }
    }
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
    metadata: {
      orderId: order.id
    }
  });

  return NextResponse.json({ url: session.url }, {
    headers: corsHeaders
  });
}
