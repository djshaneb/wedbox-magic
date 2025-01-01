import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateSelectionProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const DateSelection = ({ date, onDateChange }: DateSelectionProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 md:space-y-10 flex-1">
      <div className="relative">
        <CalendarIcon className="w-24 h-24 md:w-32 md:h-32 text-wedding-pink mb-4 md:mb-6" />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal border-2 h-12 md:h-14 text-lg hover:border-wedding-pink/50"
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-wedding-pink" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
            disabled={(date) => date < new Date()}
            className="rounded-lg border-2"
          />
        </PopoverContent>
      </Popover>

      <p className="text-muted-foreground text-center italic text-sm">
        Don't worry, you can always change the date later!
      </p>
    </div>
  );
};