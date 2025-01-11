import { getSession } from "@/lib/actions";
import { LogoutButton } from "./logout-button";
import { LoginButton } from "./login-button";

export async function UserIcon() {
  const session = await getSession();

  if (session.isValid) return <LogoutButton />;

  if (!session.isValid) return <LoginButton />;
}
