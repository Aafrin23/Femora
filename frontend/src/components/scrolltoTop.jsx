import React, { useEffect, useState } from "react";

function ScrollToTop() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showScrollTop) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className="
        fixed
        bottom-6
        right-6
        z-[9999]
        w-12
        h-12
        rounded-full
        bg-white
        text-[#4A1838]
        border
        border-[#F0DFE5]
        shadow-[0_6px_25px_rgba(74,24,56,0.15)]
        flex
        items-center
        justify-center
        hover:bg-[#4A1838]
        hover:text-white
        hover:scale-105
        active:scale-95
        transition-all
        duration-200
      "
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 19V5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          d="M6 11L12 5L18 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default ScrollToTop;