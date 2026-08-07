import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getCategories } from '../../../services/catalogService';

export const CategoryNav = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
      <Link
        to="/marketplace"
        className="px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap font-medium text-sm transition-colors text-slate-700"
      >
        All Products
      </Link>
      {categories.map(category => (
        <Link
          key={category.id}
          to={`/categories/${category.id}`}
          className="px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 whitespace-nowrap font-medium text-sm transition-colors text-slate-700"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
