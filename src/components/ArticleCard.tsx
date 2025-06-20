
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, UserCircle } from "lucide-react"; // Added UserCircle
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
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 ease-in-out
                 bg-card text-card-foreground border border-border
                 hover:shadow-xl hover:-translate-y-1.5 rounded-xl overflow-hidden"
      onClick={() => navigate(`/article/${article.slug}`)}
    >
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          <img
            src={article.image_url || "/placeholder.svg"}
            alt={article.title}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {article.categories && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="text-xs font-semibold px-2 py-1 rounded-md"
              style={{ backgroundColor: article.categories.color || 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
            >
              {article.categories.icon && <span className="mr-1.5">{article.categories.icon}</span>}
              {article.categories.name}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="font-semibold text-xl mb-1 text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <UserCircle className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{article.author}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.reading_time} min read</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>{article.views_count || 0} views</span>
            <span className="font-medium">{formatDate(article.published_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
