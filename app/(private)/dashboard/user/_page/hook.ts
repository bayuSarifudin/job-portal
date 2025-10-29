"use client";
import client from "@/api/client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { CreateJobSchema } from "../../admin/_page/validation";

interface Jobs extends CreateJobSchema {
	id: number | string;
	created_at: string;
}

export function useJobs() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingPage, setLoadingPage] = useState(false);
	const [jobs, setJobs] = useState<Jobs[]>([]);
  const [jobId, setJobId] = useState<string | number>('')

	const fetchJobs = useCallback(async () => {
		try {
			setLoadingPage(true);
			const { data, error } = await client
				.from("jobs")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) {
				toast.error(error.message);
				return;
			}
      setJobId(data?.at(0)?.id)
			setJobs(data ?? []);
		} catch {
			toast.error("Failed to fetch jobs");
		} finally {
			setLoadingPage(false);
		}
	}, []);

	useEffect(() => {
		fetchJobs();
	}, [fetchJobs]);

	return {
		loading,
		loadingPage,
		setLoading,
		setLoadingPage,
		open,
		setOpen,
		jobs,
		fetchJobs,
    jobId,
    setJobId
	};
}