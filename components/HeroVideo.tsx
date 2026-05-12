"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.catch(() => setPaused(true));
    }
  }, []);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.pause();
    setPaused(true);
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    const play = video.play();
    if (play && typeof play.catch === "function") {
      play.then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      setPaused(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const fmt = (t: number) => {
    const sec = Math.max(0, Math.floor(t));
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="hero-video-frame">
      <div className="hero-video-inner">
        <video
          ref={videoRef}
          src="/presentation.mp4"
          poster="/presentation-poster.jpg"
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          aria-label="Vidéo de présentation Clubs Actionnaires"
        >
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>

        {paused && (
          <img
            src="/presentation-poster.jpg"
            alt=""
            aria-hidden="true"
            className="hero-video-poster"
          />
        )}

        <div
          className={`hero-video-badge ${paused ? "is-paused" : ""}`}
          aria-hidden="true"
        >
          <span className="hero-video-badge-dot" />
          <span>{paused ? "PAUSED" : "LIVE PREVIEW"}</span>
        </div>

        {paused && (
          <button
            type="button"
            className="hero-video-play"
            onClick={handleReplay}
            aria-label="Rejouer la vidéo"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>

      <div className="hero-video-bar">
        <div className="hero-video-bar-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="hero-video-bar-title">
          clubs-actionnaires — presentation.mp4
        </span>
        <span className="hero-video-bar-meta">{fmt(currentTime)}</span>
      </div>
    </div>
  );
}
