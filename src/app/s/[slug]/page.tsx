'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useShortenLink } from '@/hooks/useShortenLink';

import Loading from '@/components/Loading';

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { getShortenLinkBySlug } = useShortenLink();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirectLikeMagic = async () => {
      if (params.slug) {
        const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        const link = await getShortenLinkBySlug(slug);

        if (link) {
          window.location.href = link.original_link;
        } else {
          setError(true);
        }
      }
    };

    redirectLikeMagic();
  }, [params.slug, getShortenLinkBySlug, router]);

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800'>Link Invalid</h1>
          <p className='mt-2 text-gray-600'>
            Maaf, link yang Anda tuju tidak ditemukan.
          </p>
        </div>
      </div>
    );
  }

  return <Loading />;
}
