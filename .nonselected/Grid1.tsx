// "use client";

// import Image from "next/image";
// import { useCallback, useLayoutEffect, useRef, useState } from "react";

// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { GalleryItem } from "@/lib/GalleryItems";
// import GalleryViewer from "@/.nonselected/GalleryViewer";
// import IntroAnimation from "../components/IntroComponent";

// gsap.registerPlugin(ScrollTrigger);

// const OFFSET_CYCLE_L = [0, 160, 40, 220];
// const OFFSET_CYCLE_R = [64, 0, 200, 32];

// function getOffset(index: number, cycle: number[]) {
//   return cycle[index % cycle.length];
// }

// type GalleryMediaProps = {
//   item: GalleryItem;
//   onClick: () => void;
//   mediaRef: (el: HTMLDivElement | null) => void;
// };

// function GalleryMedia({ item, onClick, mediaRef }: GalleryMediaProps) {
//   const imageRef = useRef<HTMLImageElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   const [isHovered, setIsHovered] = useState(false);

//   const [overlayColor, setOverlayColor] = useState("rgb(40, 40, 40)");

//   /*
//    * Create a canvas copy of the image.
//    * We use this canvas only for reading pixel colors.
//    */
//   const prepareCanvas = useCallback((image: HTMLImageElement) => {
//     if (!image.naturalWidth || !image.naturalHeight) {
//       return;
//     }

//     const canvas = document.createElement("canvas");

//     canvas.width = image.naturalWidth;
//     canvas.height = image.naturalHeight;

//     const ctx = canvas.getContext("2d", {
//       willReadFrequently: true,
//     });

//     if (!ctx) return;

//     try {
//       ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);

//       canvasRef.current = canvas;
//     } catch (error) {
//       console.error("Could not prepare image for color sampling:", error);
//     }
//   }, []);

//   /*
//    * Get the color underneath the mouse.
//    */

//   const handleMouseEnter = useCallback(
//     (event: React.MouseEvent<HTMLDivElement>) => {
//       setIsHovered(true);

//       const image = imageRef.current;
//       const canvas = canvasRef.current;

//       if (!image || !canvas) return;

//       const ctx = canvas.getContext("2d", {
//         willReadFrequently: true,
//       });

//       if (!ctx) return;

//       const rect = image.getBoundingClientRect();

//       /*
//        * Mouse position inside displayed image.
//        */
//       const mouseX = event.clientX - rect.left;
//       const mouseY = event.clientY - rect.top;

//       /*
//        * Convert displayed coordinates to
//        * original image coordinates.
//        */
//       const scaleX = image.naturalWidth / rect.width;

//       const scaleY = image.naturalHeight / rect.height;

//       const pixelX = Math.floor(mouseX * scaleX);

//       const pixelY = Math.floor(mouseY * scaleY);

//       /*
//        * Don't sample a single pixel.
//        *
//        * 25 x 25 gives a much smoother result.
//        */
//       const size = 25;

//       const half = Math.floor(size / 2);

//       const startX = Math.max(
//         0,
//         Math.min(image.naturalWidth - size, pixelX - half),
//       );

//       const startY = Math.max(
//         0,
//         Math.min(image.naturalHeight - size, pixelY - half),
//       );

//       try {
//         const pixels = ctx.getImageData(
//           startX,
//           startY,
//           Math.min(size, image.naturalWidth - startX),
//           Math.min(size, image.naturalHeight - startY),
//         ).data;

//         let totalR = 0;
//         let totalG = 0;
//         let totalB = 0;
//         let totalWeight = 0;

//         /*
//          * Average the pixels.
//          */
//         for (let i = 0; i < pixels.length; i += 4) {
//           const r = pixels[i];
//           const g = pixels[i + 1];
//           const b = pixels[i + 2];
//           const a = pixels[i + 3];

//           if (a < 30) continue;

//           /*
//            * Ignore extremely bright pixels.
//            * This prevents small white highlights
//            * from turning the whole overlay white.
//            */
//           const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

//           if (brightness > 245) {
//             continue;
//           }

//           /*
//            * Slightly weight darker pixels more.
//            */
//           const weight = brightness < 120 ? 1.3 : 1;

//           totalR += r * weight;
//           totalG += g * weight;
//           totalB += b * weight;

//           totalWeight += weight;
//         }

//         if (totalWeight === 0) return;

//         let r = Math.round(totalR / totalWeight);

//         let g = Math.round(totalG / totalWeight);

//         let b = Math.round(totalB / totalWeight);

//         /*
//          * Darken the sampled color.
//          *
//          * This keeps white text readable.
//          */
//         const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

//         let darkness = 0.65;

//         if (brightness > 190) {
//           darkness = 0.42;
//         } else if (brightness > 140) {
//           darkness = 0.52;
//         } else if (brightness < 70) {
//           darkness = 0.8;
//         }

//         r = Math.round(r * darkness);
//         g = Math.round(g * darkness);
//         b = Math.round(b * darkness);

//         setOverlayColor(`rgb(${r}, ${g}, ${b})`);
//       } catch (error) {
//         console.error("Unable to read image pixels:", error);
//       }
//     },
//     [],
//   );

//   const handleMouseLeave = useCallback(() => {
//     setIsHovered(false);
//   }, []);

