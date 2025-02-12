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

const editDataSchema = z.object({
  firstName: z
    .string()
    .min(3, "Firstname must be at least 3 characters long")
    .max(50)
    .optional(),
  lastName: z
    .string()
    .min(3, "Lastname must be at least 3 characters long")
    .max(50)
    .optional(),
  age: z.number().min(18, "Age must be at least 18").optional(), // Optional
  about: z
    .string()
    .min(10, "About section must be at least 10 characters long")
    .max(500, "About section must be at most 500 characters")
    .optional(),
  photoUrl: z.string().url("Invalid photo URL format").optional(),
  skills: z
    .array(z.string().min(2, "Skill must have at least 2 characters"))
    .min(1, "At least one skill is required")
    .max(10, "You can add up to 10 skills")
    .optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
});

const passwordDataSchema = z.object({
  newPassword: z
    .string()
    .min(8, "New Password must be at least 8 characters long")
    .regex(/[A-Z]/, "New Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "New Password must contain at least one special character"
    ),
});

const validateSignupData = (req) => {
  return signupDataSchema.safeParse(req.body);
};

const validateLoginData = (req) => {
  return loginDataSchema.safeParse(req.body);
};

const validateEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "skills",
    "about",
    "photoUrl",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  if (!isEditAllowed) throw new Error("Can not update");
  return editDataSchema.safeParse(req.body);
};

const validatePasswordData = (req) => {
  return passwordDataSchema.safeParse({ newPassword: req.body.newPassword });
};

module.exports = { validateSignupData, validateLoginData, validateEditData,validatePasswordData };
