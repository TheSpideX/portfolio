import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const TRAIL_COUNT = 12;

  useGSAP(() => {
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3" });

    const xToFollower = gsap.quickTo(followerRef.current, "x", { duration: 0.3, ease: "power3" });
    const yToFollower = gsap.quickTo(followerRef.current, "y", { duration: 0.3, ease: "power3" });

    // Trail quickTo arrays
    const trailXTo = trailRefs.current.map((el, i) =>
      gsap.quickTo(el, "x", { duration: 0.2 + i * 0.06, ease: "power2" })
    );
    const trailYTo = trailRefs.current.map((el, i) =>
      gsap.quickTo(el, "y", { duration: 0.2 + i * 0.06, ease: "power2" })
    );
    // Set initial trail opacity (fading)
    trailRefs.current.forEach((el, i) => {
      gsap.set(el, { opacity: 0.4 - (i * 0.03), scale: 1 - (i * 0.06) });
    });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
      trailXTo.forEach(fn => fn(e.clientX));
      trailYTo.forEach(fn => fn(e.clientY));
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest('[data-cursor]');
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor');
        const size = cursorTarget.getAttribute('data-cursor-size');
        const inverted = cursorTarget.getAttribute('data-cursor-inverted') === 'true';

        if (cursorTextRef.current && text) {
          cursorTextRef.current.innerText = text;
          gsap.to(cursorTextRef.current, { opacity: 1, duration: 0.2 });
        }
        gsap.to(cursorRef.current, { scale: 0, duration: 0.3, ease: 'power2.out' });

        const targetScale = size ? parseFloat(size) : 3;
        gsap.to(followerRef.current, {
          scale: targetScale,
          backgroundColor: inverted ? '#fff' : '#ccff00',
          borderColor: inverted ? '#fff' : '#ccff00',
          mixBlendMode: inverted ? 'difference' : 'normal',
          duration: 0.3
        });
      } else if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('.hover-expand')) {
        gsap.to(cursorRef.current, { scale: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(followerRef.current, { scale: 2, backgroundColor: 'rgba(204, 255, 0, 0.1)', borderColor: '#ccff00', mixBlendMode: 'normal', duration: 0.3 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest('[data-cursor]');
      if (cursorTarget) {
        if (cursorTextRef.current) {
          gsap.to(cursorTextRef.current, { opacity: 0, duration: 0.2 });
        }
      }
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(followerRef.current, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(204, 255, 0, 0.5)', mixBlendMode: 'normal', duration: 0.3 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block pointer-events-none z-[10002]" />
      <div ref={followerRef} className="custom-cursor-follower hidden md:flex items-center justify-center pointer-events-none z-[10002]">
        <span ref={cursorTextRef} className="font-mono text-[10px] font-bold text-black opacity-0 pointer-events-none tracking-wider" />
      </div>
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { if (el) trailRefs.current[i] = el; }}
          className="cursor-trail-dot hidden md:block"
        />
      ))}
    </>
  );
}
