import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isFieldRequired<T extends z.ZodRawShape>(
	schema: z.ZodObject<T>,
	fieldName: keyof T,
): boolean {
	const field = schema.shape[fieldName];
	if (!field) return false;

	// Field dianggap required kalau bukan ZodOptional dan bukan ZodDefault
	return !(field instanceof z.ZodOptional || field instanceof z.ZodDefault);
}

export async function getUserRole() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_ANON_KEY as string,
	);

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		return { role: null, error: userError?.message ?? "User not found" };
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profileError) {
		return { role: null, error: profileError.message };
	}

	return { role: profile?.role ?? null, error: null };
}

export const unionString = z.union([z.number(), z.string()]).transform(String);
export const unionNumber = z.union([z.number(), z.string()]).transform(Number);

export function formatCurrency(value: number | string | null | undefined) {
	if (value === null || value === undefined || value === "") return "";
	const numberValue =
		typeof value === "number" ? value : Number(value.toString().replace(/\D/g, ""));
	if (isNaN(numberValue)) return "";
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
		minimumFractionDigits: 0,
	}).format(numberValue);
}

export function parseCurrency(value: string) {
	if (!value) return 0;
	// Ambil semua digit dari input
	const numeric = value.replace(/\D/g, "");
	return Number(numeric);
}

export const rupiah = (number: number) => {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	}).format(number);
};

export function formatDate(
  date: Date | string | number,
  formatString: string // Format string (e.g., 'd MMMM yyyy', 'HH:mm:ss')
): string {
  // Format the date with the provided format string, locale, and timezone
  return dayjs(date)?.format(formatString);
}