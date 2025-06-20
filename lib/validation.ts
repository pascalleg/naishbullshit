import { z } from "zod"

// Equipment validation
export const equipmentSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  category: z.enum(["sound", "lighting", "stage", "technical"], {
    required_error: "Category is required",
  }),
  quantity: z.number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  condition: z.enum(["excellent", "good", "fair", "poor"], {
    required_error: "Condition is required",
  }),
  last_maintenance: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),
})

// Availability validation
export const availabilitySchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  start_time: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  end_time: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  is_available: z.boolean(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
}).refine((data) => {
  const start = new Date(`2000-01-01T${data.start_time}`)
  const end = new Date(`2000-01-01T${data.end_time}`)
  return start < end
}, {
  message: "End time must be after start time",
  path: ["end_time"],
})

// Portfolio item validation
export const portfolioItemSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  image_url: z.string()
    .url("Invalid image URL")
    .min(1, "Image URL is required"),
  category: z.string()
    .min(1, "Category is required"),
  tags: z.array(z.string())
    .max(10, "Maximum 10 tags allowed"),
  featured: z.boolean(),
})

// Calendar sync validation
export const calendarSyncSchema = z.object({
  calendar_data: z.record(z.unknown()),
  last_synced: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, "Invalid timestamp format"),
})

// Maintenance schedule validation
export const maintenanceScheduleSchema = z.object({
  equipment_id: z.string().uuid(),
  scheduled_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  maintenance_type: z.enum(["routine", "repair", "inspection", "calibration"], {
    required_error: "Maintenance type is required",
  }),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
  completed: z.boolean().default(false),
})

// Equipment usage validation
export const equipmentUsageSchema = z.object({
  equipment_id: z.string().uuid(),
  start_time: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, "Invalid timestamp format"),
  end_time: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, "Invalid timestamp format"),
  event_id: z.string().uuid(),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
}).refine((data) => {
  const start = new Date(data.start_time)
  const end = new Date(data.end_time)
  return start < end
}, {
  message: "End time must be after start time",
  path: ["end_time"],
})

// Image upload validation
export const imageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed"
    ),
  alt_text: z.string()
    .min(1, "Alt text is required")
    .max(200, "Alt text must be less than 200 characters"),
})

// Export types
export type EquipmentFormData = z.infer<typeof equipmentSchema>
export type AvailabilityFormData = z.infer<typeof availabilitySchema>
export type PortfolioItemFormData = z.infer<typeof portfolioItemSchema>
export type CalendarSyncFormData = z.infer<typeof calendarSyncSchema>
export type MaintenanceScheduleFormData = z.infer<typeof maintenanceScheduleSchema>
export type EquipmentUsageFormData = z.infer<typeof equipmentUsageSchema>
export type ImageUploadFormData = z.infer<typeof imageUploadSchema> 