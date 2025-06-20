
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
// Badge removed as it's used inside ArticleCard
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bookmark, TrendingUp, Rss, LayoutGrid, List } from "lucide-react"; // Replaced unused icons, Added Rss, LayoutGrid, List
// AspectRatio removed as it's used inside ArticleCard
import { useNavigate } from "react-router-dom";
import CategoryFilter from "@/components/CategoryFilter";
// Zap removed as it was unused
import ArticleCard from "@/components/ArticleCard";
import BreakingNews from "@/components/BreakingNews";
import FeaturedArticles from "@/components/FeaturedArticles";

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
  content: string;
  image_url: string;
  author: string;
  published_at: string;
  reading_time: number;
  views_count: number;
  is_breaking: boolean;
  is_featured: boolean;
  categories: Category;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch articles with filtering
  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", searchQuery, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select(`
          *,
          categories:category_id (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .order("published_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq("categories.slug", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Article[];
    },
  });

  // Separate breaking news and featured articles
  const breakingNews = articles?.filter(article => article.is_breaking) || [];
  const featuredArticles = articles?.filter(article => article.is_featured && !article.is_breaking) || [];
  const regularArticles = articles?.filter(article => !article.is_breaking && !article.is_featured) || [];
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-blue-400 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary to-blue-500 dark:to-blue-600 bg-clip-text text-transparent">
                  SportStream
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-primary">
                <Bookmark className="w-5 h-5" />
                <span className="sr-only">Bookmarks</span>
              </Button>
               {/* Theme toggle button is now in App.tsx */}
            </div>
          </div>

          {/* Search Bar - enhanced */}
          <div className="mt-4 relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search news, teams, players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-2.5 text-base bg-input border-border focus:ring-2 focus:ring-primary rounded-lg"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Category Filter - enhanced styling */}
        <CategoryFilter
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Breaking News - if any */}
        {breakingNews.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center">
              <Rss className="w-6 h-6 mr-3 text-primary" /> Breaking News
            </h2>
            <BreakingNews articles={breakingNews} />
          </section>
        )}

        {/* Featured Articles - if any */}
        {featuredArticles.length > 0 && (
           <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-primary" /> Featured
            </h2>
            <FeaturedArticles articles={featuredArticles} />
          </section>
        )}

        {/* Main Articles Section - with Layout Toggle */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Latest Updates
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant={layoutMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setLayoutMode("grid")}
                className="text-muted-foreground hover:text-primary"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={layoutMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setLayoutMode("list")}
                className="text-muted-foreground hover:text-primary"
              >
                <List className="w-5 h-5" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className={`grid gap-6 ${layoutMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {[...Array(layoutMode === "grid" ? 8 : 4)].map((_, i) => (
                <Card key={i} className="animate-pulse rounded-xl overflow-hidden">
                  <div className={`aspect-video bg-muted rounded-t-lg ${layoutMode === "list" ? "hidden" : ""}`} />
                  <CardContent className="p-5">
                    <div className="h-5 bg-muted rounded mb-3 w-3/4" />
                    <div className="h-4 bg-muted rounded mb-4 w-full" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className={`grid gap-x-6 gap-y-8 ${layoutMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Enhanced Empty State */}
        {!isLoading && articles?.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-primary/20">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
              No Articles Found
            </h3>
            <p className="text-muted-foreground sm:text-lg max-w-md mx-auto">
              We couldn't find any articles matching your current filters. Try adjusting your search or selecting a different category.
            </p>
          </div>
        )}
      </main>
      <footer className="py-8 border-t border-border mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} SportStream. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
