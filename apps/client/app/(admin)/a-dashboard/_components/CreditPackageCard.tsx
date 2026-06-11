interface CreditPackageCardProps {
  id: string;
  name: string;
  credits: number;
  priceInPaise: number;
  isActive: boolean;
}

export default function CreditPackageCard(props: CreditPackageCardProps) {
  return (
    <div className="max-w-80 min-w-80 flex flex-col gap-7 border border-gray-200 rounded-lg shadow-xs px-6 py-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-medium text-lg">{props.name}</h2>

        <p>Price: ₹ {props.priceInPaise / 100}</p>
      </div>

      <div className="flex items-center justify-between gap-5">
        <p>Credits: {props.credits}</p>

        <p>Active state: {props.isActive === true ? "True" : "False"}</p>
      </div>
    </div>
  );
}
