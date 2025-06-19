
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, Bookmark, TrendingUp, Zap } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "@/components/CategoryFilter";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SportStream
              </h1>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarks
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search sports news, eSports updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Breaking News */}
        {breakingNews.length > 0 && (
          <BreakingNews articles={breakingNews} />
        )}

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <FeaturedArticles articles={featuredArticles} />
        )}

        {/* Regular Articles Grid */}
        <section className="mb-8">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Latest News
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Empty State */}
        {!isLoading && articles?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No articles found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
