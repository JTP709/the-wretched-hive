import { getProductDetails } from "@/api/server";
import AddToCartButton from "@/app/AddToCartButton";

export default async function ProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const product = await getProductDetails(id);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="font-bold">{ product.name }</h1>
          <h2 className="mb-4">{ product.category }</h2>
        </div>
        <p>${ product.price }</p>
      </div>
      <div className="flex flex-row">
        <img src="https://placehold.co/256x256" alt="placeholder image" />
        <div className="ml-4">
          <p>{ product.description }</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  )
}