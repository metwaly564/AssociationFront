import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, Wallet, Building, Copy, CheckCircle, X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { publicApi } from '../../lib/api';
import * as LucideIcons from 'lucide-react';

// Icon mapping
const iconMap: Record<string, any> = {
  CreditCard,
  Wallet,
  Building,
  Copy,
  CheckCircle,
};

const getIcon = (iconName?: string, defaultIcon: any = CreditCard) => {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
};

type Card = {
  id: string;
  title: string;
  description: string;
  image: string;
};

function CardsSection({ 
  title, 
  cards, 
  onDonateClick 
}: { 
  title: string; 
  cards: Card[]; 
  onDonateClick: (productId: string, donationType: string, suggestedAmount?: number, minAmount?: number) => void;
}) {
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-right">{title}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card: any) => (
          <div key={card.id} className="bg-white rounded-xl overflow-hidden shadow border">
            <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
            <div className="p-5 text-right">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{card.description}</p>
              {card.suggested_amount && (
                <p className="text-sm text-emerald-600 font-semibold mb-2">
                  المبلغ المقترح: {parseFloat(card.suggested_amount).toLocaleString('ar-SA')} ر.س
                </p>
              )}
              {card.min_amount && (
                <p className="text-xs text-gray-500 mb-2">
                  الحد الأدنى: {parseFloat(card.min_amount).toLocaleString('ar-SA')} ر.س
                </p>
              )}
              <div className="flex items-center gap-2 mb-4" dir="rtl">
                <input
                  type="number"
                  min={card.min_amount || 1}
                  placeholder="أدخل المبلغ"
                  value={amounts[card.id] ?? ''}
                  onChange={(e) => setAmounts((prev) => ({ ...prev, [card.id]: e.target.value }))}
                  className="flex-1 border rounded-lg px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    try {
                      const amount = amounts[card.id];
                      const minAmount = card.min_amount ? parseFloat(card.min_amount.toString()) : 1;
                      const suggestedAmount = card.suggested_amount ? parseFloat(card.suggested_amount.toString()) : undefined;
                      
                      // إذا لم يدخل المستخدم مبلغاً، استخدم المبلغ المقترح أو الحد الأدنى
                      let finalAmount = amount;
                      if (!amount || amount.toString().trim() === '') {
                        if (suggestedAmount && suggestedAmount >= minAmount) {
                          finalAmount = suggestedAmount.toString();
                        } else {
                          finalAmount = minAmount.toString();
                        }
                      }
                      
                      const enteredAmount = finalAmount ? parseFloat(finalAmount.toString()) : minAmount;
                      
                      console.log('Donate button clicked:', { 
                        amount: finalAmount, 
                        enteredAmount, 
                        minAmount,
                        suggestedAmount,
                        cardId: card.id,
                        cardType: card.donation_type 
                      });
                      
                      if (isNaN(enteredAmount) || enteredAmount <= 0) {
                        alert('حدث خطأ في المبلغ');
                        return;
                      }
                      
                      if (enteredAmount < minAmount) {
                        alert(`الرجاء إدخال مبلغ أكبر من أو يساوي الحد الأدنى (${minAmount.toLocaleString('ar-SA')} ر.س)`);
                        return;
                      }
                      
                      console.log('Calling onDonateClick with:', {
                        productId: card.id,
                        donationType: card.donation_type,
                        suggestedAmount: card.suggested_amount,
                        minAmount: card.min_amount
                      });
                      
                      onDonateClick(card.id, card.donation_type, suggestedAmount, minAmount);
                    } catch (error: any) {
                      console.error('Error in donate button:', error);
                      alert('حدث خطأ: ' + error.message);
                    }
                  }}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  type="button"
                >
                  تبرع
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Donate() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroTitle, setHeroTitle] = useState('التبرع');
  const [heroSubtitle, setHeroSubtitle] = useState('ساهم في صنع الفرق');
  const [introText, setIntroText] = useState('');
  const [productsTitle, setProductsTitle] = useState('منتجات التبرع');
  const [zakatTitle, setZakatTitle] = useState('الزكاة');
  const [dailyCharityTitle, setDailyCharityTitle] = useState('الصدقة اليومية');
  const [programsTitle, setProgramsTitle] = useState('دعم البرامج والمشاريع');
  const [endowmentsTitle, setEndowmentsTitle] = useState('الأوقاف الخيرية');
  const [giftsTitle, setGiftsTitle] = useState('الإهداءات الوقفية');
  const [methodsTitle, setMethodsTitle] = useState('طرق التبرع');
  const [methodsDescription, setMethodsDescription] = useState('يمكنك التبرع من خلال أي من الطرق التالية');
  const [donationMethods, setDonationMethods] = useState<any[]>([]);
  const [donationProducts, setDonationProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Donation modal state
  const [donationModalVisible, setDonationModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Amount, 2: Donor Info, 3: Payment Method
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [selectedMethodId, setSelectedMethodId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadDonateData();
  }, []);

  const loadDonateData = async () => {
    try {
      setLoading(true);
      
      // Load page content and methods
      const donateData = await publicApi.getDonate();
      
      if (donateData.content) {
        const heroTitleSection = donateData.content.find((c: any) => c.section_key === 'hero_title');
        if (heroTitleSection) {
          setHeroTitle(heroTitleSection.title || 'التبرع');
        }
        
        const heroSubtitleSection = donateData.content.find((c: any) => c.section_key === 'hero_subtitle');
        if (heroSubtitleSection) {
          setHeroSubtitle(heroSubtitleSection.description || '');
        }
        
        const introSection = donateData.content.find((c: any) => c.section_key === 'intro_text');
        if (introSection) {
          setIntroText(introSection.description || '');
        }
        
        const productsTitleSection = donateData.content.find((c: any) => c.section_key === 'products_title');
        if (productsTitleSection) {
          setProductsTitle(productsTitleSection.title || 'منتجات التبرع');
        }
        
        const zakatTitleSection = donateData.content.find((c: any) => c.section_key === 'zakat_title');
        if (zakatTitleSection) {
          setZakatTitle(zakatTitleSection.title || 'الزكاة');
        }
        
        const dailyCharityTitleSection = donateData.content.find((c: any) => c.section_key === 'daily_charity_title');
        if (dailyCharityTitleSection) {
          setDailyCharityTitle(dailyCharityTitleSection.title || 'الصدقة اليومية');
        }
        
        const programsTitleSection = donateData.content.find((c: any) => c.section_key === 'programs_title');
        if (programsTitleSection) {
          setProgramsTitle(programsTitleSection.title || 'دعم البرامج والمشاريع');
        }
        
        const endowmentsTitleSection = donateData.content.find((c: any) => c.section_key === 'endowments_title');
        if (endowmentsTitleSection) {
          setEndowmentsTitle(endowmentsTitleSection.title || 'الأوقاف الخيرية');
        }
        
        const giftsTitleSection = donateData.content.find((c: any) => c.section_key === 'gifts_title');
        if (giftsTitleSection) {
          setGiftsTitle(giftsTitleSection.title || 'الإهداءات الوقفية');
        }
        
        const methodsTitleSection = donateData.content.find((c: any) => c.section_key === 'methods_title');
        if (methodsTitleSection) {
          setMethodsTitle(methodsTitleSection.title || 'طرق التبرع');
        }
        
        const methodsDescSection = donateData.content.find((c: any) => c.section_key === 'methods_description');
        if (methodsDescSection) {
          setMethodsDescription(methodsDescSection.description || '');
        }
      }
      
      setDonationMethods(donateData.methods || []);
      
      // Load donation products
      try {
        const productsData = await publicApi.getDonationProducts();
        setDonationProducts(productsData || []);
      } catch (error) {
        console.error('Error loading donation products:', error);
      }
      
      // Set default hero images if no images from content
      if (heroImages.length === 0) {
        setHeroImages([
          'https://cdn.salla.sa/form-builder/dsDqnDlnYnVeZi06EjH08JRsC2HfDilhwXJcNJcd.png',
          'https://cdn.salla.sa/form-builder/dsDqnDlnYnVeZi06EjH08JRsC2HfDilhwXJcNJcd.png',
          'https://cdn.salla.sa/form-builder/dsDqnDlnYnVeZi06EjH08JRsC2HfDilhwXJcNJcd.png',
        ]);
      }
    } catch (error) {
      console.error('Error loading donate data:', error);
      // Set default images
      setHeroImages([
        'https://cdn.salla.sa/form-builder/dsDqnDlnYnVeZi06EjH08JRsC2HfDilhwXJcNJcd.png',
        'https://cdn.salla.sa/form-builder/dsDqnDlnYnVeZi06EjH08JRsC2HfDilhwXJcNJcd.png',
        'https://cdn.salla.sa/form-builder/dsDqnDlnYnVeZi06EjH08JRsC2HfDilhwXJcNJcd.png',
      ]);
    } finally {
      setLoading(false);
    }
  };

  const next = () => setCurrentSlide((s) => (s + 1) % heroImages.length);
  const prev = () => setCurrentSlide((s) => (s - 1 + heroImages.length) % heroImages.length);

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Group products by donation_type
  const productsByType = donationProducts.reduce((acc: any, product: any) => {
    if (!acc[product.donation_type]) {
      acc[product.donation_type] = [];
    }
    acc[product.donation_type].push(product);
    return acc;
  }, {});

  // Convert products to cards format
  const getCardsForType = (type: string): any[] => {
    const products = productsByType[type] || [];
    return products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image_url || 'https://images.unsplash.com/photo-1519309621146-2a47d1f710f3?q=80&w=1200&auto=format&fit=crop',
      donation_type: product.donation_type,
      suggested_amount: product.suggested_amount ? parseFloat(product.suggested_amount) : undefined,
      min_amount: product.min_amount ? parseFloat(product.min_amount) : 1,
    }));
  };

  const handleDonateClick = (productId: string, donationType: string, suggestedAmount?: number, minAmount?: number) => {
    try {
      console.log('handleDonateClick called:', { productId, donationType, suggestedAmount, minAmount });
      const product = donationProducts.find((p: any) => p.id === productId);
      console.log('Found product:', product);
      console.log('All products:', donationProducts);
      
      if (!product) {
        console.error('Product not found:', productId);
        alert('حدث خطأ: المنتج غير موجود');
        return;
      }
      
      const selectedProductData = { 
        id: productId, 
        donation_type: donationType, 
        suggested_amount: suggestedAmount, 
        min_amount: minAmount || 1, 
        ...product 
      };
      
      console.log('Setting selected product:', selectedProductData);
      
      setSelectedProduct(selectedProductData);
      setDonationAmount(suggestedAmount?.toString() || minAmount?.toString() || '');
      setCurrentStep(1);
      setSubmitSuccess(false);
      
      console.log('About to show modal...');
      setDonationModalVisible(true);
      
      console.log('Modal should be visible now, donationModalVisible:', true);
    } catch (error: any) {
      console.error('Error in handleDonateClick:', error);
      alert('حدث خطأ: ' + error.message);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate amount
      const amount = parseFloat(donationAmount);
      const minAmount = selectedProduct?.min_amount || 1;
      if (!donationAmount || amount < minAmount) {
        alert(`الرجاء إدخال مبلغ صحيح (الحد الأدنى: ${minAmount} ر.س)`);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate donor info
      if (!donorInfo.name.trim()) {
        alert('الرجاء إدخال اسم المتبرع');
        return;
      }
      if (!donorInfo.email && !donorInfo.phone) {
        alert('الرجاء إدخال البريد الإلكتروني أو رقم الجوال');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitDonation = async () => {
    if (!selectedMethodId) {
      alert('الرجاء اختيار طريقة التبرع');
      return;
    }

    try {
      setSubmitting(true);
      const result = await publicApi.submitDonation({
        donation_type: selectedProduct.donation_type,
        product_id: selectedProduct.id,
        donor_name: donorInfo.name,
        donor_email: donorInfo.email || undefined,
        donor_phone: donorInfo.phone || undefined,
        amount: parseFloat(donationAmount),
        donation_method_id: selectedMethodId,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setDonationModalVisible(false);
        setCurrentStep(1);
        setDonationAmount('');
        setDonorInfo({ name: '', email: '', phone: '' });
        setSelectedMethodId('');
        setSelectedProduct(null);
        setSubmitSuccess(false);
      }, 3000);
    } catch (error: any) {
      alert('فشل إرسال التبرع: ' + (error.message || 'حدث خطأ'));
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    if (!submitting) {
      setDonationModalVisible(false);
      setCurrentStep(1);
      setDonationAmount('');
      setDonorInfo({ name: '', email: '', phone: '' });
      setSelectedMethodId('');
      setSelectedProduct(null);
      setSubmitSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white" dir="rtl">
      {/* Hero Slider */}
      {heroImages.length > 0 && (
        <section className="relative w-full h-[320px] md:h-[440px] lg:h-[520px] overflow-hidden">
          {heroImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`شريحة ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                i === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
          <div className="absolute inset-0 flex items-center justify-center flex-col text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{heroTitle}</h1>
            {heroSubtitle && (
              <p className="text-xl md:text-2xl text-center max-w-2xl">{heroSubtitle}</p>
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <button onClick={prev} className="p-2 rounded-full bg-white/80 hover:bg-white">
              <ChevronRight className="w-6 h-6" />
            </button>
            <button onClick={next} className="p-2 rounded-full bg-white/80 hover:bg-white">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </section>
      )}

      {/* Intro Text */}
      {introText && (
        <section className="container mx-auto px-4 py-8">
          <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto text-center">
            {introText}
          </p>
        </section>
      )}

      {/* Products */}
      {getCardsForType('product').length > 0 && (
        <CardsSection title={productsTitle} cards={getCardsForType('product')} onDonateClick={handleDonateClick} />
      )}

      {/* Zakat */}
      {getCardsForType('zakat').length > 0 && (
        <CardsSection title={zakatTitle} cards={getCardsForType('zakat')} onDonateClick={handleDonateClick} />
      )}

      {/* Daily Charity */}
      {getCardsForType('sadaqa').length > 0 && (
        <CardsSection title={dailyCharityTitle} cards={getCardsForType('sadaqa')} onDonateClick={handleDonateClick} />
      )}

      {/* Support Programs and Projects */}
      {getCardsForType('support').length > 0 && (
        <CardsSection title={programsTitle} cards={getCardsForType('support')} onDonateClick={handleDonateClick} />
      )}

      {/* Endowments */}
      {getCardsForType('waqf').length > 0 && (
        <CardsSection title={endowmentsTitle} cards={getCardsForType('waqf')} onDonateClick={handleDonateClick} />
      )}

      {/* Endowment Gifts */}
      {getCardsForType('giftWaqf').length > 0 && (
        <CardsSection title={giftsTitle} cards={getCardsForType('giftWaqf')} onDonateClick={handleDonateClick} />
      )}

      {/* Donation Methods */}
      {donationMethods.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{methodsTitle}</h2>
              {methodsDescription && (
                <p className="text-gray-600">{methodsDescription}</p>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donationMethods.map((method) => {
                const IconComponent = getIcon(method.icon_name, CreditCard);
                return (
                  <div key={method.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{method.name}</h3>
                    </div>
                    {method.description && (
                      <p className="text-gray-600 mb-4">{method.description}</p>
                    )}
                    {method.account_number && (
                      <div className="mb-2">
                        <label className="text-sm text-gray-500">رقم الحساب:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                            {method.account_number}
                          </code>
                          <button
                            onClick={() => copyToClipboard(method.account_number, `account-${method.id}`)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="نسخ"
                          >
                            {copiedField === `account-${method.id}` ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    {method.iban && (
                      <div className="mb-2">
                        <label className="text-sm text-gray-500">IBAN:</label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                            {method.iban}
                          </code>
                          <button
                            onClick={() => copyToClipboard(method.iban, `iban-${method.id}`)}
                            className="p-2 hover:bg-gray-100 rounded"
                            title="نسخ"
                          >
                            {copiedField === `iban-${method.id}` ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Copy className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    {method.account_name && (
                      <p className="text-sm text-gray-600 mt-2">اسم الحساب: {method.account_name}</p>
                    )}
                    {method.bank_name && (
                      <p className="text-sm text-gray-600">البنك: {method.bank_name}</p>
                    )}
                    {method.qr_code_url && (
                      <div className="mt-4">
                        <img src={method.qr_code_url} alt="QR Code" className="w-32 h-32 mx-auto" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Donation Modal */}
      {donationModalVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {submitSuccess ? 'تم إرسال التبرع بنجاح!' : 'إتمام التبرع'}
              </h2>
              {!submitting && (
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Content */}
            {submitSuccess ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">شكراً لك!</h3>
                <p className="text-gray-600 mb-4">
                  تم إرسال طلب التبرع بنجاح. سنتواصل معك قريباً لإتمام عملية التبرع.
                </p>
                <p className="text-sm text-gray-500">
                  رقم الطلب: {selectedProduct?.id?.substring(0, 8)}...
                </p>
              </div>
            ) : (
              <div className="p-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          currentStep >= step
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-20 h-1 mx-2 ${
                            currentStep > step ? 'bg-emerald-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Amount */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">المبلغ</h3>
                    {selectedProduct && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">{selectedProduct.title}</h4>
                        <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        مبلغ التبرع (ر.س)
                      </label>
                      <input
                        type="number"
                        min={selectedProduct?.min_amount || 1}
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder={selectedProduct?.suggested_amount?.toString() || 'أدخل المبلغ'}
                        className="w-full border rounded-lg px-4 py-3 text-right text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {selectedProduct?.min_amount && (
                        <p className="text-xs text-gray-500 mt-2">
                          الحد الأدنى: {parseFloat(selectedProduct.min_amount).toLocaleString('ar-SA')} ر.س
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={closeModal}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        إلغاء
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                      >
                        التالي
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Donor Info */}
                {currentStep === 2 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">معلومات المتبرع</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الاسم الكامل <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={donorInfo.name}
                          onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full border rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          value={donorInfo.email}
                          onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                          placeholder="example@email.com"
                          className="w-full border rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم الجوال
                        </label>
                        <input
                          type="tel"
                          value={donorInfo.phone}
                          onChange={(e) => setDonorInfo({ ...donorInfo, phone: e.target.value })}
                          placeholder="05xxxxxxxx"
                          className="w-full border rounded-lg px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        * يجب إدخال البريد الإلكتروني أو رقم الجوال على الأقل
                      </p>
                    </div>
                    <div className="flex justify-between gap-3">
                      <button
                        onClick={handlePrevStep}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        السابق
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                      >
                        التالي
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
       {/* Step 3: Payment Method */}
{currentStep === 3 && (
  <div>
    <h3 className="text-xl font-bold mb-4">اختر طريقة التبرع</h3>
    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
      {donationMethods.map((method) => {
        const IconComponent = getIcon(method.icon_name, CreditCard);
        const isSelected = selectedMethodId === method.id;

        return (
          <div
            key={method.id}
            onClick={() => {
              setSelectedMethodId(method.id);
              // خزّن الطريقة كاملة
              setSelectedProduct({ ...selectedProduct, selectedMethod: method });
            }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              isSelected ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isSelected ? 'bg-emerald-600' : 'bg-gray-100'
              }`}>
                <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{method.name}</h4>
                {method.description && <p className="text-sm text-gray-600">{method.description}</p>}
              </div>
              {isSelected && <CheckCircle className="w-5 h-5 text-emerald-600" />}
            </div>

            {/* بيانات الحساب البنكية تظهر فقط عند اختيار الطريقة */}
          {/* بيانات الحساب البنكية تظهر فقط عند اختيار الطريقة */}
{isSelected && (
  <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-4">
    {/* رقم الحساب */}
    {method.account_number && (
      <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
        <span className="font-medium">رقم الحساب: {method.account_number}</span>
        <button
          onClick={() => copyToClipboard(method.account_number, `account-${method.id}`)}
          className="p-2 hover:bg-gray-200 rounded"
          title="نسخ"
        >
          {copiedField === `account-${method.id}` ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    )}

    {/* IBAN */}
    {method.iban && (
      <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
        <span className="font-medium">IBAN: {method.iban}</span>
        <button
          onClick={() => copyToClipboard(method.iban, `iban-${method.id}`)}
          className="p-2 hover:bg-gray-200 rounded"
          title="نسخ"
        >
          {copiedField === `iban-${method.id}` ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Copy className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    )}

    {/* اسم الحساب والبنك */}
    <div className="space-y-1">
      {method.account_name && <p className="text-gray-700">اسم الحساب: <span className="font-medium">{method.account_name}</span></p>}
      {method.bank_name && <p className="text-gray-700">البنك: <span className="font-medium">{method.bank_name}</span></p>}
    </div>

    {/* QR Code */}
    {method.qr_code_url && (
      <div className="flex justify-center mt-4">
        <img src={method.qr_code_url} alt="QR Code" className="w-32 h-32" />
      </div>
    )}
  </div>
)}       </div>
        );
      })}
    </div>
    <div className="flex justify-between gap-3">
      <button
        onClick={handlePrevStep}
        className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        <ArrowRight className="w-4 h-4" />
        السابق
      </button>
      <button
        onClick={handleSubmitDonation}
        disabled={!selectedMethodId || submitting}
        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        إرسال
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  </div>
)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
