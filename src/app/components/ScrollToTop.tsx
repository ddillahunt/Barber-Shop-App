import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "./ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 size-14 rounded-full shadow-xl shadow-amber-500/50 z-50 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black border-2 border-amber-400"
          size="icon"
        >
          <ChevronUp className="size-6" />
        </Button>
      )}
    </>
  );
}