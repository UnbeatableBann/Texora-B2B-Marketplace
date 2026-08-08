import { useState, useEffect } from 'react';
import { submitSupplierProfile } from '../../../services/onboardingService';
import { getCategories } from '../../../services/catalogService';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useAuthStore } from '../../auth/useAuthStore';

const steps = [
  { id: 'business', title: 'Business Details' },
  { id: 'contact', title: 'Contact Info' },
  { id: 'address', title: 'Address' },
  { id: 'hours', title: 'Operating Hours' },
  { id: 'categories', title: 'Categories' },
  { id: 'fabrics', title: 'Fabric Types' },
  { id: 'moq', title: 'MOQ' },
  { id: 'additional', title: 'Additional' }
];

export const SupplierOnboardingForm = ({ onComplete }: { onComplete: () => void }) => {
  const user = useAuthStore(state => state.user);
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('supplier_onboarding_step');
    return saved ? parseInt(saved) : 0;
  });
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('supplier_onboarding_data');
    if (saved) return JSON.parse(saved);
    return {
      company_name: '',
      business_type: '',
      contact_person: user?.full_name || '',
      phone: '',
      business_email: user?.email || '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India',
      opening_time: '09:00',
      closing_time: '18:00',
      working_days: 'Monday to Friday',
      product_categories: [] as string[],
      fabric_types: [] as string[],
      moq_quantity: '',
      moq_unit: 'meters',
      description: '',
      years_in_business: '',
      certifications: '',
      manufacturing_capability: '',
      customization_available: 'Yes',
      sample_availability: 'Yes'
    };
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('supplier_onboarding_data', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('supplier_onboarding_step', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    getCategories().then(res => setCategories(res)).catch(console.error);
  }, []);

  const handleNext = async () => {
    if (currentStep === 0 && (!formData.company_name || !formData.business_type)) {
      setError('Please provide company name and select business type');
      return;
    }
    if (currentStep === 1 && !formData.phone) {
      setError('Phone number is required');
      return;
    }
    if (currentStep === 2 && (!formData.address || !formData.city)) {
      setError('Address and City are required');
      return;
    }
    if (currentStep === 4 && formData.product_categories.length === 0) {
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
        await submitSupplierProfile({
          company_name: formData.company_name,
          description: formData.description,
          capabilities: {
            business_type: formData.business_type,
            contact: {
              person: formData.contact_person,
              phone: formData.phone,
              email: formData.business_email
            },
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postal_code,
              country: formData.country
            },
            operating_hours: {
              open: formData.opening_time,
              close: formData.closing_time,
              days: formData.working_days
            },
            product_categories: formData.product_categories,
            fabric_types: formData.fabric_types,
            moq: `${formData.moq_quantity} ${formData.moq_unit}`,
            additional: {
              years: formData.years_in_business,
              certifications: formData.certifications,
              manufacturing_capability: formData.manufacturing_capability,
              customization_available: formData.customization_available,
              sample_availability: formData.sample_availability
            }
          }
        });
        localStorage.removeItem('supplier_onboarding_data');
        localStorage.removeItem('supplier_onboarding_step');
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
        padding: '0.75rem 1rem',
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
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                className="input-custom w-full"
                placeholder="Global Textiles Ltd"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 mt-4">Business Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['Manufacturer', 'Textile Mill', 'Wholesaler', 'Distributor', 'Trading Company', 'Supplier', 'Other'].map(type => (
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Contact Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Person</label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                className="input-custom w-full"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="input-custom w-full"
                placeholder="+91 9876543210"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Business Email</label>
              <input
                type="email"
                value={formData.business_email}
                onChange={e => setFormData({ ...formData, business_email: e.target.value })}
                className="input-custom w-full"
                disabled
              />
              <span className="text-xs text-gray-500 mt-1">Verified during authentication.</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Business Address</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="input-custom w-full"
                placeholder="123 Textile Zone"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="input-custom w-full"
                  placeholder="Surat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="input-custom w-full"
                  placeholder="Gujarat"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={e => setFormData({ ...formData, postal_code: e.target.value })}
                  className="input-custom w-full"
                  placeholder="395002"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="input-custom w-full"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Operating Hours</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Opening Time</label>
                <input
                  type="time"
                  value={formData.opening_time}
                  onChange={e => setFormData({ ...formData, opening_time: e.target.value })}
                  className="input-custom w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Closing Time</label>
                <input
                  type="time"
                  value={formData.closing_time}
                  onChange={e => setFormData({ ...formData, closing_time: e.target.value })}
                  className="input-custom w-full"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Working Days</label>
              <input
                type="text"
                value={formData.working_days}
                onChange={e => setFormData({ ...formData, working_days: e.target.value })}
                className="input-custom w-full"
                placeholder="Monday to Saturday"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What do you sell?</h2>
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
      case 5:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>What types of fabrics do you offer?</h2>
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
      case 6:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Minimum Order Quantity</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  value={formData.moq_quantity}
                  onChange={e => setFormData({ ...formData, moq_quantity: e.target.value })}
                  className="input-custom w-full"
                  placeholder="100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  value={formData.moq_unit}
                  onChange={e => setFormData({ ...formData, moq_unit: e.target.value })}
                  className="input-custom w-full"
                >
                  <option value="meters">Meters</option>
                  <option value="kg">Kg</option>
                  <option value="yards">Yards</option>
                  <option value="pieces">Pieces</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Additional Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1">About Your Business</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="input-custom w-full"
                placeholder="Brief description of your manufacturing capabilities..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Years in Business</label>
                <input
                  type="number"
                  value={formData.years_in_business}
                  onChange={e => setFormData({ ...formData, years_in_business: e.target.value })}
                  className="input-custom w-full"
                  placeholder="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Certifications</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                  className="input-custom w-full"
                  placeholder="ISO 9001, GOTS"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Manufacturing Capability</label>
              <input
                type="text"
                value={formData.manufacturing_capability}
                onChange={e => setFormData({ ...formData, manufacturing_capability: e.target.value })}
                className="input-custom w-full"
                placeholder="E.g., 50,000 meters per month"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Customization</label>
                <select
                  value={formData.customization_available}
                  onChange={e => setFormData({ ...formData, customization_available: e.target.value })}
                  className="input-custom w-full"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sample Availability</label>
                <select
                  value={formData.sample_availability}
                  onChange={e => setFormData({ ...formData, sample_availability: e.target.value })}
                  className="input-custom w-full"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
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
        <div style={{ display: 'flex', gap: '4px', flex: 1, marginLeft: '2rem' }}>
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              style={{
                flex: 1,
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
