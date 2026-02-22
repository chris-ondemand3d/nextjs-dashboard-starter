"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Order {
  [key: string]: unknown;
}

interface OrderItem {
  [key: string]: unknown;
  order_id: number;
}

export default function CustomerOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [orderColumns, setOrderColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`/api/customers/${customerId}/orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const json = await res.json();
        setOrders(json.orders ?? []);
        setItems(json.items ?? []);
        if (json.orders?.length > 0) {
          setOrderColumns(Object.keys(json.orders[0]));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [customerId]);

  const getItemsForOrder = (orderId: number) =>
    items.filter((item) => item.order_id === orderId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/customers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Customer #{customerId} Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="px-4 lg:px-6">
          <p className="text-muted-foreground">No orders found for this customer.</p>
        </div>
      ) : (
        <>
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {orderColumns.map((col) => (
                      <TableHead key={col}>{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, i) => (
                    <TableRow key={(order.order_id as string) ?? i}>
                      {orderColumns.map((col) => (
                        <TableCell key={col}>
                          {order[col] == null ? "" : String(order[col])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="px-4 lg:px-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Order Items</h2>
            {orders.map((order) => {
              const orderId = order.order_id as number;
              const orderItems = getItemsForOrder(orderId);
              if (orderItems.length === 0) return null;
              return (
                <Card key={orderId}>
                  <CardHeader>
                    <CardTitle>Order #{orderId}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item, j) => (
                          <TableRow key={(item.id as string) ?? j}>
                            <TableCell>{String(item.product_name ?? item.product_id ?? "")}</TableCell>
                            <TableCell>{item.product_price != null ? `$${item.product_price}` : ""}</TableCell>
                            <TableCell>{String(item.quantity ?? "")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
