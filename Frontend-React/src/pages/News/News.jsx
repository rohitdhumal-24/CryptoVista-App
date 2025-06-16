import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const selectedArticle = location.state?.article;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://newsapi.org/v2/everything?q=tesla&from=2025-05-07&sortBy=publishedAt&apiKey=fe774616d4794e0a94cb8b0b0379499f"
        );
        setNews(response.data.articles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Button>

      {selectedArticle ? (
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <img
              src={selectedArticle.urlToImage}
              alt={selectedArticle.title}
              className="w-full h-[400px] object-cover rounded-lg mb-6"
            />
            <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-6">
              <span>{selectedArticle.source.name}</span>
              <span>•</span>
              <span>
                {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              {selectedArticle.description}
            </p>
            <p className="text-gray-600">{selectedArticle.content}</p>
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 text-orange-600 hover:text-orange-700 font-semibold"
            >
              Read full article →
            </a>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate("/news", { state: { article } })}
            >
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{article.source.name}</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
