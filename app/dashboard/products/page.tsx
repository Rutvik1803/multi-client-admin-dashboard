import type { Metadata } from 'next';
import { ProductsTable } from '@/components/products/products-table';
import { AddProductButton } from '@/components/products/add-product-button';
import { ProtectedRoute } from '@/components/protected-route';

export const metadata: Metadata = {
  title: 'Products | Admin Dashboard',
  description: 'Manage your products',
};

export default function ProductsPage() {
  return (
    <ProtectedRoute requiredPermissions={['products']}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <AddProductButton />
        </div>
        <ProductsTable />
      </div>
    </ProtectedRoute>
  );
}
