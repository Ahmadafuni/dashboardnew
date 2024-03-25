import { z } from "zod";

export const templateSizeSchema = z.object({
  TemplateId:  z.string().min(1, {message: "Please select a Template!",}),
  SizeId:  z.string().min(1, {message: "Please select a Size!",}),
  TemplateSizeType: z.enum(["CUTTING", "DRESSUP"], {required_error: "You need to select a template size type.",}),
  Description: z.string(),
});

