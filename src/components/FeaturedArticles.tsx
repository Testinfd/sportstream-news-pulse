
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Eye } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  author: string;
  published_at: string;
  reading_time: number;
  views_count: number;
  categories: Category;
}

interface FeaturedArticlesProps {
  articles: Article[];
}

const FeaturedArticles = ({ articles }: FeaturedArticlesProps) => {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Featured Stories
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((article) => (
          <Card 
            key={article.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-2 border-yellow-200 dark:border-yellow-800"
            onClick={() => navigate(`/article/${article.slug}`)}
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={article.image_url || "/placeholder.svg"}
                  alt={article.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </AspectRatio>
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge 
                  variant="secondary"
                  style={{ backgroundColor: article.categories.color, color: 'white' }}
                >
                  {article.categories.icon} {article.categories.name}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-5">
              <h3 className="font-bold text-xl mb-3 text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                {article.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{article.author}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.reading_time} min</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views_count || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedArticles;
