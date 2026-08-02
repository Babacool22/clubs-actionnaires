"use client";

import { useEffect, useRef } from "react";

type ParticleDotoTextProps = {
  lines: string[];
  wrap?: boolean;
  thinFives?: boolean;
};

type Particle = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

const SPRING = 0.075;
const DAMPING = 0.82;

export default function ParticleDotoText({
  lines,
  wrap = false,
  thinFives = false,
}: ParticleDotoTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;

    if (!root || !canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const pointer = {
      active: false,
      x: 0,
      y: 0,
    };
    const particles: Particle[] = [];
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let animationFrame = 0;
    let color = "";
    let width = 0;
    let height = 0;
    let canvasPadding = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelScaleX = 1;
    let pixelScaleY = 1;
    let canvasSnapOffsetX = 0;
    let canvasSnapOffsetY = 0;
    let influenceRadius = 64;
    let maxDisplacement = 28;

    const draw = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;

      particles.forEach((particle) => {
        const centerX = Math.round(
          (particle.x + canvasPadding - canvasSnapOffsetX) * pixelScaleX
        );
        const centerY = Math.round(
          (particle.y + canvasPadding - canvasSnapOffsetY) * pixelScaleY
        );
        const squareSize = Math.max(
          1,
          Math.round(particle.size * Math.min(pixelScaleX, pixelScaleY))
        );

        context.fillRect(
          Math.round(centerX - squareSize / 2),
          Math.round(centerY - squareSize / 2),
          squareSize,
          squareSize
        );
      });
    };

    const rebuildParticles = () => {
      const bounds = root.getBoundingClientRect();
      const styles = window.getComputedStyle(root);
      const fontSize = Number.parseFloat(styles.fontSize);
      const devicePixelRatio = window.devicePixelRatio || 1;

      width = Math.max(1, Math.ceil(bounds.width));
      height = Math.max(1, Math.ceil(bounds.height));
      color =
        document.documentElement.dataset.theme === "light"
          ? "#000000"
          : "#ffffff";
      influenceRadius = Math.max(42, fontSize * 1.12);
      maxDisplacement = Math.max(20, fontSize * 0.48);
      canvasPadding = Math.ceil(maxDisplacement + 6);
      canvasWidth = width + canvasPadding * 2;
      canvasHeight = height + canvasPadding * 2;

      canvas.width = Math.round(canvasWidth * devicePixelRatio);
      canvas.height = Math.round(canvasHeight * devicePixelRatio);
      canvas.style.width = `${canvas.width / devicePixelRatio}px`;
      canvas.style.height = `${canvas.height / devicePixelRatio}px`;
      const unsnappedCanvasLeft = bounds.left - canvasPadding;
      const unsnappedCanvasTop = bounds.top - canvasPadding;
      const snappedCanvasLeft =
        Math.round(unsnappedCanvasLeft * devicePixelRatio) / devicePixelRatio;
      const snappedCanvasTop =
        Math.round(unsnappedCanvasTop * devicePixelRatio) / devicePixelRatio;
      canvasSnapOffsetX = snappedCanvasLeft - unsnappedCanvasLeft;
      canvasSnapOffsetY = snappedCanvasTop - unsnappedCanvasTop;
      canvas.style.left = `${-canvasPadding + canvasSnapOffsetX}px`;
      canvas.style.top = `${-canvasPadding + canvasSnapOffsetY}px`;
      pixelScaleX = devicePixelRatio;
      pixelScaleY = devicePixelRatio;

      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = height;
      const maskContext = mask.getContext("2d", {
        willReadFrequently: true,
      });

      if (!maskContext) {
        return;
      }

      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#ffffff";
      maskContext.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
      maskContext.textBaseline = "top";

      const fiveMask =
        thinFives && lines.some((line) => line.includes("5"))
          ? document.createElement("canvas")
          : null;
      const fiveMaskContext = fiveMask?.getContext("2d", {
        willReadFrequently: true,
      });

      if (fiveMask && fiveMaskContext) {
        fiveMask.width = width;
        fiveMask.height = height;
        fiveMaskContext.fillStyle = "#ffffff";
        fiveMaskContext.font = maskContext.font;
        fiveMaskContext.textBaseline = "top";
      }

      const letterSpacingContext = maskContext as CanvasRenderingContext2D & {
        letterSpacing?: string;
      };
      letterSpacingContext.letterSpacing = styles.letterSpacing;

      const lineElements = root.querySelectorAll<HTMLElement>(
        ".particle-doto-text__line"
      );

      const drawFiveCharacters = (
        lineElement: HTMLElement,
        lineIndex: number
      ) => {
        if (!fiveMaskContext) {
          return;
        }

        const textNode = Array.from(lineElement.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE
        );

        if (!textNode) {
          return;
        }

        const range = document.createRange();
        const fiveLetterSpacingContext = fiveMaskContext as CanvasRenderingContext2D & {
          letterSpacing?: string;
        };
        fiveLetterSpacingContext.letterSpacing = "0px";

        Array.from(lines[lineIndex]).forEach((character, characterIndex) => {
          if (character !== "5") {
            return;
          }

          range.setStart(textNode, characterIndex);
          range.setEnd(textNode, characterIndex + 1);
          const characterBounds = range.getBoundingClientRect();

          fiveMaskContext.fillText(
            character,
            characterBounds.left - bounds.left,
            characterBounds.top - bounds.top
          );
        });
      };

      lineElements.forEach((lineElement, index) => {
        const lineBounds = lineElement.getBoundingClientRect();

        if (!wrap) {
          maskContext.fillText(
            lines[index],
            lineBounds.left - bounds.left,
            lineBounds.top - bounds.top
          );
          drawFiveCharacters(lineElement, index);
          return;
        }

        const textNode = Array.from(lineElement.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE
        );

        if (!textNode) {
          return;
        }

        letterSpacingContext.letterSpacing = "0px";

        Array.from(lines[index]).forEach((character, characterIndex) => {
          if (character.trim().length === 0) {
            return;
          }

          const range = document.createRange();
          range.setStart(textNode, characterIndex);
          range.setEnd(textNode, characterIndex + 1);
          const characterBounds = range.getBoundingClientRect();

          maskContext.fillText(
            character,
            characterBounds.left - bounds.left,
            characterBounds.top - bounds.top
          );
        });

        drawFiveCharacters(lineElement, index);
      });

      const pixels = maskContext.getImageData(0, 0, width, height).data;
      const fivePixels = fiveMaskContext
        ? fiveMaskContext.getImageData(0, 0, width, height).data
        : null;
      const step = Math.max(3, Math.round(fontSize / 15));
      const squareSize = Math.max(1.6, step * 0.52);
      particles.length = 0;

      for (let y = Math.floor(step / 2); y < height; y += step) {
        for (let x = Math.floor(step / 2); x < width; x += step) {
          let visible = false;
          let fiveVisible = false;

          for (let offsetY = -1; offsetY <= 1 && !visible; offsetY += 1) {
            for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
              const sampleX = Math.min(
                width - 1,
                Math.max(0, x + offsetX)
              );
              const sampleY = Math.min(
                height - 1,
                Math.max(0, y + offsetY)
              );
              const alpha = pixels[(sampleY * width + sampleX) * 4 + 3];

              if (alpha > 90) {
                visible = true;
                break;
              }
            }
          }

          if (fivePixels) {
            for (let offsetY = -1; offsetY <= 1 && !fiveVisible; offsetY += 1) {
              for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
                const sampleX = Math.min(
                  width - 1,
                  Math.max(0, x + offsetX)
                );
                const sampleY = Math.min(
                  height - 1,
                  Math.max(0, y + offsetY)
                );
                const alpha = fivePixels[(sampleY * width + sampleX) * 4 + 3];

                if (alpha > 90) {
                  fiveVisible = true;
                  break;
                }
              }
            }
          }

          if (visible) {
            particles.push({
              homeX: x,
              homeY: y,
              x,
              y,
              vx: 0,
              vy: 0,
              size: fiveVisible ? squareSize * 0.82 : squareSize,
            });
          }

        }
      }

      draw();
    };

    const animate = () => {
      const canReact = finePointer.matches && !reducedMotion.matches;

      particles.forEach((particle) => {
        if (canReact && pointer.active) {
          const deltaX = particle.x - pointer.x;
          const deltaY = particle.y - pointer.y;
          const distance = Math.hypot(deltaX, deltaY);

          if (distance > 0 && distance < influenceRadius) {
            const proximity = 1 - distance / influenceRadius;
            const force = proximity * proximity * 1.9;
            particle.vx += (deltaX / distance) * force;
            particle.vy += (deltaY / distance) * force;
          }
        }

        particle.vx += (particle.homeX - particle.x) * SPRING;
        particle.vy += (particle.homeY - particle.y) * SPRING;
        particle.vx *= DAMPING;
        particle.vy *= DAMPING;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const offsetX = particle.x - particle.homeX;
        const offsetY = particle.y - particle.homeY;
        const displacement = Math.hypot(offsetX, offsetY);

        if (displacement > maxDisplacement) {
          const scale = maxDisplacement / displacement;
          particle.x = particle.homeX + offsetX * scale;
          particle.y = particle.homeY + offsetY * scale;
          particle.vx *= 0.35;
          particle.vy *= 0.35;
        }
      });

      draw();
      animationFrame = window.requestAnimationFrame(animate);
    };

    const updatePointer = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) {
        return;
      }

      const bounds = root.getBoundingClientRect();
      pointer.active = true;
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
    };

    const releasePointer = () => {
      pointer.active = false;
    };

    const resizeObserver = new ResizeObserver(rebuildParticles);
    const themeObserver = new MutationObserver(rebuildParticles);

    resizeObserver.observe(root);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    root.addEventListener("pointermove", updatePointer);
    root.addEventListener("pointerleave", releasePointer);

    void document.fonts.ready.then(rebuildParticles);
    rebuildParticles();
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      root.removeEventListener("pointermove", updatePointer);
      root.removeEventListener("pointerleave", releasePointer);
    };
  }, [lines, thinFives, wrap]);

  return (
    <span
      ref={rootRef}
      className={`particle-doto-text${wrap ? " particle-doto-text--wrap" : ""}`}
      data-wrap={wrap}
      aria-hidden="true"
    >
      <span className="particle-doto-text__measure">
        {lines.map((line, index) => (
          <span className="particle-doto-text__line" key={`${line}-${index}`}>
            {line}
          </span>
        ))}
      </span>
      <canvas ref={canvasRef} className="particle-doto-text__canvas" />
    </span>
  );
}
