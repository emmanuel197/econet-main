import React, { useState } from "react";
import classNames from "../../../utils/classNames";
import { formatPrice, getAccessOptions } from "../../../data/tvodFixtures";
import { m, TitleSummary, RadioDot, PrimaryButton, SecureNote } from "./TvodUi";

/**
 * AccessSheet — WONA "Choose your access" bottom drawer (390×559, design "Comment
 * drawer"): title summary, explainer, Standard / Extended (MOST POPULAR) / Buy options,
 * "Continue · GH₵x". Rendered over a dimmed page; tapping the dim closes it.
 */
const AccessSheet = ({ title, initialOptionId = "standard", onClose, onContinue }) => {
  const options = getAccessOptions(title);
  const [selected, setSelected] = useState(options.some((o) => o.id === initialOptionId) ? initialOptionId : "standard");
  const chosen = options.find((o) => o.id === selected);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-black/60" />
      <div
        className="relative w-full max-w-[430px] rounded-t-[28px] bg-[#5a6280]/80 backdrop-blur-2xl"
        style={{ padding: `${m(14)} ${m(21)} ${m(22)}` }}
      >
        <span className="mx-auto block rounded-full bg-gray-1/50" style={{ width: m(43), height: m(2) }} />
        <div style={{ marginTop: m(16) }}>
          <TitleSummary title={title} tag="TVOD · Choose your access" />
        </div>
        <p className="font-primary text-gray-1/75" style={{ marginTop: m(40), fontSize: m(13) }}>
          Select how long you want access. You have 30 days to start watching from the day you rent.
        </p>

        <div className="flex flex-col" style={{ marginTop: m(22), gap: m(22) }}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setSelected(o.id)}
              className={classNames(
                "relative flex cursor-pointer items-center justify-between rounded-[12px] border text-left",
                selected === o.id ? "border-brand bg-[#21273b]" : "border-gray-1/15 bg-[#313953]"
              )}
              style={{ height: m(64), padding: `0 ${m(15)}` }}
            >
              {o.popular && (
                <span className="absolute rounded-full bg-[#313953] font-primary font-medium text-gray-1 ring-1 ring-gray-1/10" style={{ top: m(-11), right: m(38), padding: `${m(3)} ${m(9)}`, fontSize: m(11) }}>
                  MOST POPULAR
                </span>
              )}
              <span className="flex flex-col" style={{ gap: m(4) }}>
                <span className="font-primary font-semibold text-gray-1" style={{ fontSize: m(14) }}>{o.label}</span>
                <span className="font-primary text-gray-1/60" style={{ fontSize: m(12) }}>{o.detail}</span>
              </span>
              <span className="flex items-center" style={{ gap: m(14) }}>
                <span className="font-primary font-bold text-gray-1" style={{ fontSize: m(16) }}>{formatPrice(o.price)}</span>
                <RadioDot selected={selected === o.id} />
              </span>
            </button>
          ))}
        </div>

        <PrimaryButton style={{ marginTop: m(26) }} onClick={() => onContinue(chosen)}>
          Continue · {formatPrice(chosen.price)}
        </PrimaryButton>
        <div style={{ marginTop: m(12) }}>
          <SecureNote />
        </div>
      </div>
    </div>
  );
};

export default AccessSheet;
