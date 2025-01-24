import { Loader } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Loader size={150} className='animate-spin' />
    </div>
  );
}
