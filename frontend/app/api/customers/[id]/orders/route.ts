import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Obtener las órdenes del usuario con información relacionada
    const orders = await prisma.orders.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        status: true,
        total: true,
        subtotal: true,
        shipping_cost: true,
        taxes: true,
        discount: true,
        coupon_discount: true,
        tracking_number: true,
        carrier: true,
        estimated_delivery_date: true,
        created_at: true,
        updated_at: true,
        shipped_at: true,
        delivered_at: true,
        cancelled_at: true,
        user_note: true,
        admin_notes: true,
        payments: {
          select: {
            payment_method: true,
            payment_status: true,
            reference: true,
            transaction_id: true,
          },
        },
        addresses: {
          select: {
            address: true,
            city: true,
            department: true,
            country: true,
          },
        },
        order_items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            subtotal: true,
            color_code: true,
            size: true,
            products: {
              select: {
                id: true,
                name: true,
                description: true,
                images: {
                  where: {
                    is_primary: true,
                  },
                  select: {
                    image_url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Respuesta con información del cliente y órdenes
    const response = {
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      },
      orders: orders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        shipping_cost: order.shipping_cost,
        taxes: order.taxes,
        discount: order.discount || 0,
        coupon_discount: order.coupon_discount || 0,
        tracking_number: order.tracking_number,
        carrier: order.carrier,
        estimated_delivery_date: order.estimated_delivery_date,
        created_at: order.created_at,
        updated_at: order.updated_at,
        shipped_at: order.shipped_at,
        delivered_at: order.delivered_at,
        cancelled_at: order.cancelled_at,
        user_note: order.user_note,
        admin_notes: order.admin_notes,
        payment_method: order.payments.payment_method,
        payment_status: order.payments.payment_status,
        payment_reference: order.payments.reference,
        transaction_id: order.payments.transaction_id,
        shipping_address: {
          address: order.addresses.address,
          city: order.addresses.city,
          department: order.addresses.department,
          country: order.addresses.country,
        },
        customer: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
        },
        items: order.order_items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
          color_code: item.color_code,
          size: item.size,
          product: {
            id: item.products.id,
            name: item.products.name,
            description: item.products.description,
            image_url: item.products.images[0]?.image_url || null,
          },
        })),
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
