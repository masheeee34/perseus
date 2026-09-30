'use client';

import React, { Suspense } from 'react';
import BoutiqueSkeleton from '../../components/BoutiqueSkeleton';
import BoutiqueContent from './BoutiqueContent';

export default function BoutiquePage() {
  return (
    <Suspense fallback={<BoutiqueSkeleton />}>
      <BoutiqueContent />
    </Suspense>
  );
}
