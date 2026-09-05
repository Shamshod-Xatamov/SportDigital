// Demo-only account. This project intentionally has no user database.
export const SUPER_ADMIN_CREDENTIALS = Object.freeze({
  email: "superadmin@sportdigital.uz",
  password: "SportDigital2026!",
  profileId: "super",
});

export function verifySuperAdminCredentials(email, password) {
  return (
    String(email).trim().toLowerCase() === SUPER_ADMIN_CREDENTIALS.email &&
    String(password) === SUPER_ADMIN_CREDENTIALS.password
  );
}
