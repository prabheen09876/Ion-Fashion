// src/components/SetupAdmin.tsx
import { useEffect } from 'react';
import { createAdminUser } from '../utils/createAdmin';

export function SetupAdmin() {
  useEffect(() => {
    console.log('Setting up admin user...');
    createAdminUser();
  }, []);

  return null;
}