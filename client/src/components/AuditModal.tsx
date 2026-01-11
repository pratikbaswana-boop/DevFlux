import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAuditRequestSchema } from "@shared/schema";
import { type InsertAuditRequest } from "@shared/routes";
import { useCreateAuditRequest } from "@/hooks/use-audit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, ArrowRight, Sparkles } from "lucide-react";

interface AuditModalProps {
  children: React.ReactNode;
}

export function AuditModal({ children }: AuditModalProps) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateAuditRequest();

  const form = useForm<InsertAuditRequest>({
    resolver: zodResolver(insertAuditRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      teamSize: 0,
      currentSpend: "",
      challenges: "",
    },
  });

  function onSubmit(data: InsertAuditRequest) {
    mutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border-white/10 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Book Your Free AI Audit
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Get a comprehensive analysis of your AI spend and a roadmap to 90%
            success rates.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@company.com" className="bg-white/5 border-white/10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        className="bg-white/5 border-white/10" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentSpend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Monthly Spend (Est.)</FormLabel>
                    <FormControl>
                      <Input placeholder="$5,000" className="bg-white/5 border-white/10" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top Challenge</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Low adoption, high costs, confusing tools..." 
                      className="bg-white/5 border-white/10 min-h-[80px]"
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold py-6 shadow-lg shadow-primary/25"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get My Audit <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
