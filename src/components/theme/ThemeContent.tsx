import { useToast } from "@/hooks/use-toast";

interface ThemeContentProps {
  bgColor: string;
  setBgColor: (color: string) => void;
}

export const ThemeContent = ({ bgColor, setBgColor }: ThemeContentProps) => {
  const { toast } = useToast();
  
  const colorSchemes = [
    {
      name: "Default",
      bg: "bg-background",
      primary: "wedding-pink",
      accent: "pink-400",
      text: "gray-600"
    },
    {
      name: "Soft Purple",
      bg: "bg-[#E5DEFF]",
      primary: "purple-400",
      accent: "indigo-400",
      text: "purple-700"
    },
    {
      name: "Soft Pink",
      bg: "bg-[#FFDEE2]",
      primary: "rose-400",
      accent: "pink-500",
      text: "rose-700"
    },
    {
      name: "Soft Blue",
      bg: "bg-[#D3E4FD]",
      primary: "blue-400",
      accent: "indigo-400",
      text: "blue-700"
    },
    {
      name: "Soft Peach",
      bg: "bg-[#FDE1D3]",
      primary: "orange-400",
      accent: "red-400",
      text: "orange-700"
    },
    {
      name: "Soft Green",
      bg: "bg-[#F2FCE2]",
      primary: "green-400",
      accent: "emerald-400",
      text: "green-700"
    },
  ];

  const handleColorChange = (scheme: typeof colorSchemes[0]) => {
    setBgColor(scheme.bg);
    // Update CSS variables for the theme
    document.documentElement.style.setProperty('--primary', `var(--${scheme.primary})`);
    document.documentElement.style.setProperty('--accent', `var(--${scheme.accent})`);
    document.documentElement.style.setProperty('--text', `var(--${scheme.text})`);
    
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${scheme.name}`,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Choose Theme</h2>
      <div className="grid grid-cols-2 gap-4">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.name}
            onClick={() => handleColorChange(scheme)}
            className={`p-4 rounded-lg border transition-all ${
              bgColor === scheme.bg ? "ring-2 ring-wedding-pink" : ""
            } ${scheme.bg} hover:scale-105`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className={`text-sm font-medium text-${scheme.text}`}>
                {scheme.name}
              </span>
              <div className="flex space-x-2">
                <div className={`w-4 h-4 rounded-full bg-${scheme.primary}`} />
                <div className={`w-4 h-4 rounded-full bg-${scheme.accent}`} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};