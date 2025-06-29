import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateInterview } from "@/hooks/use-interviews";
import { useCandidates } from "@/hooks/use-candidates";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@shared/schema";

const scheduleInterviewSchema = z.object({
  candidateId: z.number().min(1, "Please select a candidate"),
  type: z.enum(["Phone", "Video", "In-Person", "Technical"]),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  duration: z.number().min(15).max(480),
  interviewer: z.string().min(1, "Interviewer name is required"),
  notes: z.string().optional(),
});

type ScheduleInterviewData = z.infer<typeof scheduleInterviewSchema>;

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCandidate?: Candidate;
}

// Generate time slots for the day (9 AM to 6 PM in 30-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 17 && minute > 0) break; // Stop at 5:30 PM
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      slots.push({ value: time, label: displayTime });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  preselectedCandidate,
}: ScheduleInterviewModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();
  
  // Get Phase 2 candidates for the dropdown
  const { data: phase2Candidates = [] } = useCandidates(2);
  
  // Filter to only show qualified candidates (not rejected)
  const qualifiedCandidates = phase2Candidates.filter(
    candidate => !['Rejected'].includes(candidate.status)
  );

  const createInterview = useCreateInterview();

  const form = useForm<ScheduleInterviewData>({
    resolver: zodResolver(scheduleInterviewSchema),
    defaultValues: {
      candidateId: preselectedCandidate?.id || 0,
      type: "Video",
      duration: 60,
      interviewer: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ScheduleInterviewData) => {
    try {
      // Combine date and time into a single datetime
      const [hours, minutes] = data.time.split(':').map(Number);
      const scheduledDate = new Date(data.date);
      scheduledDate.setHours(hours, minutes, 0, 0);

      const interviewData = {
        candidateId: data.candidateId,
        type: data.type,
        scheduledDate,
        duration: data.duration,
        interviewer: data.interviewer,
        status: "Scheduled" as const,
        notes: data.notes || null,
        rating: null,
      };

      await createInterview.mutateAsync(interviewData);
      
      toast({
        title: "Interview Scheduled",
        description: `Interview scheduled successfully for ${format(scheduledDate, 'PPP p')}`,
      });
      
      form.reset();
      setSelectedDate(undefined);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule interview. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedDate(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Schedule an interview with a qualified Phase 2 candidate
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Candidate Selection */}
            <FormField
              control={form.control}
              name="candidateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={!!preselectedCandidate}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualifiedCandidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id.toString()}>
                            {candidate.firstName} {candidate.lastName} - {candidate.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interview Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Type *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Phone">Phone Interview</SelectItem>
                        <SelectItem value="Video">Video Interview</SelectItem>
                        <SelectItem value="In-Person">In-Person Interview</SelectItem>
                        <SelectItem value="Technical">Technical Interview</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Interview Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setSelectedDate(date);
                        }}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interview Time *</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time">
                          {field.value && (
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {timeSlots.find(slot => slot.value === field.value)?.label}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {slot.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes) *</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value.toString()} 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interviewer */}
            <FormField
              control={form.control}
              name="interviewer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interviewer *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter interviewer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any special instructions or notes for the interview..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleClose} type="button">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createInterview.isPending}
                className="min-w-[120px]"
              >
                {createInterview.isPending ? "Scheduling..." : "Schedule Interview"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}