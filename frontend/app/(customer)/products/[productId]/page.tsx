import { redirect } from 'next/navigation';

type Params = Promise<{ productId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { productId } = await params;
  redirect(`/product/${productId}`);
}
