import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCandidate, useUpdateCandidate } from "@/hooks/use-candidates";
import { useToast } from "@/hooks/use-toast";
import type { Candidate } from "@/lib/types";

const candidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  source: z.enum(["LinkedIn", "Indeed", "Referral", "Website"]),
  phase: z.number().min(1).max(2),
  status: z.string().min(1, "Status is required"),
  skills: z.string().optional(),
  experience: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate;
  mode: "create" | "edit";
}

const phase1Statuses = ["New", "Screened", "Phone Interview", "Rejected"];
const phase2Statuses = ["Technical Interview", "Final Interview", "Offer Extended", "Hired"];

export default function CandidateModal({
  isOpen,
  onClose,
  candidate,
  mode,
}: CandidateModalProps) {
  const { toast } = useToast();
  const createCandidate = useCreateCandidate();
  const updateCandidate = useUpdateCandidate();
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      position: "",
      source: "LinkedIn",
      phase: 1,
      status: "New",
      skills: "",
      experience: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (candidate && mode === "edit") {
      form.reset({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone || "",
        position: candidate.position,
        source: candidate.source as "LinkedIn" | "Indeed" | "Referral" | "Website",
        phase: candidate.phase,
        status: candidate.status,
        skills: candidate.skills || "",
        experience: candidate.experience || 0,
        notes: candidate.notes || "",
      });
      setSelectedPhase(candidate.phase);
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        source: "LinkedIn",
        phase: 1,
        status: "New",
        skills: "",
        experience: 0,
        notes: "",
      });
      setSelectedPhase(1);
    }
  }, [candidate, mode, form]);

  const onSubmit = async (data: CandidateFormData) => {
    try {
      if (mode === "create") {
        await createCandidate.mutateAsync(data);
        toast({
          title: "Success",
          description: "Candidate created successfully",
        });
      } else if (candidate) {
        await updateCandidate.mutateAsync({ ...data, id: candidate.id });
        toast({
          title: "Success",
          description: "Candidate updated successfully",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save candidate",
        variant: "destructive",
      });
    }
  };

  const handlePhaseChange = (phase: string) => {
    const phaseNumber = parseInt(phase);
    setSelectedPhase(phaseNumber);
    form.setValue("phase", phaseNumber);
    // Reset status when phase changes
    form.setValue("status", phaseNumber === 1 ? "New" : "Technical Interview");
  };

  const availableStatuses = selectedPhase === 1 ? phase1Statuses : phase2Statuses;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Candidate" : "Edit Candidate"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Enter the candidate details to add them to your pipeline."
              : "Update the candidate information below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Indeed">Indeed</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Website">Website</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase</FormLabel>
                    <Select 
                      onValueChange={handlePhaseChange} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Phase 1</SelectItem>
                        <SelectItem value="2">Phase 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience (years)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="3" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="React, TypeScript, Node.js" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about the candidate..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCandidate.isPending || updateCandidate.isPending}
              >
                {mode === "create" ? "Add Candidate" : "Update Candidate"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
