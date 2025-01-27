import Products from "./Products";

interface HomeProps {
  searchParams: Promise<{ page: string }>,
}

export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;

  return (
    <>
        <h1 className="font-bold text-xl">Products</h1>
        <Products page={page} />
    </>
  );
}
