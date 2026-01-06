import { LayoutProps } from '@/lib/layout';

import Footer from '@/components/layouts/footer';
import Navbar from '@/components/layouts/navbar';

export default function Layout({
  children,
  withFooter,
  withNavbar,
}: LayoutProps) {
  return (
    <>
      {withNavbar && <Navbar />}
      {children}
      {withFooter && <Footer />}
    </>
  );
}
