import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
}

export const NavigationButtons = ({
  onPrevious,
  onNext,
  isNextDisabled,
  isLastStep,
}: NavigationButtonsProps) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hideBack = searchParams.get('hideBack') === 'true';

  if (hideBack) {
    return (
      <div className="fixed bottom-0 left-0 right-0">
        <Button
          variant="ghost"
          size="lg"
          onClick={onNext}
          disabled={isNextDisabled}
          className="w-full rounded-none h-16 bg-wedding-pink hover:bg-wedding-pink/90 text-white"
        >
          {isLastStep ? "CREATE" : "NEXT"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 grid grid-cols-2 divide-x">
      <Button
        variant="ghost"
        size="lg"
        onClick={onPrevious}
        className="rounded-none h-16 bg-[#A5C9C5] hover:bg-[#94b8b4] text-white"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        PREVIOUS
      </Button>
      <Button
        variant="ghost"
        size="lg"
        onClick={onNext}
        disabled={isNextDisabled}
        className="rounded-none h-16 bg-wedding-pink hover:bg-wedding-pink/90 text-white"
      >
        {isLastStep ? "CREATE" : "NEXT"}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};