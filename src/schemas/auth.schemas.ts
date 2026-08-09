import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Inserisci l’email.")
    .email("Inserisci un indirizzo email valido.")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Inserisci la password."),
});

export const registrationFieldsSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "Inserisci il nome.")
      .max(255, "Il nome è troppo lungo."),
    last_name: z
      .string()
      .trim()
      .min(1, "Inserisci il cognome.")
      .max(255, "Il cognome è troppo lungo."),
    email: z
      .string()
      .trim()
      .min(1, "Inserisci l’email.")
      .email("Inserisci un indirizzo email valido.")
      .transform((value) => value.toLowerCase()),
    phone: z
      .string()
      .trim()
      .min(1, "Inserisci il numero di telefono.")
      .regex(
        /^\+?[0-9\s()-]{6,30}$/,
        "Inserisci un numero di telefono valido.",
      ),
    password: z
      .string()
      .min(6, "La password deve contenere almeno 6 caratteri."),
    password_confirmation: z.string().min(1, "Ripeti la password."),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Le password non coincidono.",
    path: ["password_confirmation"],
  });

type CheckEmailAvailability = (email: string) => Promise<boolean>;

export function createRegistrationSchema(
  checkEmailAvailability: CheckEmailAvailability,
) {
  return registrationFieldsSchema.refine(
    async ({ email }) => checkEmailAvailability(email),
    {
      message: "Questa email è già registrata.",
      path: ["email"],
    },
  );
}

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegistrationPayload = z.infer<typeof registrationFieldsSchema>;

export type LoginFieldErrors = Partial<Record<keyof LoginPayload, string>>;
export type RegistrationFieldErrors = Partial<
  Record<keyof RegistrationPayload, string>
>;
