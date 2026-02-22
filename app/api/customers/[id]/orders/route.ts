import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const ordersResult = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY order_id",
      [id]
    );

    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return NextResponse.json({ orders: [], items: [] });
    }

    const orderIds = orders.map((o: { order_id: number }) => o.order_id);
    const placeholders = orderIds.map((_: number, i: number) => `$${i + 1}`).join(", ");

    const itemsResult = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.retail_price AS product_price
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id IN (${placeholders})
       ORDER BY oi.order_id, oi.id`,
      orderIds
    );

    return NextResponse.json({
      orders,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
