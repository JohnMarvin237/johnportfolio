'use client';
// components/admin/LogoutButton.tsx
// Calls the logout endpoint (which clears the HttpOnly cookie) then redirects.
import axios from 'axios';
import Button from '@/components/ui/Button';

export default function LogoutButton() {
  async function handleLogout() {
    await axios.post('/api/auth/logout', null, { withCredentials: true }).catch(() => {
      // Even if the request fails, proceed to login — the user wants out.
    });
    window.location.href = '/admin/login';
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Déconnexion
    </Button>
  );
}
