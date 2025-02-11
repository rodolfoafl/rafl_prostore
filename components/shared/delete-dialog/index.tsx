'use client'

import { AlertDialog } from '@radix-ui/react-alert-dialog'
import { useState, useTransition } from 'react'

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function DeleteDialog({
  id,
  action,
}: {
  id: string
  action: (id: string) => Promise<{ success: boolean; message: string }>
}) {
  const [openState, setOpenState] = useState(false)
  const [isPendingState, startTransition] = useTransition()
  const { toast } = useToast()

  const handleDeleteClick = () => {
    startTransition(async () => {
      const response = await action(id)
      if (!response.success) {
        toast({
          variant: 'destructive',
          description: response.message,
        })
      } else {
        setOpenState(false)
        toast({
          description: response.message,
        })
      }
    })
  }

  return (
    <AlertDialog open={openState} onOpenChange={setOpenState}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" className="ml-2">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9 rounded-md px-3">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPendingState}
            onClick={handleDeleteClick}
          >
            {isPendingState ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
