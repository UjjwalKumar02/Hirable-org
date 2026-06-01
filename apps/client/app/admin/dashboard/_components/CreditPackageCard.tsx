interface CreditPackageCardProps {
  name: string;
  credits: number;
  priceInPaise: number;
  isActive: boolean;
}

export default function CreditPackageCard(props: CreditPackageCardProps) {
  return (
    <div>
      <p>{props.name}</p>
      <p>{props.credits}</p>
      <p>{props.priceInPaise}</p>
      <p>{props.isActive === true ? "True" : "False"}</p>
    </div>
  );
}
