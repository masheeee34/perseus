import React from 'react';
import { PerseusCatalog } from '../../../lib/catalog';
import ProductDetailClient from '../../../components/ProductDetailClient';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Search in PerseusCatalog
  let product = PerseusCatalog.find(p => p.id === id || p.file.includes(id));
  
  if (!product) {
    const num = parseInt(id.replace(/[^0-9]/g, ''), 10);
    if (num && num <= PerseusCatalog.length && num > 0) {
      product = PerseusCatalog[num - 1];
    }
  }

  if (!product && PerseusCatalog.length > 0) {
    product = PerseusCatalog[0];
  }

  if (!product) {
    notFound();
  }

  const related = PerseusCatalog.filter(
    p => p.id !== product!.id && (p.cat === product!.cat || p.categoryAttr === product!.categoryAttr)
  ).slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
