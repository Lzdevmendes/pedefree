import Image from "next/image";

interface ConsumptionMethodOptionProps {
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  onClick: () => void;
}

const ConsumptionMethodOption = ({
  imageAlt,
  imageUrl,
  buttonText,
  onClick,
}: ConsumptionMethodOptionProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border bg-card text-card-foreground shadow-sm transition active:scale-95 hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex flex-col items-center gap-5 py-6 px-4">
        <div className="relative h-[80px] w-[80px]">
          <Image
            src={imageUrl}
            fill
            alt={imageAlt}
            className="object-contain"
          />
        </div>
        <span className="w-full rounded-full bg-secondary py-2 text-center text-sm font-semibold text-secondary-foreground">
          {buttonText}
        </span>
      </div>
    </button>
  );
};

export default ConsumptionMethodOption;