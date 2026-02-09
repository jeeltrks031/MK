// import * as z from "zod";

// export const contactFormSchema = z.object({
//   firstName: z.string().min(2, "First name is required"),
//   lastName: z.string().optional().or(z.literal("")),
//   phone: z.string().min(10, "Phone number is required"),
//   email: z.string().email("Invalid email"),
//   description: z.string().optional(),
// });


import * as z from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().optional().or(z.literal("")),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => {
      // Remove spaces, dashes, +91, 0 prefix, etc.
      return val.replace(/[\s\-\+]/g, "").replace(/^91|^0/, "");
    })
    .refine((val) => val.length === 10, {
      message: "Phone number must be exactly 10 digits (e.g., 9876543210)",
    })
    .refine((val) => /^\d+$/.test(val), {
      message: "Phone number must contain only digits",
    }),
  email: z.string().email("Please enter a valid email address"),
  description: z.string().optional(),
});