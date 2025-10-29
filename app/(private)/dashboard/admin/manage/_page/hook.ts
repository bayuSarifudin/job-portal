"use client";
import client from "@/api/client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { CreateJobSchema } from "../../_page/validation";
import { useSearchParams } from "next/navigation";

export interface Applicant {
	id: number | string;
	job_id: number | string;
	full_name: string;
	photo_profile: string;
	gender: string;
	domicile: string;
	email: string;
	phone_number: string;
	linkedin_link: string;
	date_of_birth: string;
	created_at: string;
	updated_at: string;
}

interface Jobs extends CreateJobSchema {
	id: number | string;
	created_at: string;
}

export function useApplicant({ jobId }: { jobId: string }) {
	const [loading, setLoading] = useState(false);
	const [applicant, setApplicant] = useState<Applicant[]>([]);
	const [job, setJob] = useState<Jobs>();
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

	const fetchApplicant = useCallback(async () => {
		try {
			setLoading(true);
			const { data, error } = await client
				.from("job_applicants")
				.select("*")
				.order("created_at", { ascending: false })
				.eq("job_id", jobId ?? searchParams);

			if (error) {
				toast.error(error.message);
				return;
			}
			setApplicant(data ?? []);
		} catch {
			toast.error("Failed to fetch data");
		} finally {
			setLoading(false);
		}
	}, [jobId, searchParams]);

	useEffect(() => {
		async function init() {
			Promise.all([fetchApplicant(), fetchJobs()]);
		}

		init();
	}, [fetchApplicant, fetchJobs]);

	return {
		loading,
		setLoading,
		applicant,
		fetchApplicant,
		setApplicant,
		job,
	};
}
