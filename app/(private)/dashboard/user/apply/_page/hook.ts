"use client";
import client from "@/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateJobSchema } from "../../../admin/_page/validation";

interface Requirement {
	id: string | number;
	job_id: string | number;
	field_name: string;
	requirement_type: string;
	created_at: Timestamp;
}

interface Jobs extends CreateJobSchema {
	id: number | string;
	created_at: string;
}

type FieldName =
	| "full_name"
	| "photo_profile"
	| "gender"
	| "domicile"
	| "email"
	| "phone_number"
	| "linkedin_link"
	| "date_of_birth";

const zodFieldMap: Record<FieldName, any> = {
	full_name: z.string().min(1, "Nama wajib diisi"),
	photo_profile: z.string(),
	gender: z.enum(["male", "female"]),
	domicile: z.string(),
	email: z.email("Email tidak valid"),
	phone_number: z.string().regex(/^(\+62|0)\d+$/, "Nomor tidak valid"),
	linkedin_link: z.url("URL tidak valid"),
	date_of_birth: z.date(),
};

function createDynamicSchema(requirements: Requirement[]) {
	const shape: Record<string, any> = {};

	requirements.forEach((req: Requirement) => {
		if (req.requirement_type === "off") return;

		const reqName = req.field_name?.toLowerCase()?.split(" ")?.join("_") as FieldName;

		if (reqName in zodFieldMap) {
			const baseSchema = zodFieldMap[reqName];

			shape[reqName] = req.requirement_type === "mandatory" ? baseSchema : baseSchema.optional();
		} else {
			shape[reqName] =
				req.requirement_type === "mandatory"
					? z.string().min(1, `${req.field_name} wajib diisi`)
					: z.string().optional().or(z.literal(""));
		}
	});

	return z.object(shape);
}

export function useJobs({ jobId }: { jobId: string }) {
	const [requirement, setRequirement] = useState<Requirement[]>([]);
	const [job, setJob] = useState<Jobs>();
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams()?.get("jobId");

	const fetchJobs = useCallback(async () => {
		try {
			setLoading(true);
			const { data, error } = await client.from("jobs").select("*").eq("id", jobId ?? searchParams).single();

			if (error) {
				toast.error(error.message);
				return;
			}
			setJob(data ?? []);
		} catch {
			toast.error("Failed to fetch jobs");
		} finally {
			setLoading(false);
		}
	}, [jobId, searchParams]);

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			const { data, error } = await client
				.from("job_profile_requirements")
				.select("*")
				.eq("job_id", jobId ?? searchParams);

			if (error) {
				toast.error(error.message);
				return;
			}
			setRequirement(data ?? []);
		} catch (error) {
			toast.error((error as string) ?? "Failed to fetch data");
		} finally {
			setLoading(false);
		}
	}, [jobId, searchParams]);

	useEffect(() => {
		async function init() {
			Promise.all([fetchData(), fetchJobs()]);
		}

		init();
	}, [fetchData, fetchJobs]);

	const applySchema = useMemo(() => {
		return createDynamicSchema(requirement);
	}, [requirement]);

	type ApplySchema = z.infer<typeof applySchema>;

	const form = useForm<ApplySchema>({
		resolver: zodResolver(applySchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: {
			full_name: "",
			photo_profile: "",
			gender: "female",
			domicile: "",
			email: "",
			phone_number: "",
			linkedin_link: "",
			date_of_birth: "",
		},
	});

	const handleSubmit = async (data: ApplySchema) => {
		try {
			setLoading(true);
			const { error: applyError } = await client
				.from("job_applicants")
				.insert([
					{
						job_id: jobId,
						full_name: data?.full_name,
						photo_profile: data?.photo_profile,
						gender: data?.gender,
						domicile: data?.domicile,
						email: data?.email,
						phone_number: data?.phone_number,
						linkedin_link: data?.linkedin_link,
						date_of_birth: data?.date_of_birth,
					},
				])
				.select()
				.single();

			if (applyError) throw applyError.message;

			toast.success("Apply job success!");
			form.reset();
			router.back();
		} catch (err) {
			toast.error(typeof err === "string" ? err : "Failed to create job");
		} finally {
			setLoading(false);
		}
	};

	const reqType = useMemo(() => {
		return Object.fromEntries(
			requirement.map((r) => [
				r?.field_name?.toLowerCase()?.split(" ")?.join("_"),
				r.requirement_type,
			]),
		);
	}, [requirement]);

	return {
		loading,
		setLoading,
		fetchData,
		requirement,
		applySchema,
		handleSubmit,
		job,
		form,
		reqType,
		open,
		setOpen,
	};
}
