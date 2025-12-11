"use client";

import { useActionState, useEffect, startTransition } from "react"; // 1. Import startTransition
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, User, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateSellerAction } from "@/app/actions/team";
import { TeamMember } from "@/components/columns-team";

const sellerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

type SellerFormValues = z.infer<typeof sellerSchema>;

interface EditSellerFormProps {
  user: TeamMember;
  onSuccess: () => void;
}

export default function EditSellerForm({ user, onSuccess }: EditSellerFormProps) {
  const [state, formAction, isPending] = useActionState(updateSellerAction, null);
  
  const form = useForm<SellerFormValues>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      firstName: user.userProfile?.firstName || "",
      lastName: user.userProfile?.lastName || "",
    },
  });

  // Handle Server Action Response
  useEffect(() => {
    if (state?.error) {
      toast.error("Error", { description: state.error });
    }
    if (state?.success) {
      toast.success("Success", { description: state.message });
      onSuccess(); 
    }
  }, [state, onSuccess]);

  const onSubmit = (data: SellerFormValues) => {
    const formData = new FormData();
    formData.append("userUuid", user.userUuid); 
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("status", user.status); 
    
    // 2. Wrap formAction in startTransition
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="John" className="pl-9" {...field} />
                  </div>
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
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Doe" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#139ED3] hover:bg-[#0f87b3]" 
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}