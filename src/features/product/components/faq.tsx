"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ChevronDownIcon } from "@/components/ui/icons";

const faqs = [
  ["Who is Mayéra Hair for?", "Mayéra's founding hair range is designed around textured-hair routines, including natural, relaxed, loc'd and protective-style care. Individual needs and sensitivities still vary."],
  ["Is this a medical hair-loss treatment?", "No. Mayéra is cosmetic hair wellness. If you are experiencing sudden, severe or unexplained hair loss, speak with an appropriate healthcare professional."],
  ["How often should I use the oil?", "Apply a small amount 2–3 times weekly or as your routine requires. The goal is consistent care without unnecessary buildup."],
  ["Can I use it with braids or other protective styles?", "Yes. The pointed-nozzle format is intended to make section-by-section scalp application easier during protective styles."],
  ["Where do you deliver?", "Mayéra is launching with nationwide Nigeria delivery. Available delivery methods and charges are shown at checkout."]
];

export function ProductFaq() {
  const [open, setOpen] = useState(0);
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div><p className="text-xs font-semibold uppercase tracking-luxury text-mayera-olive">Questions</p><h2 className="mt-5 font-serif text-4xl sm:text-5xl">Before you begin.</h2></div>
          <div className="divide-y divide-mayera-line border-y border-mayera-line">
            {faqs.map(([question, answer], index) => (
              <div key={question}>
                <button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left"><span className="font-serif text-xl sm:text-2xl">{question}</span><ChevronDownIcon className={`h-5 w-5 shrink-0 transition ${open === index ? "rotate-180" : ""}`} /></button>
                {open === index ? <p className="max-w-2xl pb-6 text-sm leading-7 text-mayera-espresso/62">{answer}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
