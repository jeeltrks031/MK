// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { contactFormSchema } from "@/schema/contact-form.schema";
// import { type z } from "zod";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useMutation } from "@/lib/api/hooks/useApi";
// import { homeService } from "@/lib/api/services/home.service";
// import { useState, useEffect } from "react";

// type ContactFormValues = z.infer<typeof contactFormSchema>;

// interface ContactFormProps {
//   className?: string;
//   nameMode?: "split" | "full";
// }

// export default function ContactForm({ className, nameMode = "split" }: ContactFormProps) {
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const form = useForm<ContactFormValues>({
//     resolver: zodResolver(contactFormSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       phone: "",
//       email: "",
//       description: "",
//     },
//   });

//   const isSingleColumn = nameMode === "full";

//   const {
//     mutate: submitContactForm,
//     loading: isSubmitting,
//     error: apiError,
//     success: apiSuccess,
//   } = useMutation<
//     { message: string },
//     {
//       firstName: string;
//       phoneNumber: string;
//       email: string;
//       notes: string;
//     }
//   >(async (data) => {
//     return homeService.contactUs(data);
//   });

//   useEffect(() => {
//     if (apiSuccess) {
//       setSubmitSuccess(true);
//       setSubmitError(null);
//       form.reset();
//       const timer = setTimeout(() => {
//         setSubmitSuccess(false);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [apiSuccess, form]);

//   useEffect(() => {
//     if (apiError) {
//       setSubmitError(apiError);
//       setSubmitSuccess(false);
//     }
//   }, [apiError]);

//   async function handleFormSubmit(values: ContactFormValues) {
//     let firstName = values.firstName.trim();
//     let lastName = values.lastName?.trim() || "";

//     // If lastName is not provided, try to split from firstName
//     if (!lastName && firstName) {
//       const nameParts = firstName.split(/\s+/);
//       if (nameParts.length > 1) {
//         firstName = nameParts[0] || "";
//         lastName = nameParts.slice(1).join(" ") || "";
//       }
//     }

//     const payload = {
//       firstName: firstName || "",
//       phoneNumber: values.phone.trim(),
//       email: values.email.trim(),
//       notes: values.description?.trim() || "",
//     };

//     // Validate required fields
//     if (!payload.firstName || !payload.phoneNumber || !payload.email) {
//       setSubmitError("Please fill in all required fields.");
//       return;
//     }

//     try {
//       setSubmitError(null);
//       setSubmitSuccess(false);
//       await submitContactForm(payload);
//     } catch (error) {
//       console.error("Error submitting contact form:", error);
//       setSubmitError(error instanceof Error ? error.message : "Failed to submit form. Please try again.");
//     }
//   }

//   return (
//     <Form {...form}>
//       <form
//         className={className ?? "space-y-4"}
//         onSubmit={(e) => {
//           e.preventDefault();
//           form.handleSubmit(handleFormSubmit)(e);
//         }}
//       >
//         <div className="flex flex-col md:flex-col gap-4">
//           <FormField
//             control={form.control}
//             name="firstName"
//             render={({ field }) => (
//               <FormItem className="w-full relative">
//                 <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 font-normal text-black text-[13px]">
//                   First Name <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter here" {...field} className="h-12 border border-[#262626] placeholder:text-[#BABABA] placeholder:text-[16px]" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {/* <FormField
//             control={form.control}
//             name="lastName"
//             render={({ field }) => (
//               <FormItem className="w-full relative">
//                 <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 font-normal text-black text-[13px]">
//                   Last Name <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input {...field} placeholder="Enter full name" className="h-12 border border-[#262626]" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           /> */}
//         </div>

//         <div className="flex flex-col md:flex-col gap-4">
//           <FormField
//             control={form.control}
//             name="phone"
//             render={({ field }) => (
//               <FormItem className="w-full relative">
//                 <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 font-normal text-black text-[13px]">
//                   Phone Number <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input placeholder="+91 000 000 0000" {...field} className="h-12 border border-[#262626] placeholder:text-[#BABABA] placeholder:text-[16px]" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem className="w-full relative">
//                 <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 font-normal text-black text-[13px]">
//                   Email ID<span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input type="email" placeholder="Enter Email" {...field} className="h-12 border border-[#262626] placeholder:text-[#BABABA] placeholder:text-[16px]" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem className="w-full relative">
//               <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 font-normal text-black text-[13px]">
//                 Notes <span className="text-red-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Textarea rows={4} placeholder="Enter here" {...field} className="h-24 border border-[#262626] placeholder:text-[#BABABA] placeholder:text-[16px]" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {submitSuccess && (
//           <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
//             <p className="text-sm font-medium text-green-800">
//               Thank you! We&apos;ll reach out to you within 24 hours.
//             </p>
//           </div>
//         )}

//         {submitError && (
//           <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
//             <p className="text-sm font-medium text-red-800">
//               {submitError}
//             </p>
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full py-[10px] rounded-full bg-[#1C4692] text-white font-semibold text-[16px] mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isSubmitting ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </Form>
//   );
// }


"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/schema/contact-form.schema";
import { type z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@/lib/api/hooks/useApi";
import { homeService } from "@/lib/api/services/home.service";
import { useState, useEffect } from "react";

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
  nameMode?: "split" | "full";
}

export default function ContactForm({ className, nameMode = "split" }: ContactFormProps) {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      description: "",
    },
  });

  const isSingleColumn = nameMode === "full";

  const {
    mutate: submitContactForm,
    loading: isSubmitting,
    error: apiError,
    success: apiSuccess,
  } = useMutation<
    { message: string },
    {
      firstName: string;
      phoneNumber: string;
      email: string;
      notes: string;
    }
  >(async (data) => {
    return homeService.contactUs(data);
  });

  useEffect(() => {
    if (apiSuccess) {
      setSubmitSuccess(true);
      setSubmitError(null);
      form.reset();
      const timer = setTimeout(() => setSubmitSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [apiSuccess, form]);

  useEffect(() => {
    if (apiError) {
      setSubmitError(apiError);
      setSubmitSuccess(false);
    }
  }, [apiError]);

  async function handleFormSubmit(values: ContactFormValues) {
    // The phone is already transformed by Zod to 10 digits
    const payload = {
      firstName: values.firstName.trim(),
      phoneNumber: values.phone.trim(), // 10 digits only
      email: values.email.trim(),
      notes: values.description?.trim() || "",
    };

    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      await submitContactForm(payload);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit. Please try again."
      );
    }
  }

  return (
    <Form {...form}>
      <form
        className={className ?? "space-y-5"}
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 text-xs font-normal text-black">
                First Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter here"
                  {...field}
                  className="h-12 border border-[#262626] placeholder:text-[#BABABA] placeholder:text-base"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 text-xs font-normal text-black">
                Phone Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="+91 98765 43210"
                  {...field}
                  className="h-12 border border-[#262626] placeholder:text-[#BABABA] placeholder:text-base"
                  maxLength={15} // allow +91 + 10 digits + space
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 text-xs font-normal text-black">
                Email ID <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  {...field}
                  className="h-12 border border-[#262626] placeholder:text-[#BABABA] placeholder:text-base"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Notes / Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormLabel className="absolute left-3 -top-2.5 bg-white px-1 text-xs font-normal text-black">
                Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Any specific requirement or message..."
                  {...field}
                  className="border border-[#262626] placeholder:text-[#BABABA] placeholder:text-base"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        {/* Success / Error Messages */}
        {submitSuccess && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-800">
              Thank you! We’ll reach out to you within 24 hours.
            </p>
          </div>
        )}

        {submitError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-medium text-red-800">{submitError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-full bg-[#1C4692] text-white font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </Form>
  );
}