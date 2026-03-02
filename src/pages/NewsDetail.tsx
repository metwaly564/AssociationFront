import { Calendar, Tag, ChevronRight, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { publicApi, type NewsItem, type NewsCategory } from '../lib/api';

interface NewsDetailProps {
  slug: string;
  onBack: () => void;
}

export function NewsDetail({ slug, onBack }: NewsDetailProps) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNewsItem();
    loadCategories();
  }, [slug]);

  const loadNewsItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const item = await publicApi.getNewsBySlug(slug);
      if (!item) {
        setError('الخبر غير موجود');
      } else {
        setNewsItem(item);
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحميل الخبر');
      console.error('Error loading news item:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const apiCategories = await publicApi.getCategories();
      setCategories(apiCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const getCategoryName = (categorySlug?: string) => {
    if (!categorySlug) return 'أخبار';
    const category = categories.find((c) => c.slug === categorySlug);
    return category ? category.name : categorySlug;
  };

  const getCategoryColor = (categorySlug?: string) => {
    if (!categorySlug) return undefined;
    const category = categories.find((c) => c.slug === categorySlug);
    return category?.color;
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الخبر...</p>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="bg-white min-h-screen">
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">الخبر غير موجود</h1>
            <p className="text-gray-600 mb-8">{error || 'الخبر الذي تبحث عنه غير موجود أو تم حذفه'}</p>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              العودة إلى الأخبار
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 mb-6 text-white/90 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            <span>العودة إلى الأخبار</span>
          </button>
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5" />
              <span
                className="px-4 py-1 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: getCategoryColor(newsItem.category)
                    ? `${getCategoryColor(newsItem.category)}40`
                    : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              >
                {getCategoryName(newsItem.category)}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {newsItem.title}
            </h1>
            <div className="flex items-center gap-4 text-emerald-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {newsItem.published_at
                    ? new Date(newsItem.published_at).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'تاريخ غير محدد'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt={newsItem.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Excerpt */}
          {newsItem.excerpt && (
            <div className="mb-8 p-6 bg-emerald-50 rounded-xl border-r-4 border-emerald-600">
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                {newsItem.excerpt}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            {newsItem.body ? (
              <div
                className="text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: newsItem.body }}
              />
            ) : (
              <p className="text-gray-600 text-lg">لا يوجد محتوى متاح لهذا الخبر.</p>
            )}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-semibold">شارك هذا الخبر:</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="text-sm font-bold">f</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <span className="text-sm font-bold">t</span>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition-colors">
                    <span className="text-sm font-bold">in</span>
                  </button>
                </div>
              </div>
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                العودة إلى الأخبار
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Related News Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">أخبار ذات صلة</h2>
          <div className="text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              عرض جميع الأخبار
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
