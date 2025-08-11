import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/auth/FirstScreen');
    }, 50); // delay 50ms

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
