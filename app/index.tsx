import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function Page() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
}
