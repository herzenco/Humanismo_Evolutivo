import {getLearningCourses} from '@/lib/courses/server';
import { learningAccess } from '@/lib/learning/server';
import { studentAttendance } from '@/lib/attendance/server';
import { getEducationContext } from "@/lib/education/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { resourceArticles } from "@/data/resources";
import PortalDashboard from "@/components/portal/PortalDashboard";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEmailAccountClaims } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portal educativo",
  description: "Biblioteca privada de Humanismo Evolutivo.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

function getFriendlyFirstName(claims: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const storedFirstName = claims.user_metadata?.first_name;

  if (typeof storedFirstName === "string" && storedFirstName.trim()) {
    return storedFirstName.trim().slice(0, 60);
  }

  const emailName = claims.email?.split("@")[0]?.trim();
  return emailName || "estudiante";
}

export default async function PortalPage() {
  if (!isSupabaseConfigured) {
    redirect("/auth?next=/portal");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !isEmailAccountClaims(data?.claims)) {
    redirect("/auth?next=/portal");
  }

  const claims = data.claims;
  const firstName = getFriendlyFirstName(claims);

  const [educationContext, progress, attendance, courses] = await Promise.all([getEducationContext(), learningAccess('summary'), studentAttendance(), getLearningCourses()]);

  return <PortalDashboard courses={courses} firstName={firstName} email={claims.email} articles={resourceArticles} educationContext={educationContext} studentProgress={progress.error ? null : progress.data as Record<string,number>} attendance={attendance} rolePreviewEnabled={process.env.VERCEL_GIT_COMMIT_REF === 'qa' || (process.env.NODE_ENV === 'development' && process.env.PORTAL_ROLE_PREVIEW === 'true')} />;
}
