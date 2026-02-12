import { LayoutProps } from '@/lib/layout';

import Footer from '@/components/layouts/footer';
import Navbar from '@/components/layouts/navbar';

export default function Layout({
  children,
  withFooter,
  withNavbar,
}: LayoutProps) {
  return (
    <div className='flex min-h-screen flex-col justify-between'>
      {withNavbar && <Navbar />}
      <div className='flex-1'>{children}</div>
      {withFooter && <Footer />}
    </div>
  );
}
