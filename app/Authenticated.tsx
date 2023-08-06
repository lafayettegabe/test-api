import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from './contexts/store';

export function AuthCheck<P>(WrappedComponent: any) {
  return function SubscriptionWrapper(props: P) {
    const router = useRouter();
    const { userId } = useGlobalContext();

    type DataType = {
      email: string;
      credits: string;
    }

    useEffect(() => {
      if (userId === '' || userId === null) {
        console.log('No userId found, redirecting to login page...');
        router.push('/login');
      }
    }, [router, userId]);

    if (userId === '' || userId === null) {
        console.log('userId:', userId);
        return null;
    }

    console.log('User found, rendering component...');
    return <WrappedComponent {...props} />;
  };
}