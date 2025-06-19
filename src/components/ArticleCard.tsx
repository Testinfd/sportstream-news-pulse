
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye } from "lucide-react";
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

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
          <Badge 
            variant="secondary" 
            className="text-xs font-medium"
            style={{ backgroundColor: article.categories.color, color: 'white' }}
          >
            {article.categories.icon} {article.categories.name}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{article.author}</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.reading_time} min read</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{article.views_count || 0}</span>
            </div>
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
