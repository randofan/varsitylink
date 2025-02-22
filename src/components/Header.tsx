import Image from 'next/image';
import { Link as MuiLink } from '@mui/material';
import SignupButton from './SignupButton';

export default function Header() {
  return (
    <header className="bg-white h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div>
            <MuiLink href="/">
              <Image src="/logo.svg" alt="Logo" width={100} height={100} />
            </MuiLink>
          </div>
          <div className="p-2">
            <SignupButton />
          </div>
        </div>
      </div>
    </header>
  );
}
