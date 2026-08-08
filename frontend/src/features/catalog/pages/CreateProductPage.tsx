import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
  status: z.enum(['DRAFT', 'PUBLISHED', 'OUT_OF_STOCK']).default('PUBLISHED'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const form = useForm<any>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '', description: '', price: 0, stock_quantity: 0, status: 'PUBLISHED'
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    setSubmitting(true);
    try {
      const res = await api.post('/catalog/products', {
        ...data,
        currency: 'USD',
        specifications: {}
      });
      
      const newProductId = res.data.id;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        await api.post(`/catalog/products/${newProductId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      navigate('/dashboard/supplier/products');
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to create product");
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 cursor-pointer text-xl font-bold">&larr;</button>
        <h1 className="text-3xl font-bold text-slate-900">Create New Product</h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">AVAILABLE / PUBLISHED</option>
                        <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField control={form.control} name="stock_quantity" render={({ field }) => (
                  <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <div className="space-y-2">
                <FormLabel>Product Image</FormLabel>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400">No Image</span>
                    )}
                  </div>
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs cursor-pointer" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="cursor-pointer">Cancel</Button>
                <Button type="submit" className="cursor-pointer" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