//   return (
//     <div
//       ref={mediaRef}
//       onClick={onClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className="gallery-item group relative cursor-pointer overflow-hidden"
//     >
//       {item.type === "video" ? (
//         <video
//           autoPlay
//           muted
//           loop
//           playsInline
//           preload="metadata"
//           className="
//       gallery-image
//       block
//       h-auto
//       w-full
//       transition-transform
//       duration-700
//       ease-out
//       group-hover:scale-[1.03]
//     "
//         >
//           <source src={item.src} type="video/mp4" />
//         </video>
//       ) : (
//         <Image
//           ref={imageRef}
//           width={1440}
//           height={920}
//           src={item.src}
//           alt={item.title ?? item.meta ?? ""}
//           onLoad={(event) => {
//             prepareCanvas(event.currentTarget);
//           }}
//           className="
//       gallery-image
//       block
//       h-auto
//       w-full
//       transition-transform
//       duration-700
//       ease-out
//       group-hover:scale-[1.03]
//     "
//         />
//       )}

//       {/*
//         Dynamic color overlay.

//         Completely invisible normally.
//         Appears only while hovering.
//       */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           inset-0
//           z-10
//           transition-opacity
//           duration-300
//           ease-out
//         "
//         style={{
//           backgroundColor: overlayColor,
//           opacity: isHovered ? 0.99 : 0,
//         }}
//       />

//       {/* Caption */}
//       {(item.title || item.meta) && (
//         <div
//           className="
//             gallery-caption
//             pointer-events-none
//             absolute
//             inset-0
//             z-20
//             flex
//             items-end
//             p-8
//             text-white
//             transition-all
//             duration-500
//             ease-out
//           "
//           style={{
//             opacity: isHovered ? 1 : 0,
//             transform: isHovered ? "translateY(0)" : "translateY(20px)",
//           }}
//         >
//           <div>
//             {item.title && (
//               <h3 className="text-2xl font-medium">{item.title}</h3>
//             )}

//             {item.meta && (
//               <p className="mt-2 text-base text-white/80">{item.meta}</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// export default function GalleryGrid1({
//   itemsR,
//   itemsL,
// }: {
//   itemsR: GalleryItem[];
//   itemsL: GalleryItem[];
// }) {
//   /*
//    * Left column first, then right column.
//    * GalleryViewer uses this same ordering.
//    */
//   const items = [...itemsL, ...itemsR];

//   const galleryRef = useRef<HTMLDivElement | null>(null);

//   const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);

//   const originRectRef = useRef<DOMRect | null>(null);

//   const [openIndex, setOpenIndex] = useState<number | null>(null);

//   /*
//    * GSAP gallery entrance animation.
//    */
//   useLayoutEffect(() => {
//     const context = gsap.context(() => {
//       const cards = gsap.utils.toArray<HTMLElement>(".gallery-item");

//       const images = gsap.utils.toArray<HTMLElement>(".gallery-image");

//       const prefersReducedMotion = window.matchMedia(
//         "(prefers-reduced-motion: reduce)",
//       ).matches;

//       if (prefersReducedMotion) {
//         gsap.set(cards, {
//           opacity: 1,
//           y: 0,
//         });

//         gsap.set(images, {
//           scale: 1,
//         });

//         return;
//       }

//       gsap.set(cards, {
//         opacity: 0,
//         y: 70,
//       });

//       gsap.set(images, {
//         scale: 1.12,
//       });

//       cards.forEach((card, index) => {
//         const image = images[index];

//         gsap.to(card, {
//           opacity: 1,
//           y: 0,
//           duration: 0.9,
//           ease: "power3.out",
//           scrollTrigger: {
//             trigger: card,
//             start: "top 88%",
//             once: true,
//           },
//         });

//         if (image) {
//           gsap.to(image, {
//             scale: 1,
//             duration: 1.2,
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: card,
//               start: "top 88%",
//               once: true,
//             },
//           });
//         }
//       });
//     }, galleryRef);

//     return () => context.revert();
//   }, []);

//   /*
//    * Open GalleryViewer.
//    */
//   const openImage = useCallback((index: number) => {
//     const mediaEl = mediaRefs.current[index];

//     if (!mediaEl) return;

//     originRectRef.current = mediaEl.getBoundingClientRect();

//     setOpenIndex(index);
//   }, []);

//   /*
//    * Close GalleryViewer.
//    */
//   const closeViewer = useCallback(() => {
//     setOpenIndex(null);
//     originRectRef.current = null;
//   }, []);

//   const [introDone, setIntroDoneState] = useState(false);
//   function setIntroDone(arg0: boolean): void {
//     setIntroDoneState(arg0);
//   }

//   return (
//     <>
//       <IntroAnimation onComplete={() => setIntroDone(true)} />
//       <div
//         ref={galleryRef}
//         className="mx-auto grid max-w-7xl grid-cols-2 gap-x-10"
//       >
//         {/* LEFT COLUMN */}
//         <div className="flex flex-col gap-24">
//           {itemsL.map((item, index) => (
//             <div
//               key={`${item.id}-${index}`}
//               className="relative"
//               style={{
//                 marginTop: getOffset(index, OFFSET_CYCLE_L),
//               }}
//             >
//               <GalleryMedia
//                 item={item}
//                 onClick={() => openImage(index)}
//                 mediaRef={(el) => {
//                   mediaRefs.current[index] = el;
//                 }}
//               />
//             </div>
//           ))}
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="flex flex-col gap-24">
//           {itemsR.map((item, index) => {
//             const globalIndex = itemsL.length + index;

//             return (
//               <div
//                 key={`${item.id}-${index}`}
//                 className="relative"
//                 style={{
//                   marginTop: getOffset(index, OFFSET_CYCLE_R),
//                 }}
//               >
//                 <GalleryMedia
//                   item={item}
//                   onClick={() => openImage(globalIndex)}
//                   mediaRef={(el) => {
//                     mediaRefs.current[globalIndex] = el;
//                   }}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* FULLSCREEN VIEWER */}
//       {openIndex !== null && (
//         <GalleryViewer
//           items={items}
//           initialIndex={openIndex}
//           originRect={originRectRef.current}
//           onClose={closeViewer}
//         />
//       )}
//     </>
//   );
// }
