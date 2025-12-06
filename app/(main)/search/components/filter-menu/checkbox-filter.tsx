'use client'

import * as React from 'react'
import { SearchIcon } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type FilterItem = {
  id: string
  name: string
}

type CheckboxFilterProps = {
  items: FilterItem[]
  showSearch?: boolean
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  className?: string
}

export function CheckboxFilter({
  items,
  showSearch = true,
  selectedIds,
  onSelectionChange,
  className 
}: CheckboxFilterProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const selectedIdSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCheckboxChange = (itemId: string, checked: boolean | 'indeterminate') => {
    if (checked === 'indeterminate') return;

    const newSelectedIds = new Set(selectedIdSet);

    if (checked) {
      newSelectedIds.add(itemId);
    } else {
      newSelectedIds.delete(itemId);
    }

    onSelectionChange(Array.from(newSelectedIds));
  }

  return (
    <div className={cn('flex flex-col gap-3 rounded-lg border p-3', className)}>
      {showSearch && (
        <div className="relative">
          <InputGroup>
            <InputGroupInput 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon className="size-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}

      <ScrollArea className="h-48">
        <div className="flex flex-col gap-3 p-1">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <Checkbox 
                id={item.id} 
                onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)} 
                checked={selectedIdSet.has(item.id)}
              />
              <Label htmlFor={item.id} className="flex cursor-pointer items-center gap-2 text-sm font-normal">
                {item.name}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}