interface ConfirmationProps {
  searchParams: {
    total: string,
  }
}

export default function Confirmation({ searchParams }: ConfirmationProps) {
  return (
    <div>
      <h1>Congratulations!</h1>
      <h2>Your purchase is complete.</h2>
      <p>You paid {searchParams.total}</p>
    </div>
  )
};
