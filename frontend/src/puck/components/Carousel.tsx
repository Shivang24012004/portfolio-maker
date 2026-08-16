import { useState, useEffect, useRef, useCallback } from "react";

export interface CarouselSlideItem {
  image: string;
  imageAlt?: string;
  smallText?: string;
  longText?: string;
  linkUrl?: string;
}

export interface CarouselProps {
  items: CarouselSlideItem[];
  aspectRatio: "16:9" | "4:3" | "21:9" | "1:1";
  autoPlay: "yes" | "no";
  autoPlaySeconds: "3" | "5" | "7" | "10";
  showArrows: "yes" | "no";
  showDots: "yes" | "no";
  showCounter: "yes" | "no";
  overlayTheme: "gradient" | "glass-card" | "minimal";
}

export function Carousel({
  items = [],
  aspectRatio = "16:9",
  autoPlay = "no",
  autoPlaySeconds = "5",
  showArrows = "yes",
  showDots = "yes",
  showCounter = "yes",
  overlayTheme = "gradient",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  const totalSlides = items.length;

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay handler
  useEffect(() => {
    if (autoPlay !== "yes" || totalSlides <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = (parseInt(autoPlaySeconds, 10) || 5) * 1000;
    timerRef.current = window.setInterval(nextSlide, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, autoPlaySeconds, totalSlides, isHovered, nextSlide]);

  // Keep index in bounds if items array is modified
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(totalSlides - 1);
    }
  }, [totalSlides, currentIndex]);

  if (totalSlides === 0) {
    return (
      <div className="puck-carousel-empty">
        <div className="puck-carousel-empty-icon">🖼️</div>
        <p className="puck-carousel-empty-title">Carousel is empty</p>
        <p className="puck-carousel-empty-desc">
          Add slide items in the Puck sidebar on the right.
        </p>
      </div>
    );
  }

    return (
    <div
      className="puck-carousel-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`puck-carousel-frame puck-carousel--ratio-${aspectRatio.replace(":", "-")}`}>
        {/* Slides Track */}
        <div
          className="puck-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((slide, idx) => (
            <div key={idx} className="puck-carousel-slide">
              <img
                src={slide.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"}
                alt={slide.imageAlt || slide.smallText || `Slide ${idx + 1}`}
                className="puck-carousel-img"
              />

              {/* Text Overlay */}
              {(slide.smallText || slide.longText) && (
                <div className={`puck-carousel-overlay puck-carousel-overlay--${overlayTheme}`}>
                  <div className="puck-carousel-content">
                    {slide.smallText && (
                      <h4 className="puck-carousel-small-text">{slide.smallText}</h4>
                    )}
                    {slide.longText && (
                      <p className="puck-carousel-long-text">{slide.longText}</p>
                    )}
                    {slide.linkUrl && (
                      <a
                        href={slide.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="puck-carousel-link-btn"
                      >
                        Explore Project ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showArrows === "yes" && totalSlides > 1 && (
          <>
            <button
              type="button"
              className="puck-carousel-arrow puck-carousel-arrow--prev"
              onClick={prevSlide}
              aria-label="Previous Slide"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              className="puck-carousel-arrow puck-carousel-arrow--next"
              onClick={nextSlide}
              aria-label="Next Slide"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Slide Counter Badge */}
        {showCounter === "yes" && totalSlides > 1 && (
          <div className="puck-carousel-counter">
            {currentIndex + 1} / {totalSlides}
          </div>
        )}

        {/* Dot Pagination */}
        {showDots === "yes" && totalSlides > 1 && (
          <div className="puck-carousel-dots">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`puck-carousel-dot ${idx === currentIndex ? "puck-carousel-dot--active" : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
