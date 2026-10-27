import React, { useState } from "react";
import classNames from "../../../utils/classNames";
import SectionHeader from "../../ui/SectionHeader";

// FAQ copy ported verbatim from legacy landing/Faq.js.
const FAQS = [
  {
    question: "WHAT IS WONA?",
    answer:
      "WONA is a video streaming entertainment service offering unlimited access to TV shows, movies, live TV channels, and more. Stream and watch on a wide range of devices, just the way you would like to. No commitments, no hassles, and an all-pass to enjoyable satisfying content. Enjoy unlimited access using any of the six (6) available plans: WONA Daily Live, Daily Cinema, Daily Max, 3-day Binge, Weekly Wonder, Monthly Magic.",
  },
  {
    question: "WHAT CAN I WATCH?",
    answer:
      "Movies, Series, TV Shows, Live TV Channels, Live Concerts. To start watching, sign up at WONA and follow the easy steps. Once you're signed in, select one from the available plans. Once you're a subscriber, you can watch from the available content under the plan you're subscribed to.",
  },
  {
    question: "WHERE CAN I WATCH?",
    answer:
      "To start watching, visit WONA or go to the app store on your device, search 'WONA', select and download. Whichever plan you choose, you get the option to choose which device you'd best enjoy your streaming on. Of course, you can choose to modify your plan at any time. The choice is completely yours. You can watch it on several devices, including smartphones, tablets, computers, smart TVs, and media boxes. It's really your call. We aim to provide a great experience – whichever devices you choose.",
  },
  {
    question: "CAN I WATCH WITHOUT DATA OR WIFI?",
    answer:
      "You will need reliable internet connectivity to enjoy WONA. You may use Wi-Fi and/or data. You can also manage how much data consumption you would like to have as you watch. Simply go to Settings -> Video Quality -> choose from any of the options outlined.",
  },
  {
    question: "CAN I CATCH UP OR RECORD TV PROGRAMS?",
    answer:
      "Yes. For Catch up, simply click on the channel of choice -> scroll upwards to choose a previously ran program on the Electronic Programming Guide (EPG) -> click on the program of choice -> Click Yes button to the pop-up prompt -> Enjoy your program Catch Up. To Record, simply click on the channel of choice -> scroll downwards to choose a yet to run program on the Electronic Programming Guide (EPG) -> click on the program of choice -> Click Yes button to the pop-up prompt -> When the program is running, the recording will begin.",
  },
];

/**
 * FaqSection — landing-page FAQ accordion (legacy landing/Faq.js reimagined with
 * the revamp design system: gold question text, gray-1 answers, fluid scaling).
 */
const FaqSection = ({ className = "" }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={classNames("flex flex-col gap-[calc(30/1728*var(--vw))]", className)}>
      <SectionHeader title="Frequently Asked Questions" showArrow={false} />
      {/* --vw floors at 768 → text renders desktop-tiny on phones; max-md: overrides
          scale the FAQ on the 390 mobile comp (--mvw) without touching desktop. */}
      <div className="flex flex-col gap-[calc(16/1728*var(--vw))] pr-[calc(53/1728*var(--vw))] max-md:gap-[calc(12/390*var(--mvw))] max-md:pr-[calc(20/390*var(--mvw))]">
        {FAQS.map((faq, i) => {
          const open = openIndex === i;
          return (
            <div
              key={faq.question}
              className="rounded-[calc(16/1728*var(--vw))] border border-gray-1/10 bg-gray-1/5 max-md:rounded-[calc(14/390*var(--mvw))]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                className="flex w-full cursor-pointer items-center justify-between px-[calc(24/1728*var(--vw))] py-[calc(18/1728*var(--vw))] text-left max-md:px-[calc(18/390*var(--mvw))] max-md:py-[calc(14/390*var(--mvw))]"
              >
                <span className="text-lg font-medium text-brand max-md:text-[calc(14/390*var(--mvw))] max-md:leading-snug">{faq.question}</span>
                <span
                  className={classNames(
                    "text-2xl text-gray-1 transition-transform max-md:text-[calc(20/390*var(--mvw))]",
                    open && "rotate-45"
                  )}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              {open && (
                <p className="px-[calc(24/1728*var(--vw))] pb-[calc(18/1728*var(--vw))] text-base leading-relaxed text-gray-1/90 max-md:px-[calc(18/390*var(--mvw))] max-md:pb-[calc(14/390*var(--mvw))] max-md:text-[calc(13/390*var(--mvw))]">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqSection;
