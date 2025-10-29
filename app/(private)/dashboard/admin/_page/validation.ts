import { z } from "zod";

export const createJobSchema = z
	.object({
		id: z.union([z.number(), z.string()]).optional(),
		job_name: z.string().min(1, "Job name is required"),
		job_type: z.string().min(1, "Job type is required"),
		job_description: z.string().optional(),
		candidate_needed: z.union([z.number(), z.string()]),
		min_salary: z.union([z.number(), z.string()]),
		max_salary: z.union([z.number(), z.string()]),
		requirements: z.array(
			z.object({
				field_name: z.string(),
				requirement_type: z.enum(["mandatory", "optional", "off"]),
			}),
		),
	})
	.refine(
		(data) => {
			// if either salary is undefined -> skip this specific check (or force both present if desired)
			if (data.min_salary === undefined || data.max_salary === undefined) return true;
			return data.max_salary >= data.min_salary;
		},
		{
			path: ["max_salary"],
			message: "Maximum salary must be greater than or equal to minimum salary",
		},
	);

export type CreateJobSchema = z.infer<typeof createJobSchema>;
