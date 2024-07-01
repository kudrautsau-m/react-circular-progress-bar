import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";
import { useIntersection } from "../../hooks/useIntersection";
import { IHeat } from "../../types";

const Heat: React.FC<IHeat> = ({
  progress,
  showValue = true,
  text,
  revertBackground = false,
  range = { from: 0, to: 100 },
  sign = { value: "%", position: "end" },
  sx,
}) => {
  const {
    valueSize = 30,
    textSize = 14,
    textFamily = "Trebuchet MS",
    valueFamily = "Trebuchet MS",
    textColor = "#000000",
    valueColor = "#000000",
    textWeight = "normal",
    valueWeight = "normal",
    strokeLinecap = "round",
    loadingTime = 500,
    shape = "threequarters",
    valueAnimation = true,
    intersectionEnabled = true,
  } = sx;

  const [afterProgress, setAfterProgress] = useState(0);
  const prevRef = useRef(0);
  const heatRef = useRef<HTMLDivElement>(null);
  const randomID = crypto.randomUUID().split("-")[0];

  const { isVisible } = useIntersection(heatRef);

  const setShape = (): number => {
    switch (shape) {
      case "threequarters":
        return 75;
      case "half":
        return 50;
    }
  };

  const setRotate = (): string => {
    switch (shape) {
      case "threequarters":
        return "rotate(135, 55, 55)";
      case "half":
        return "rotate(180, 55, 55)";
    }
  };

  const setRatio = (): number => {
    switch (shape) {
      case "threequarters":
        return 0.75;
      case "half":
        return 0.5;
    }
  };

  const { animatedValue } = useAnimatedValue(
    prevRef.current / setRatio(),
    afterProgress / setRatio(),
    loadingTime
  );

  useEffect(() => {
    if ((intersectionEnabled && isVisible) || !intersectionEnabled) {
      setAfterProgress(progress * setRatio());
      prevRef.current = afterProgress;
    }
  }, [progress, shape, isVisible]);

  const dasharray = 2 * Math.PI * 50;
  const dashoffset = (1 - (afterProgress + range.from) / range.to) * dasharray;
  return (
    <div ref={heatRef} style={{ position: "relative" }}>
      <svg
        viewBox="0 0 110 110"
        style={
          {
            "--ds1": "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))",
            "--ds2": "drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
            filter: "var(--ds1) var(--ds2)",
          } as CSSProperties
        }
      >
        <circle
          r="50"
          cx="55"
          cy="55"
          fill="none"
          strokeDasharray={dasharray}
          strokeDashoffset={(1 - setShape() / 100) * dasharray}
          strokeWidth={sx.barWidth}
          stroke={sx.bgColor}
          strokeLinecap={strokeLinecap}
          transform={setRotate()}
        />
      </svg>
      <svg
        viewBox="0 0 110 110"
        style={{
          zIndex: 10,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {!revertBackground ? (
          shape === "threequarters" ? (
            <linearGradient
              id={randomID}
              x1="90.7089"
              y1="75.1526"
              x2="33.7868"
              y2="18.2305"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00FF00" />
              <stop offset="0.34691" stopColor="#C1FF00" />
              <stop offset="0.775843" stopColor="#FFB800" />
              <stop offset="1" stopColor="#FF0000" />
            </linearGradient>
          ) : (
            <linearGradient id={randomID} gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0000" />
              <stop offset="0.274348" stopColor="#FFB800" />
              <stop offset="0.676789" stopColor="#C1FF00" />
              <stop offset="1" stopColor="#00FF00" />
            </linearGradient>
          )
        ) : shape === "threequarters" ? (
          <linearGradient
            id={randomID}
            x1="90.7089"
            y1="75.1526"
            x2="33.7868"
            y2="18.2305"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF0000" />
            <stop offset="0.34691" stopColor="#FFB800" />
            <stop offset="0.775843" stopColor="#C1FF00" />
            <stop offset="1" stopColor="#00FF00" />
          </linearGradient>
        ) : (
          <linearGradient id={randomID} gradientUnits="userSpaceOnUse">
            <stop stopColor="#00FF00" />
            <stop offset="0.274348" stopColor="#C1FF00" />
            <stop offset="0.676789" stopColor="#FFB800" />
            <stop offset="1" stopColor="#FF0000" />
          </linearGradient>
        )}

        <circle
          r="50"
          cx="55"
          cy="55"
          fill="none"
          style={{
            transition: "stroke-dashoffset ease-in-out",
            transitionDuration: loadingTime.toString().concat("ms"),
          }}
          strokeDasharray={dasharray}
          strokeDashoffset={dashoffset}
          strokeWidth={sx.barWidth}
          stroke={`url(#${randomID})`}
          strokeLinecap={strokeLinecap}
          transform={setRotate()}
        />
        {showValue && (
          <text
            x="50%"
            y={
              shape === "half"
                ? text !== undefined && text !== ""
                  ? "35%"
                  : "40%"
                : text !== undefined && text !== ""
                ? "45%"
                : "50%"
            }
            fontSize={valueSize}
            fontWeight={valueWeight}
            fontFamily={valueFamily}
            textAnchor="middle"
            fill={valueColor}
          >
            <tspan
              dominantBaseline={
                text !== undefined && text !== "" ? "baseline" : "central"
              }
            >
              {sign.position === "start"
                ? sign.value +
                  (valueAnimation ? animatedValue : progress).toString()
                : (valueAnimation ? animatedValue : progress)
                    .toString()
                    .concat(sign.value)}
            </tspan>
          </text>
        )}
        {text !== undefined && text !== "" && (
          <text
            x="50%"
            y={shape === "half" ? "40%" : showValue ? "55%" : "50%"}
            fontSize={textSize}
            fontFamily={textFamily}
            fontWeight={textWeight}
            textAnchor="middle"
            fill={textColor}
            dominantBaseline={showValue ? "hanging" : "start"}
          >
            <tspan
              dominantBaseline={
                showValue ? "hanging" : shape === "half" ? "hanging" : "middle"
              }
            >
              {text}
            </tspan>
          </text>
        )}
      </svg>
    </div>
  );
};

export default Heat;
