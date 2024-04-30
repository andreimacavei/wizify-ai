"use client"

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { VerticalEllipsis } from '@/app/ui/icons'
import { DeleteDialog } from '@/app/ui'
import { useState } from 'react'

export default function ContextMenuButton(
  { id,
    deleteDialogTitle,
    deleteDialogDescription,
    remove,
    keyEnabled,
    keyStatusToggle
  }
    : {
      id: number | string,
      deleteDialogTitle: string,
      deleteDialogDescription: string,
      remove: (id: number | string) => Promise<boolean>
      keyEnabled?: boolean
      keyStatusToggle: (id: number | string, status: string) => void
      
    }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const toggleStatus = (id: number | string) => {
    if (keyEnabled !== undefined) {
      let status = keyEnabled ? "enabled" : "disabled";
      keyStatusToggle(id, status)
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div className="h-full rounded p-1 transition-all duration-75 hover:bg-gray-100 active:bg-gray-200" aria-haspopup="dialog" aria-expanded="true" aria-controls="radix-:rcv:" data-state="open">
          <span className="sr-only">Options</span>
          <VerticalEllipsis className='fill-gray-500' />
        </div>
      </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end" className="w-60 p-4 animate-fade-in rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
      {/* <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100"
        onSelect={() => {}}>
        Show Details
      </DropdownMenu.Item> */}
        {keyStatusToggle &&
          <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100"
            onSelect={() => toggleStatus(id)}>
            {keyEnabled ? "Disable": "Enable"}
          </DropdownMenu.Item>}
        <DeleteDialog id={id} open={deleteDialogOpen} setOpen={setDeleteDialogOpen} remove={remove}
          dialogTitle={deleteDialogTitle} dialogDescription={deleteDialogDescription} 
          trigger={( <DropdownMenu.Item className="block cursor-pointer p-2 text-sm text-gray-700 hover:bg-gray-100"
          onSelect={(e) => { e.preventDefault(); setDeleteDialogOpen(true) }}
          >
          Delete
        </DropdownMenu.Item>
      )} />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  )
}
