"use client";

import { useState } from "react";
import { getFaqData, getFaqLabel, type FaqItem } from "@/lib/faqData";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface FAQProps {
  /** Optional custom FAQ items list. Defaults to the localized faqData in @/lib/faqData */
  items?: FaqItem[];
  /** Section label displayed in the left column (defaults to localized FAQ label) */
  label?: string;
  /** Section label alias */
  sectionLabel?: string;
  /** Initial open item index, or null to start with all closed (default: 0) */
  defaultOpenIndex?: number | null;
  /** Optional additional CSS classes on the section wrapper */
  className?: string;
  /** HTML id attribute for navigation */
  id?: string;
}

export default function FAQ({
  items,
  label,
  sectionLabel,
  defaultOpenIndex = 0,
  className = "",
  id = "faq",
}: FAQProps) {
  const { locale, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const activeItems = items ?? t.faq?.items ?? getFaqData(locale);
  const activeLabel = "04   / " + (label ?? sectionLabel ?? t.faq?.label ?? getFaqLabel(locale));

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
    setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          const st = (
            window as unknown as {
              ScrollTrigger?: { refresh: () => void };
            }
          ).ScrollTrigger;
          st?.refresh();
        } catch {
          // ignore
        }
      }
    }, 350);
  };

  return (
    <section
      id={id}
      className={`px-5 py-10 md:px-10 lg:px-16 lg:py-36 ${className}`}
    >
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="section-label lg:col-span-3">
          <p className="text-xs uppercase tracking-[0.25em] text-black/45">
            {activeLabel}
          </p>
        </div>

        <div className="disciplines-list lg:col-span-9">
          {activeItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.id}
                className="discipline-item border-t border-black/20"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-content-${index}`}
                  id={`faq-heading-${index}`}
                  className="group flex w-full cursor-pointer items-center justify-between py-5 text-left md:py-7 transition-colors"
                >
                  <div className="flex items-center gap-5 md:gap-10">
                    <span className="text-xs text-black/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3
                      className={`transition-transform duration-500 ease-out group-hover:translate-x-3 ${
                        isOpen
                          ? "translate-x-3 text-black font-medium"
                          : "text-black/85"
                      } ${
                        locale === "ta"
                          ? "text-xl sm:text-2xl md:text-3xl tracking-normal"
                          : locale === "ja"
                          ? "text-xl sm:text-2xl md:text-3.5xl tracking-normal"
                          : "text-2xl md:text-4xl tracking-[-0.03em]"
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:h-10 md:w-10 ${
                      isOpen
                        ? "border-black bg-black text-white"
                        : "border-black/15 text-black/60 group-hover:border-black/40 group-hover:text-black"
                    }`}
                  >
                    <span
                      className={`absolute h-[1.5px] w-3.5 bg-current transition-transform duration-300 md:w-4 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    />
                    <span
                      className={`absolute h-[1.5px] w-3.5 bg-current transition-transform duration-300 md:w-4 ${
                        isOpen ? "-rotate-45" : "rotate-90"
                      }`}
                    />
                  </div>
                </button>

                <div
                  id={`faq-content-${index}`}
                  role="region"
                  aria-labelledby={`faq-heading-${index}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-6 pl-9 pr-4 md:pb-8 md:pl-14">
                      {item.answer ? (
                        <p className="max-w-2xl text-sm text-black/65 md:text-lg">
                          {item.answer}
                        </p>
                      ) : null}

                      {item.list && item.list.length > 0 && (
                        <ul
                          className={`${
                            item.answer ? "mt-4" : ""
                          } max-w-2xl space-y-2 text-sm text-black/65 md:text-lg`}
                        >
                          {item.list.map((listItem, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black/40" />
                              <span>{listItem}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="border-t border-black/20" />
        </div>
      </div>
    </section>
  );
}

export { FAQ };
