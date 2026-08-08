import { useState, useEffect } from 'react';
import { submitBuyerProfile } from '../../../services/onboardingService';
import { getCategories } from '../../../services/catalogService';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const steps = [
  { id: 'business', title: 'Business Details' },
  { id: 'industry', title: 'Industry' },
  { id: 'categories', title: 'Product Categories' },
  { id: 'fabrics', title: 'Fabric Types' },
  { id: 'quantity', title: 'Order Quantity' },
  { id: 'budget', title: 'Budget Range' },
  { id: 'preferences', title: 'Preferences' }
];

export const BuyerOnboardingForm = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('buyer_onboarding_step');
    return saved ? parseInt(saved) : 0;
  });
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('buyer_onboarding_data');
    if (saved) return JSON.parse(saved);
    return {
      company_name: '',
      business_type: '',
      industry: '',
      product_categories: [] as string[],
      fabric_types: [] as string[],
      order_quantity: '',
      order_unit: 'meters',
      budget: '',
      marketplace_preferences: [] as string[]
    };
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('buyer_onboarding_data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('buyer_onboarding_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    getCategories().then(res => setCategories(res)).catch(console.error);
  }, []);

  const handleNext = async () => {
    if (currentStep === 0 && !formData.company_name) {
      setError('Company name is required');
      return;
    }
    if (currentStep === 0 && !formData.business_type) {
      setError('Select a business type');
      return;
    }
    if (currentStep === 1 && !formData.industry) {
      setError('Select an industry');
      return;
    }
    if (currentStep === 2 && formData.product_categories.length === 0) {
      setError('Select at least one product category');
      return;
    }

    if (currentStep < steps.length - 1) {
      setError('');
      setCurrentStep(prev => prev + 1);
    } else {
      setLoading(true);
      setError('');
      try {
        await submitBuyerProfile({
          company_name: formData.company_name,
          industry: formData.industry,
          preferences: {
            business_type: formData.business_type,
            product_categories: formData.product_categories,
            fabric_types: formData.fabric_types,
            order_quantity: formData.order_quantity,
            budget: formData.budget,
            marketplace_preferences: formData.marketplace_preferences
          }
        });
        localStorage.removeItem('buyer_onboarding_data');
        localStorage.removeItem('buyer_onboarding_step');
        onComplete();
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Submission failed');
        setLoading(false);
      }
    }
  };

  const OptionCard = ({ label, selected, onClick, multiple = false }: any) => (
    <div 
      onClick={onClick}
      style={{
        border: `2px solid ${selected ? 'var(--primary-color)' : 'var(--border-color)'}`,
        backgroundColor: selected ? 'rgba(0, 0, 0, 0.02)' : '#fff',
        borderRadius: '8px',
        padding: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <span style={{ fontWeight: selected ? 600 : 400, color: selected ? 'var(--primary-color)' : 'var(--fg-color)' }}>{label}</span>
      {selected && <Check size={18} color="var(--primary-color)" />}
    </div>
  );

  const toggleArray = (field: keyof typeof formData, value: string) => {
    setFormData(prev => {
      const arr = prev[field] as string[];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      }
      return { ...prev, [field]: [...arr, value] };
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Business Details</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                className="input-custom w-full"
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 mt-4">What best describes your business?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['Manufacturer', 'Garment Brand', 'Fashion Designer', 'Wholesaler', 'Retailer', 'Textile Trader', 'Interior / Home Furnishing', 'Other'].map(type => (
                  <OptionCard 
                    key={type} 
                    label={type} 
                    selected={formData.business_type === type}
                    onClick={() => setFormData({ ...formData, business_type: type })}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What industry are you buying for?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Apparel', 'Fashion', 'Home Textiles', 'Hospitality', 'Interior & Decor', 'Manufacturing', 'Retail', 'Other'].map(industry => (
                <OptionCard 
                  key={industry} 
                  label={industry} 
                  selected={formData.industry === industry}
                  onClick={() => setFormData({ ...formData, industry })}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What materials are you looking for?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {(categories.length > 0 ? categories.map(c => c.name) : ['Cotton', 'Silk', 'Linen', 'Denim', 'Jute', 'Polyester', 'Viscose', 'Other']).map(cat => (
                <OptionCard 
                  key={cat} 
                  label={cat} 
                  multiple
                  selected={formData.product_categories.includes(cat)}
                  onClick={() => toggleArray('product_categories', cat)}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What types of fabrics do you usually source?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Woven', 'Knitted', 'Printed', 'Dyed', 'Embroidered', 'Blended', 'Organic', 'Sustainable', 'Other'].map(type => (
                <OptionCard 
                  key={type} 
                  label={type} 
                  multiple
                  selected={formData.fabric_types.includes(type)}
                  onClick={() => toggleArray('fabric_types', type)}
                />
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>How much do you typically order?</h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="block text-sm font-medium mb-1">Preferred Unit</label>
              <select
                value={formData.order_unit || 'meters'}
                onChange={e => setFormData({ ...formData, order_unit: e.target.value })}
                className="input-custom w-full max-w-[200px]"
              >
                <option value="meters">Meters</option>
                <option value="kg">Kg</option>
                <option value="yards">Yards</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Under 100', '100–500', '500–1,000', '1,000–5,000', '5,000+'].map(qty => {
                const unit = formData.order_unit || 'meters';
                const label = `${qty} ${unit}`;
                return (
                  <OptionCard 
                    key={qty} 
                    label={label} 
                    selected={formData.order_quantity === qty}
                    onClick={() => setFormData({ ...formData, order_quantity: qty })}
                  />
                );
              })}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What is your typical sourcing budget?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Under ₹10,000', '₹10,000–₹50,000', '₹50,000–₹1,00,000', '₹1,00,000–₹5,00,000', '₹5,00,000+'].map(budget => (
                <OptionCard 
                  key={budget} 
                  label={budget} 
                  selected={formData.budget === budget}
                  onClick={() => setFormData({ ...formData, budget })}
                />
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Preferences</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Price sensitive', 'Premium quality', 'Sustainable materials', 'Fast delivery', 'Low MOQ', 'Verified suppliers', 'Bulk sourcing'].map(pref => (
                <OptionCard 
                  key={pref} 
                  label={pref} 
                  multiple
                  selected={formData.marketplace_preferences.includes(pref)}
                  onClick={() => toggleArray('marketplace_preferences', pref)}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)', fontWeight: 600 }}>
          Step {currentStep + 1} of {steps.length}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              style={{
                width: '30px', 
                height: '4px', 
                borderRadius: '2px', 
                backgroundColor: idx <= currentStep ? 'var(--primary-color)' : 'var(--border-color)' 
              }}
            />
          ))}
        </div>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

      <div style={{ minHeight: '350px' }}>
        {renderStep()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0 || loading}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentStep === 0 ? 0 : 1 }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete' : 'Continue'} 
          {!loading && currentStep !== steps.length - 1 && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
};
