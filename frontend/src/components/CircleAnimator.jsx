import React, { useState } from "react";
import { motion } from "framer-motion";

function CircleAnimator({ items = [] }) {
  const [isPaused, setIsPaused] = useState(false);

  const radius = 250;

  return (
    <div className="relative w-[700px] h-[700px] mx-auto mt-5 flex items-center justify-center">

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 pointer-events-none">
        <h1 className="text-4xl font-bold text-primary font-serif italic">
          Wellness 
        </h1>

        {/* <p className="text-black mt-3 text-lg">
          Own your Glow!
        </p> */}
      </div>

      {/* Rotating Orbit */}
      <motion.div
        className="absolute w-full h-full"
        animate={{
          rotate: isPaused ? 0 : 360,
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((item, index) => {
          const angle = (360 / items.length) * index;

          return (
            <div
              key={index}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `
                  rotate(${angle}deg)
                  translate(${radius}px)
                  rotate(-${angle}deg)
                  translate(-50%, -50%)
                `,
                transformOrigin: "center",
              }}
            >
              {/* Keep card upright */}
              <motion.div
                animate={{
                  rotate: isPaused ? 0 : -360,
                }}
                transition={{
                  duration: 25,
                  ease: "linear",
                  repeat: Infinity,
                }}
                whileHover={{
                  scale: 1.12,
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="w-40 bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-primary text-lg">
                    {item.title}
                  </h3>

                  {/* <p className="text-gray-500 text-sm mt-2">
                    {item.description}
                  </p> */}
                </div>
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default CircleAnimator;