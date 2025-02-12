const { z } = require("zod");

const signupDataSchema = z.object({
  firstName: z
    .string()
    .min(3, "Firstname must be at least 3 characters long")
    .max(50),
  lastName: z
    .string()
    .min(3, "Lastname must be at least 3 characters long")
    .max(50),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

const loginDataSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const validateSignupData = (req) => {
  return signupDataSchema.safeParse(req.body);
};

const validateLoginData = (req) => {
  return loginDataSchema.safeParse(req.body);
};

module.exports = { validateSignupData, validateLoginData };
