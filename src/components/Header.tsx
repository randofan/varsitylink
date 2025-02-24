import Image from 'next/image';
import Link from 'next/link';
import SignupButton from './SignupButton';

export default function Header() {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
      <Link href="/">
        <Image 
          src="/logo.svg" 
          alt="Logo" 
          width={200} 
          height={50}
          style={{
        width: 'clamp(120px, 20vw, 200px)',
        height: 'auto'
          }}
        />
      </Link>
      <SignupButton />
    </header>
  );
}
