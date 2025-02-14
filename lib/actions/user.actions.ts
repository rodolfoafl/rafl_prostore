'use server'

import { Prisma } from '@prisma/client'
import { hashSync } from 'bcrypt-ts-edge'
import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

import { auth, signIn, signOut } from '@/auth'
import { prisma } from '@/db/prisma'
import { PAGINATION_PAGE_SIZE } from '@/lib/constants'
import { formatError } from '@/lib/utils'
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from '@/lib/validators'
import { PaymentMethod, ShippingAddress, UpdateUserFormSchema } from '@/types'

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', user)

    return {
      success: true,
      message: 'Signed in successfully',
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return {
      success: false,
      message: 'Invalid email or password',
    }
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: '/' })
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    })

    const plainPassword = user.password
    user.password = hashSync(user.password, 10)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    })

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    })

    return {
      success: true,
      message: 'User registered successfully',
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) throw new Error('User not found')

  return user
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth()
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    })

    if (!user) throw new Error('User not found')

    const address = shippingAddressSchema.parse(data)

    await prisma.user.update({
      where: { id: user.id },
      data: { address },
    })

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updateUserPaymentMethod(data: PaymentMethod) {
  try {
    const session = await auth()
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    })

    if (!user) throw new Error('User not found')

    const paymentMethod = paymentMethodSchema.parse(data)

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: { paymentMethod: paymentMethod.type },
    })

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updateUserProfile(user: { name: string; email: string }) {
  try {
    const session = await auth()
    const currentUser = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    })

    if (!currentUser) throw new Error('User not found')

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { name: user.name },
    })

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getAllUsers({
  limit = PAGINATION_PAGE_SIZE,
  page,
  query,
}: {
  limit?: number
  page: number
  query: string
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {}

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: (page - 1) * limit,
  })

  const dataCount = await prisma.user.count({
    where: {
      ...queryFilter,
    },
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

export async function deleteUser(id: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!existingUser) throw new Error('User not found')

    await prisma.user.delete({
      where: {
        id,
      },
    })

    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updateUser(user: UpdateUserFormSchema) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!existingUser) throw new Error('User not found')

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        role: user.role,
      },
    })

    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
