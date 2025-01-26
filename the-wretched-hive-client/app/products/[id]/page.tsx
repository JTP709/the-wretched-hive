export default async function ProductsPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id
  const product = await fetch(`http://localhost:4000/api/products/${id}`)
    .then(res => res.json());

  return (
    <div>
      <h1>{ product.name }</h1>
      <p>{ product.category }</p>
      <p>{ product.description }</p>
      <p>{ product.price }</p>
    </div>
  )
}