import { useToast } from "@/hooks/use-toast";

interface ThemeContentProps {
  bgColor: string;
  setBgColor: (color: string) => void;
}

export const ThemeContent = ({ bgColor, setBgColor }: ThemeContentProps) => {
  const { toast } = useToast();
  
  const colorOptions = [
    { name: "Default", class: "bg-background" },
    { name: "Soft Purple", class: "bg-[#E5DEFF]" },
    { name: "Soft Pink", class: "bg-[#FFDEE2]" },
    { name: "Soft Blue", class: "bg-[#D3E4FD]" },
    { name: "Soft Peach", class: "bg-[#FDE1D3]" },
    { name: "Soft Green", class: "bg-[#F2FCE2]" },
  ];

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Choose Background Color</h2>
      <div className="grid grid-cols-2 gap-4">
        {colorOptions.map((color) => (
          <button
            key={color.name}
            onClick={() => {
              setBgColor(color.class);
              toast({
                title: "Background Updated",
                description: `Theme changed to ${color.name}`,
              });
            }}
            className={`p-4 rounded-lg border transition-all ${
              bgColor === color.class ? "ring-2 ring-wedding-pink" : ""
            } ${color.class} hover:scale-105`}
          >
            <span className="text-sm font-medium">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};