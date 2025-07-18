// src/components/SetupAdmin.tsx
import { useEffect, useState } from 'react';
import { createAdminUser } from '../utils/createAdmin';

export function SetupAdmin() {
  const [setupAttempted, setSetupAttempted] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    const setupAdmin = async () => {
      try {
        console.log('Setting up admin user...');
        const result = await createAdminUser();
        
        if (result.error) {
          console.error('Error in SetupAdmin:', result.error);
          setSetupError(result.error.message || 'Unknown error setting up admin');
        } else {
          console.log('Admin setup completed successfully');
        }
      } catch (error) {
        console.error('Unexpected error in SetupAdmin:', error);
        setSetupError(error instanceof Error ? error.message : 'Unexpected error setting up admin');
      } finally {
        setSetupAttempted(true);
      }
    };

    if (!setupAttempted) {
      setupAdmin();
    }
  }, [setupAttempted]);

  // Only render debug info in development
  if (import.meta.env.DEV && setupError) {
    return (
      <div className="fixed bottom-0 right-0 bg-red-100 p-2 text-xs text-red-800 max-w-xs z-50">
        Admin setup error: {setupError}
      </div>
    );
  }

  return null;
}