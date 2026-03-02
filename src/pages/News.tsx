import { Calendar, Tag, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi, type NewsItem } from '../lib/api';

export function News({ onSelectNews }: { onSelectNews: (slug: string) => void }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; label: string; slug: string; color?: string }>>([
    { id: 'all', label: 'جميع الأخبار', slug: 'all' },
  ]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    loadNews();
    loadCategories();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const news = await publicApi.getNews();
      // تحويل البيانات من API إلى التنسيق المطلوب
      const formattedNews = news.map((item) => ({
        ...item,
        category: item.category || 'events', // استخدام category من API
        date: item.published_at || item.created_at || new Date().toISOString(),
        image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      }));
      setNewsItems(formattedNews);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const apiCategories = await publicApi.getCategories();
      // تحويل التصنيفات من API إلى التنسيق المطلوب
      const formattedCategories = [
        { id: 'all', label: 'جميع الأخبار', slug: 'all' },
        ...apiCategories.map((cat) => ({
          id: cat.slug,
          label: cat.name,
          slug: cat.slug,
          color: cat.color,
        })),
      ];
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Keep default categories on error
    } finally {
      setCategoriesLoading(false);
    }
  };

  const filteredNews =
    selectedCategory === 'all'
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">الأخبار والفعاليات</h1>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
            تابع آخر أخبارنا وفعالياتنا وإنجازاتنا
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Tag className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الأخبار...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">لا توجد أخبار متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image || 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{item.published_at ? new Date(item.published_at).toLocaleDateString('ar-SA') : '-'}</span>
                  </div>
                </div>
                <div className="p-6">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                    style={{
                      backgroundColor: categories.find((c) => c.id === item.category)?.color
                        ? `${categories.find((c) => c.id === item.category)?.color}20`
                        : undefined,
                      color: categories.find((c) => c.id === item.category)?.color
                        ? categories.find((c) => c.id === item.category)?.color
                        : undefined,
                    }}
                  >
                    {categories.find((c) => c.id === item.category)?.label || 'أخبار'}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{item.excerpt || ''}</p>
                  <button 
                    onClick={() => {
                      if ((window as any).navigateToNewsDetail) {
                        (window as any).navigateToNewsDetail(item.slug);
                      }
                    }}
                    className="flex items-center gap-2 text-emerald-600 font-semibold hover:gap-3 transition-all"
                  >
                    اقرأ المزيد
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">ابقَ على اطلاع</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            اشترك في نشرتنا الإخبارية لتصلك آخر الأخبار والفعاليات
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-600 focus:outline-none"
            />
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              اشتراك
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
