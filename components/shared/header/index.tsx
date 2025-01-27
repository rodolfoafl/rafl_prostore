import Menu from '@/components/shared/header/menu';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link href='/' className='flex-start'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} logo`}
              height='48'
              width='48'
              priority
            />
            <span className='hidden font-bold text-2xl ml-3 lg:block'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
}
