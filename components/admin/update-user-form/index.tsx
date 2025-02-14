'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { ControllerRenderProps, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { updateUser } from '@/lib/actions/user.actions'
import { USER_ROLES } from '@/lib/constants'
import { capitalizeText } from '@/lib/utils'
import { updateUserSchema } from '@/lib/validators'
import { UpdateUserFormSchema } from '@/types'

export default function UpdateUserForm({
  user,
}: {
  user: UpdateUserFormSchema
}) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<UpdateUserFormSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  })

  const onSubmit = async (values: UpdateUserFormSchema) => {
    const response = await updateUser({ ...values, id: user.id })

    toast({
      variant: response.success ? 'default' : 'destructive',
      description: response.message,
    })

    if (response.success) {
      router.push('/admin/users')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<UpdateUserFormSchema, 'email'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<UpdateUserFormSchema, 'name'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<UpdateUserFormSchema, 'role'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {capitalizeText(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            size="lg"
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
