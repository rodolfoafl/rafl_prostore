/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form'
import slugify from 'slugify'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { PRODUCT_DEFAULT_VALUES } from '@/lib/constants'
import { UploadButton } from '@/lib/uploadthing'
import { capitalizeText } from '@/lib/utils'
import { insertProductSchema, updateProductSchema } from '@/lib/validators'
import { Product } from '@/types'

export type ProductFormProps = {
  type: 'create' | 'update'
  product?: Product
  productId?: string
}

export default function ProductForm({
  type,
  product,
  productId,
}: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<Product>({
    resolver:
      type === 'update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'update' ? product : PRODUCT_DEFAULT_VALUES,
  })

  const handleClickGenerate = () => {
    const name = form.getValues('name')
    form.setValue('slug', slugify(name, { lower: true }))
  }

  const onSubmit: SubmitHandler<Product> = async (values) => {
    if (type === 'create') {
      const response = await createProduct(values)

      toast({
        variant: response.success ? 'default' : 'destructive',
        description: response.message,
      })

      if (response.success) {
        router.push('/admin/products')
      }
    }

    if (type === 'update') {
      if (!productId) {
        return router.push('/admin/products')
      }

      const response = await updateProduct({ ...values, id: productId })

      toast({
        variant: response.success ? 'default' : 'destructive',
        description: response.message,
      })

      if (response.success) {
        router.push('/admin/products')
      }
    }
  }

  const images = form.watch('images')

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<Product, 'name'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* SLUG */}
          <FormField
            control={form.control}
            name="slug"
            render={({
              field,
            }: {
              field: ControllerRenderProps<Product, 'slug'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative space-y-2">
                    <Input placeholder="Enter slug" {...field} />
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      disabled={form.getValues('name').length === 0}
                      onClick={handleClickGenerate}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* CATEGORY */}
          <FormField
            control={form.control}
            name="category"
            render={({
              field,
            }: {
              field: ControllerRenderProps<Product, 'category'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* BRAND */}
          <FormField
            control={form.control}
            name="brand"
            render={({
              field,
            }: {
              field: ControllerRenderProps<Product, 'brand'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product brand" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* PRICE */}
          <FormField
            control={form.control}
            name="price"
            render={({
              field,
            }: {
              field: ControllerRenderProps<Product, 'price'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* STOCK */}
          <FormField
            control={form.control}
            name="stock"
            render={({
              field,
            }: {
              field: ControllerRenderProps<Product, 'stock'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product stock"
                    {...field}
                    type="number"
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col gap-5 md:flex-row">
          {/* IMAGES */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="mt-2 min-h-48 space-y-2">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="Product image"
                          className="size-20 rounded-sm object-cover object-center"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(
                            response: { url: string }[],
                          ) => {
                            form.setValue('images', [
                              ...images,
                              response[0].url,
                            ])
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `Error: ${error.message}`,
                            })
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">{/* IS FEATURED */}</div>
        <div>
          {/* DESCRIPTION */}
          <FormField
            control={form.control}
            name="description"
            render={({
              field,
            }: {
              field: ControllerRenderProps<Product, 'description'>
            }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
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
            {form.formState.isSubmitting
              ? 'Submitting...'
              : `${capitalizeText(type)} Product`}
          </Button>
        </div>
      </form>
    </Form>
  )
}
