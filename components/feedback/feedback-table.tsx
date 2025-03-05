'use client';

import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  MoreHorizontal,
  Search,
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

// Sample data
const initialFeedback = [
  {
    id: 'FEED-1001',
    product: 'Premium Headphones',
    customer: 'Sarah Johnson',
    rating: 5,
    feedback:
      'These headphones have incredible sound quality and the noise cancellation is top-notch!',
    date: '2023-10-10',
    visible: true,
  },
  {
    id: 'FEED-1002',
    product: 'Fitness Tracker',
    customer: 'Michael Chen',
    rating: 4,
    feedback: 'Great fitness tracker, but battery life could be better.',
    date: '2023-10-09',
    visible: true,
  },
  {
    id: 'FEED-1003',
    product: 'Bluetooth Speaker',
    customer: 'Jessica Williams',
    rating: 3,
    feedback:
      'Good sound for the price, but connectivity is occasionally an issue.',
    date: '2023-10-08',
    visible: false,
  },
  {
    id: 'FEED-1004',
    product: 'Smart Watch',
    customer: 'David Rodriguez',
    rating: 5,
    feedback:
      'The smartwatch exceeded my expectations! The interface is intuitive and responsive.',
    date: '2023-10-07',
    visible: true,
  },
  {
    id: 'FEED-1005',
    product: 'Wireless Earbuds',
    customer: 'Emily Thompson',
    rating: 2,
    feedback: 'Disappointing battery life and uncomfortable fit.',
    date: '2023-10-06',
    visible: false,
  },
  {
    id: 'FEED-1006',
    product: 'Digital Camera',
    customer: 'James Wilson',
    rating: 4,
    feedback:
      'Excellent image quality, though the menu system could be more user-friendly.',
    date: '2023-10-05',
    visible: true,
  },
  {
    id: 'FEED-1007',
    product: 'Gaming Console',
    customer: 'Olivia Martin',
    rating: 5,
    feedback:
      'Amazing gaming experience with fast load times and stunning graphics.',
    date: '2023-10-04',
    visible: true,
  },
  {
    id: 'FEED-1008',
    product: 'Coffee Maker',
    customer: 'Ryan Davis',
    rating: 3,
    feedback:
      'Makes good coffee but is quite noisy and takes up a lot of counter space.',
    date: '2023-10-03',
    visible: false,
  },
];

export function FeedbackTable() {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Sort function
  const sortedFeedback = [...feedback].sort((a, b) => {
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
  const filteredFeedback = sortedFeedback.filter((item) => {
    const searchableFields =
      `${item.product} ${item.customer} ${item.feedback} ${item.id}`.toLowerCase();
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
    if (selectedItems.length === filteredFeedback.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFeedback.map((item) => item.id));
    }
  };

  // Toggle visibility
  const toggleVisibility = (id: string) => {
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    );
  };

  // Toggle visibility for all selected items
  const toggleVisibilityForSelected = (visible: boolean) => {
    setFeedback((prev) =>
      prev.map((item) =>
        selectedItems.includes(item.id) ? { ...item, visible } : item
      )
    );
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
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} selected
              </span>
            </>
          )}
        </div>
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
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
                    filteredFeedback.length > 0 &&
                    selectedItems.length === filteredFeedback.length
                  }
                  onCheckedChange={toggleAllSelection}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  {sortConfig?.key === 'id' && (
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
                className="cursor-pointer"
                onClick={() => requestSort('product')}
              >
                <div className="flex items-center space-x-1">
                  <span>Product</span>
                  {sortConfig?.key === 'product' && (
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
                onClick={() => requestSort('customer')}
              >
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  {sortConfig?.key === 'customer' && (
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
                className="cursor-pointer"
                onClick={() => requestSort('rating')}
              >
                <div className="flex items-center space-x-1">
                  <span>Rating</span>
                  {sortConfig?.key === 'rating' && (
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
              <TableHead className="hidden lg:table-cell">Feedback</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => requestSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {sortConfig?.key === 'date' && (
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
            {filteredFeedback.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  No feedback found
                </TableCell>
              </TableRow>
            ) : (
              filteredFeedback.map((item) => (
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
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.customer}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className="text-amber-500">
                          {index < item.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-[300px] truncate lg:table-cell">
                    {item.feedback}
                  </TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete feedback
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
    </div>
  );
}
