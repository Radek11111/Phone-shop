import * as z from "zod";

export const shippingSchema = z.object({
  name: z.string().min(1, "Imię i nazwisko są wymagane"),
  street: z.string().min(1, "Ulica jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
  postalCode: z.string().min(1, "Kod pocztowy jest wymagany"),
  country: z.string().min(1, "Kraj jest wymagany"),
  state: z.string().nullish(),
  phoneNumber: z.string().nullish(),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;
