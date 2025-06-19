'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

// Schema matching the API route and adding confirmPassword
const addUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['admin', 'editor', 'user']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Set error on confirmPassword field
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserFormProps {
  defaultRole?: 'admin' | 'editor' | 'user';
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddUserForm({
  defaultRole = 'user',
  onSuccess,
  onCancel
}: AddUserFormProps) {
  const t = useTranslations('AdminUsersPage');

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    mode: 'onTouched',
    defaultValues: {
      role: defaultRole,
    },
  });

  const onSubmit: SubmitHandler<AddUserFormValues> = async (data) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      // Use a more specific type if the expected success/error structure is known
      // For now, use unknown and type guards
      const result: unknown = await response.json();

      if (!response.ok) {
        let errorMessage = t('errorCreationFailed');

        // More robust type checking for potential error shapes
        if (typeof result === 'object' && result !== null) {
          if ('error' in result) {
             const errorValue = (result as { error: unknown }).error;
             if (typeof errorValue === 'string') {
               errorMessage = errorValue;
             } else if (typeof errorValue === 'object' && errorValue !== null && 'message' in errorValue && typeof (errorValue as { message: unknown }).message === 'string') {
               errorMessage = (errorValue as { message: string }).message;
             }
          } else if ('message' in result && typeof (result as { message: unknown }).message === 'string') {
             // Handle cases where error message is directly in result.message
             errorMessage = (result as { message: string }).message;
          }
          // Add more checks here if other error structures are possible
        }
        // Removed the complex array check as it wasn't fully correct, simplify error extraction

        throw new Error(errorMessage);
      }

      console.log('Signup successful:', result);
      reset();
      onSuccess();

    } catch (error: unknown) { // Type error as unknown
      console.error('Signup error:', error);
      let message = t('errorUnexpected');
      if (error instanceof Error) {
        message = error.message;
      }
      setServerError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="space-y-4">
       {serverError && (
        <p className="text-sm text-red-600 bg-red-100 p-3 rounded border border-red-300">
          {serverError}
        </p>
       )}

      <Input
        label={t('labelFullName')}
        id="name"
        {...register('name')}
        error={errors.name?.message}
        disabled={isLoading}
        autoComplete="name"
      />
      <Input
        label={t('labelEmail')}
        id="email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={isLoading}
         autoComplete="email"
      />
      <Input
        label={t('labelPassword')}
        id="password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        disabled={isLoading}
        autoComplete="new-password"
      />
      <Input
        label={t('labelConfirmPassword')}
        id="confirmPassword"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        autoComplete="new-password"
      />

      <div className="space-y-1">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          {...register('role')}
          disabled={isLoading}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
         <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}