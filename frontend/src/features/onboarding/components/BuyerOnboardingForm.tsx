import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitBuyerProfile } from '../../../services/onboardingService';
import { useState } from 'react';

const buyerSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  industry: z.string().optional(),
});

type BuyerFormData = z.infer<typeof buyerSchema>;

export const BuyerOnboardingForm = ({ onComplete }: { onComplete: () => void }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema)
  });
  const [error, setError] = useState('');

  const onSubmit = async (data: BuyerFormData) => {
    try {
      await submitBuyerProfile(data);
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
          className="mt-1 block w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Acme Corp"
        />
        {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Industry</label>
        <input
          {...register('industry')}
          className="mt-1 block w-full rounded-md border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Fashion Retail"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md shadow text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        Complete Onboarding
      </button>
    </form>
  );
};
