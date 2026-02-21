import { stripe } from "@/lib/stripe";

export async function POST(req) {
  const { items } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100
      },
      quantity: 1
    })),
    mode: "payment",
    success_url: process.env.NEXT_PUBLIC_URL + "/orders",
    cancel_url: process.env.NEXT_PUBLIC_URL + "/cart"
  });

  return Response.json({ url: session.url });
}
