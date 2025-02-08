'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateUserProfile } from '@/lib/actions/user.actions'
import { updateUserProfileSchema } from '@/lib/validators'
import { UpdateUserProfile } from '@/types'

export default function ProfileForm() {
  const { data: session, update } = useSession()
  const { toast } = useToast()

  const form = useForm<UpdateUserProfile>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  })

  const onSubmit = async (values: UpdateUserProfile) => {
    const response = await updateUserProfile(values)

    if (!response.success) {
      toast({
        variant: 'destructive',
        description: response.message,
      })
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    }

    await update(newSession)

    toast({
      description: response.message,
    })
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled
                    placeholder="Email"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Name"
                    className="input-field"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  )
}
