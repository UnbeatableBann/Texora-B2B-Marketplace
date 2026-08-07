import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getCategories } from '../../../services/catalogService';
import api from '../../../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.coerce.number().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stock_quantity: z.coerce.number().min(0, 'Stock must be positive'),
  primary_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
  });

  useEffect(() => {
    Promise.all([
      getCategories(), 
      api.get(`/catalog/products/${id}`).then(res => res.data)
    ])
      .then(([cats, product]) => {
        setCategories(cats);
        form.reset({
          name: product.name,
          description: product.description,
          category_id: product.category?.id || 1,
          price: product.price,
          stock_quantity: product.stock_quantity,
          primary_image_url: product.primary_image_url || '',
          status: product.status,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, form]);

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      await api.patch(`/catalog/products/${id}`, data);
      navigate('/dashboard/supplier/products');
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to update product");
      setSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this product? It will no longer be visible to buyers.")) return;
    try {
      await api.delete(`/catalog/products/${id}`);
      navigate('/dashboard/supplier/products');
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to archive product");
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading product...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 cursor-pointer text-xl font-bold">&larr;</button>
          <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
        </div>
        <Button variant="destructive" onClick={handleArchive} className="cursor-pointer">Archive Product</Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* @ts-ignore */}
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                {/* @ts-ignore */}
                <FormField control={form.control} name="category_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                {/* @ts-ignore */}
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* @ts-ignore */}
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                {/* @ts-ignore */}
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                {/* @ts-ignore */}
                <FormField control={form.control} name="stock_quantity" render={({ field }) => (
                  <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              {/* @ts-ignore */}
              <FormField control={form.control} name="primary_image_url" render={({ field }) => (
                <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="pt-4 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="cursor-pointer">Cancel</Button>
                <Button type="submit" className="cursor-pointer" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
