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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Set error on confirmPassword field
  });

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserFormProps {
  role: 'formator' | 'formee';
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddUserForm({ role, onSuccess, onCancel }: AddUserFormProps) {
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
          role: role,
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

  // Translate role for the button
  const translatedRole = role === 'formator' ? t('roleFormator') : t('roleFormee');

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
       {serverError && (
        <p className="text-sm text-red-600 bg-red-100 p-3 rounded border border-red-300"> {/* Adjusted padding */}
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

      <div className="flex justify-end space-x-3 pt-4"> {/* Increased top padding */}
         <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {t('buttonCancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('buttonCreating') : `${t('buttonCreatePrefix')} ${translatedRole}`}
        </Button>
      </div>
    </form>
  );
}