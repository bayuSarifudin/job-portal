"use client";
import client from "@/api/client";
import { CreateJobSchema, createJobSchema } from "./validation";
import { useEffect, useState, useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const requirementFields = [
	"Full name",
	"Photo Profile",
	"Gender",
	"Domicile",
	"Email",
	"Phone number",
	"Linkedin link",
	"Date of birth",
];

interface Jobs extends CreateJobSchema {
	id: number | string;
	created_at: string;
}

export function useJobs() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingPage, setLoadingPage] = useState(false);
	const [jobs, setJobs] = useState<Jobs[]>([]);

	const form = useForm<CreateJobSchema>({
		resolver: zodResolver(createJobSchema),
		defaultValues: {
			job_name: "",
			job_type: "",
			job_description: "",
			candidate_needed: 0,
			min_salary: 0,
			max_salary: 0,
			requirements: requirementFields.map((f) => ({
				field_name: f,
				requirement_type: "mandatory" as const,
			})),
		},
		mode: "onSubmit",
		reValidateMode: "onChange",
	});

	const { fields } = useFieldArray({
		control: form.control,
		name: "requirements",
	});

	const fetchJobs = useCallback(async () => {
		setLoadingPage(true);

		const { data, error } = await client
			.from("jobs")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			toast.error(error.message);
			setLoadingPage(false);
			return;
		}

		setJobs((prev) => [...data!]);
		setLoadingPage(false);
	}, []);

	useEffect(() => {
		fetchJobs();
	}, [fetchJobs]);

	const handleSubmit = async (data: CreateJobSchema) => {
		try {
			setLoading(true);
			const { data: job, error: jobError } = await client
				.from("jobs")
				.insert([
					{
						job_name: data.job_name,
						job_type: data.job_type,
						job_description: data.job_description,
						candidate_needed: data.candidate_needed,
						min_salary: data.min_salary,
						max_salary: data.max_salary,
					},
				])
				.select()
				.single();

			if (jobError) throw jobError.message;

			const { error: reqError } = await client.from("job_profile_requirements").insert(
				data.requirements.map((req) => ({
					job_id: job.id,
					field_name: req.field_name,
					requirement_type: req.requirement_type,
				})),
			);

			if (reqError) throw reqError.message;

			toast.success("Job created successfully!");

			form.reset();
			setOpen(false);
			await new Promise((res) => setTimeout(res, 1000));
			await fetchJobs();
		} catch (err) {
			toast.error(typeof err === "string" ? err : "Failed to create job");
		} finally {
      setLoading(false)
    }
	};

	const statusClass = {
		active: "text-success-main border border-success-border bg-success-surface",
		inactive: "text-danger-main border border-danger-border bg-danger-surface",
		draft: "text-secondary-main border border-secondary-border bg-secondary-surface",
	};

	return {
		fields,
		handleSubmit,
		loading,
		open,
		setOpen,
		form,
		jobs,
		statusClass,
		fetchJobs,
		loadingPage,
		setLoadingPage,
	};
}
