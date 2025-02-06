import Products from "./Products";
import Search from "./Search";

interface HomeProps {
  searchParams: Promise<{ page: string, search: string }>,
}

export default async function Home({ searchParams }: HomeProps) {
  const { page, search } = await searchParams;

  return (
    <>
      <h1 className="font-bold text-xl">Products</h1>
      <Search />
      <Products page={page} search={search} />
    </>
  );
}
