import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const cursorIconRef = useRef<HTMLDivElement>(null);
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
      const cursorTarget = target.closest('[data-cursor], [data-cursor-icon]');
      if (cursorTarget) {
        const text = cursorTarget.getAttribute('data-cursor');
        const size = cursorTarget.getAttribute('data-cursor-size');
        const inverted = cursorTarget.getAttribute('data-cursor-inverted') === 'true';
        const iconType = cursorTarget.getAttribute('data-cursor-icon');

        // Hide both first
        gsap.to(cursorTextRef.current, { opacity: 0, duration: 0.1 });
        gsap.to(cursorIconRef.current, { opacity: 0, duration: 0.1 });

        if (iconType && cursorIconRef.current) {
          // Show icon
          cursorIconRef.current.innerHTML = getIconSvg(iconType);
          gsap.to(cursorIconRef.current, { opacity: 1, duration: 0.2 });
        } else if (cursorTextRef.current && text) {
          // Show text
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
      const cursorTarget = target.closest('[data-cursor], [data-cursor-icon]');
      if (cursorTarget) {
        if (cursorTextRef.current) {
          gsap.to(cursorTextRef.current, { opacity: 0, duration: 0.2 });
        }
        if (cursorIconRef.current) {
          gsap.to(cursorIconRef.current, { opacity: 0, duration: 0.2 });
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
      <div ref={followerRef} className="custom-cursor-follower hidden md:flex items-center justify-center pointer-events-none z-[10002] relative">
        <span ref={cursorTextRef} className="font-mono text-[8px] font-bold text-black opacity-0 pointer-events-none tracking-wider absolute top-1/2 left-1/2 w-full text-center" style={{ transform: 'translate(-50%, -50%)', lineHeight: 1 }} />
        <div ref={cursorIconRef} className="opacity-0 pointer-events-none flex items-center justify-center [&_svg]:w-[14px] [&_svg]:h-[14px] absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }} />
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

function getIconSvg(type: string): string {
  switch (type) {
    case 'github':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>';
    case 'linkedin':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>';
    case 'leetcode':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="black"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.252c.54-.64 1.517-1.144 2.894-1.144h6.059a4.237 4.237 0 0 0 2.222-.294 3.999 3.999 0 0 0 1.706-1.571 3.65 3.65 0 0 0 .5-1.99 3.6 3.6 0 0 0-.493-1.986 4.024 4.024 0 0 0-1.748-1.579A4.316 4.316 0 0 0 16.98 10H8.384l3.528-3.784h4.088c2.404-.007 2.404-3.593 0-3.593H13.483zM16.98 12.333c.48.006.88.163 1.18.47.24.246.368.583.364.954.004.372-.124.71-.364.955-.3.308-.7.465-1.18.471H7.8A11.392 11.392 0 0 1 7.8 12.333h9.18z"/></svg>';
    case 'email':
      return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
    default:
      return '';
  }
}
