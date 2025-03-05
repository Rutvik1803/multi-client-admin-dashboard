'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

// Sample data
const initialProducts = [
  {
    id: 'PROD-1001',
    name: 'Premium Headphones',
    category: 'Audio',
    price: 199.99,
    stock: 45,
    image: '/placeholder.svg?height=100&width=100',
    visible: true,
  },
  {
    id: 'PROD-1002',
    name: 'Fitness Tracker',
    category: 'Wearables',
    price: 89.99,
    stock: 28,
    image: '/placeholder.svg?height=100&width=100',
    visible: true,
  },
  {
    id: 'PROD-1003',
    name: 'Portable Bluetooth Speaker',
    category: 'Audio',
    price: 79.99,
    stock: 52,
    image: '/placeholder.svg?height=100&width=100',
    visible: false,
  },
  {
    id: 'PROD-1004',
    name: 'Ultra Smart Watch',
    category: 'Wearables',
    price: 249.99,
    stock: 17,
    image: '/placeholder.svg?height=100&width=100',
    visible: true,
  },
  {
    id: 'PROD-1005',
    name: 'Wireless Earbuds',
    category: 'Audio',
    price: 129.99,
    stock: 64,
    image: '/placeholder.svg?height=100&width=100',
    visible: false,
  },
  {
    id: 'PROD-1006',
    name: 'Digital Camera',
    category: 'Photography',
    price: 499.99,
    stock: 8,
    image: '/placeholder.svg?height=100&width=100',
    visible: true,
  },
  {
    id: 'PROD-1007',
    name: 'Gaming Console',
    category: 'Gaming',
    price: 399.99,
    stock: 12,
    image: '/placeholder.svg?height=100&width=100',
    visible: true,
  },
  {
    id: 'PROD-1008',
    name: 'Smart Home Hub',
    category: 'Smart Home',
    price: 149.99,
    stock: 31,
    image: '/placeholder.svg?height=100&width=100',
    visible: true,
  },
];

export function ProductsTable() {
  const { toast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Sort function
  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;

    if (
      a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (
      a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]
    ) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter function
  const filteredProducts = sortedProducts.filter((item) => {
    const searchableFields =
      `${item.name} ${item.category} ${item.id}`.toLowerCase();
    return searchableFields.includes(searchQuery.toLowerCase());
  });

  // Toggle sort
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Toggle item selection
  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all items selection
  const toggleAllSelection = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map((item) => item.id));
    }
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  // Toggle visibility for all selected items
  const toggleVisibilityForSelected = (visible: boolean) => {
    setProducts((prev) =>
      prev.map((item) =>
        selectedItems.includes(item.id) ? { ...item, visible } : item
      )
    );
  };

  // Delete product
  const deleteProduct = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((item) => item.id !== productToDelete));
      setProductToDelete(null);
      toast({
        title: 'Product deleted',
        description: 'The product has been removed successfully.',
      });
    }
    setDeleteDialogOpen(false);
  };

  // Delete selected products
  const deleteSelectedProducts = () => {
    setProducts((prev) =>
      prev.filter((item) => !selectedItems.includes(item.id))
    );
    setSelectedItems([]);
    toast({
      title: 'Products deleted',
      description: `${selectedItems.length} products have been removed successfully.`,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleVisibilityForSelected(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Make Visible
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleVisibilityForSelected(false)}
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Hide
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedItems.length})
              </Button>
            </>
          )}
        </div>
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    filteredProducts.length > 0 &&
                    selectedItems.length === filteredProducts.length
                  }
                  onCheckedChange={toggleAllSelection}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Name</span>
                  {sortConfig?.key === 'name' && (
                    <span>
                      {sortConfig.direction === 'ascending' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="hidden cursor-pointer md:table-cell"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  {sortConfig?.key === 'category' && (
                    <span>
                      {sortConfig.direction === 'ascending' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Price</span>
                  {sortConfig?.key === 'price' && (
                    <span>
                      {sortConfig.direction === 'ascending' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right"
                onClick={() => requestSort('stock')}
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Stock</span>
                  {sortConfig?.key === 'stock' && (
                    <span>
                      {sortConfig.direction === 'ascending' ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="hidden w-[100px] md:table-cell">
                Status
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(item.visible ? '' : 'bg-muted/50')}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItemSelection(item.id)}
                      aria-label={`Select ${item.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      width={64}
                      height={64}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.category}
                  </TableCell>
                  <TableCell className="text-right">
                    ${item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={item.stock > 20 ? 'outline' : 'secondary'}
                      className={item.stock <= 10 ? 'bg-destructive' : ''}
                    >
                      {item.stock} in stock
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={item.visible ? 'default' : 'outline'}
                      className={item.visible ? 'bg-green-500' : ''}
                    >
                      {item.visible ? 'Visible' : 'Hidden'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => toggleVisibility(item.id)}
                        >
                          {item.visible ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Hide from website
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Show on website
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteConfirmation(item.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {productToDelete
                ? 'Are you sure you want to delete this product?'
                : `Are you sure you want to delete ${selectedItems.length} products?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              {productToDelete
                ? ' the product'
                : ` ${selectedItems.length} products`}{' '}
              from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (productToDelete) {
                  deleteProduct();
                } else {
                  deleteSelectedProducts();
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
