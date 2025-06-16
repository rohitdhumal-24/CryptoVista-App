import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewsSlider = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://newsapi.org/v2/everything?q=tesla&from=2025-05-07&sortBy=publishedAt&apiKey=fe774616d4794e0a94cb8b0b0379499f"
        );
        setNews(response.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === news.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Reduced to 2 seconds for faster sliding

    return () => clearInterval(interval);
  }, [news.length]);

  const handleNewsClick = (article) => {
    navigate("/news", { state: { article } });
  };

  if (!news.length) return null;

  return (
    <div className="overflow-hidden whitespace-nowrap relative">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {news.map((article, index) => (
          <div
            key={index}
            className="min-w-full px-4"
            onClick={() => handleNewsClick(article)}
          >
            <p className="text-base font-semibold text-white hover:text-orange-600 cursor-pointer transition-colors duration-300">
              {article.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;
