import { cookies } from 'next/headers';
import { NavbarClient } from './NavbarClient';

export async function Navbar() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('access_token');

  return <NavbarClient isLoggedIn={isLoggedIn} />;
}
