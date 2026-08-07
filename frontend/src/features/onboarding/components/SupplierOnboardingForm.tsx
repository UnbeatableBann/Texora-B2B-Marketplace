import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitSupplierProfile } from '../../../services/onboardingService';
import { useState } from 'react';

const supplierSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  description: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export const SupplierOnboardingForm = ({ onComplete }: { onComplete: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema)
  });
  const [error, setError] = useState('');

  const onSubmit = async (data: SupplierFormData) => {
    try {
      await submitSupplierProfile(data);
      onComplete();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Company Name</label>
        <input
          {...register('company_name')}
          className="mt-1 block w-full rounded-md border p-2 focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="Global Textiles Ltd"
        />
        {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border p-2 focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="We manufacture high quality cotton..."
          rows={4}
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md shadow text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
      >
        Complete Onboarding
      </button>
    </form>
  );
};
