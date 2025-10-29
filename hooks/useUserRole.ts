"use client";

import client from "@/api/client";
import { useEffect, useState } from "react";

interface UserRoleResult {
	role: string | null;
	loading: boolean;
	error: string | null;
}

export function useUserRole(): UserRoleResult {
	const [role, setRole] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUserRole() {
			try {
				const {
					data: { user },
					error: userError,
				} = await client.auth.getUser();
				if (userError) throw userError;
				if (!user) {
					setRole(null);
					setLoading(false);
					return;
				}

				const { data: profile, error: profileError } = await client
					.from("profiles")
					.select("role")
					.eq("id", user.id)
					.single();

				if (profileError) throw profileError;

				setRole(profile?.role ?? null);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		fetchUserRole();
	}, []);

	return { role, loading, error };
}
