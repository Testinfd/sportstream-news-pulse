
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock } from "lucide-react";
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
  categories: Category;
}

interface BreakingNewsProps {
  articles: Article[];
}

const BreakingNews = ({ articles }: BreakingNewsProps) => {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
            <Zap className="w-3 h-3 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Breaking News
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {articles.slice(0, 2).map((article, index) => (
          <Card 
            key={article.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-xl ${
              index === 0 ? 'lg:col-span-2' : ''
            } bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800`}
            onClick={() => navigate(`/article/${article.slug}`)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className={`${index === 0 ? 'md:w-1/2' : 'md:w-1/3'} flex-shrink-0`}>
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={article.image_url || "/placeholder.svg"}
                      alt={article.title}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <Zap className="w-3 h-3 mr-1" />
                        BREAKING
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: article.categories.color, color: article.categories.color }}
                    >
                      {article.categories.icon} {article.categories.name}
                    </Badge>
                  </div>
                  
                  <h3 className={`font-bold mb-3 text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition-colors ${
                    index === 0 ? 'text-2xl' : 'text-xl'
                  }`}>
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-medium">{article.author}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.reading_time} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default BreakingNews;
