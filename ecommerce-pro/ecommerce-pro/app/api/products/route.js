import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: "i" };

  const products = await Product.find(query);
  return Response.json(products);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return Response.json(product);
}
