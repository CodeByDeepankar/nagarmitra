import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database, Issue } from "@repo/lib/types";

type RouteContext = {
  params: {
    id: string;
  };
};

function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase service credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const updates: Partial<Issue> = await request.json();
    const supabase = createServiceClient();

    const { data, error } = await (supabase as any)
      .from("issues")
      .update(updates)
      .eq("id", context.params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error updating issue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
