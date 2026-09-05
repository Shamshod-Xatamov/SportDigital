import {
  SUPER_ADMIN_CREDENTIALS,
  verifySuperAdminCredentials,
} from "@/lib/demo/auth.mjs";

export async function POST(request) {
  let credentials;

  try {
    credentials = await request.json();
  } catch {
    return Response.json(
      { error: "So‘rov formati noto‘g‘ri." },
      { status: 400 },
    );
  }

  if (
    !verifySuperAdminCredentials(credentials?.email, credentials?.password)
  ) {
    return Response.json(
      { error: "Email yoki parol noto‘g‘ri." },
      { status: 401 },
    );
  }

  return Response.json(
    { profileId: SUPER_ADMIN_CREDENTIALS.profileId },
    { headers: { "Cache-Control": "no-store" } },
  );
}
