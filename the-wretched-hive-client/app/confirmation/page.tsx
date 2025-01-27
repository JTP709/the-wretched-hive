interface ConfirmationProps {
  searchParams: {
    total: string,
  }
}

export default async function Confirmation({ searchParams }: ConfirmationProps) {
  const { total } = await searchParams;

  return (
    <div className="flex flex-col justify-center">
      <h1 className="font-bold text-xl">Congratulations!</h1>
      <h2 className="my-4">Your purchase is complete.</h2>
      <p className="font-bold">You paid ${ total }</p>
    </div>
  )
};
