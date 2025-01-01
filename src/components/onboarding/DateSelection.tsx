import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Pencil } from "lucide-react";
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
    <div className="flex flex-col items-center space-y-8">
      <div className="relative">
        <CalendarIcon className="w-32 h-32 text-wedding-pink mb-4" />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[280px] justify-start text-left font-normal border-2 h-14"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
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
          />
        </PopoverContent>
      </Popover>

      <p className="text-muted-foreground text-center italic">
        Don't worry, you can always change the date later!
      </p>
    </div>
  );
};