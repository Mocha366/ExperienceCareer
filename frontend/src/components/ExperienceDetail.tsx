import type { Experience } from "./experiences";
import { formatSchedule } from "./experiences";
import { useEffect } from "react";

type ExperienceDetailProps = {
  experience: Experience;
  onClose: () => void;
};

export function ExperienceDetail({ experience, onClose }: ExperienceDetailProps) {
  const {
    title,
    role,
    startDate,
    endDate,
    attendance,
    areas,
    eventTypes,
    photoUrl,
    organizer,
    summary,
    responsibilities,
    challenge,
    outcome,
    learning,
    url,
  } = experience;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 flex justify-center bg-[#2b2b2b]/40 px-4 py-10">
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-detail-title"
        className="max-h-full w-full max-w-5xl overflow-y-auto bg-[#f6f4ef] p-8 text-[#2b2b2b]"
      >
        <div className="flex justify-end">
          <button type="button" onClick={onClose} aria-label="閉じる" className="text-sm">
            ×
          </button>
        </div>
        <p className="text-xs text-[#6b6560]">{formatSchedule(startDate, endDate)}</p>
        <h2 id="experience-detail-title" className="mt-3 text-2xl font-semibold">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[#c56b4a]">{role}</p>
        <p className="mt-2 text-xs text-[#6b6560]">来場者{attendance}人</p>
        {photoUrl && <img src={photoUrl} alt="" className="mt-6 w-full object-cover" />}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          {eventTypes.length > 0 && (
            <>
              <p className="text-[#8a8175]">種類</p>
              <ul className="flex flex-wrap gap-2">
                {eventTypes.map((type) => (
                  <li key={type} className="rounded bg-[#d7e4dc] px-2 py-1">
                    {type}
                  </li>
                ))}
              </ul>
            </>
          )}
          {areas.length > 0 && (
            <>
              <p className="text-[#8a8175]">領域</p>
              <ul className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <li key={area} className="rounded bg-[#f3ddd4] px-2 py-1">
                    {area}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {organizer && (
          <section className="mt-8">
            <h3 className="text-xs text-[#8a8175]">主催団体</h3>
            <p className="mt-2 text-sm leading-7">{organizer}</p>
          </section>
        )}
        {summary && (
          <section className="mt-6">
            <h3 className="text-xs text-[#8a8175]">イベント概要</h3>
            <p className="mt-2 text-sm leading-7">{summary}</p>
          </section>
        )}
        {responsibilities && responsibilities.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xs text-[#8a8175]">担当したこと</h3>
            <ul className="mt-2 list-disc pl-5 text-sm leading-7">
              {responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}
        {challenge && (
          <section className="mt-6">
            <h3 className="text-xs text-[#8a8175]">課題</h3>
            <p className="mt-2 text-sm leading-7">{challenge}</p>
          </section>
        )}
        {outcome && (
          <section className="mt-6">
            <h3 className="text-xs text-[#8a8175]">結果・成果</h3>
            <p className="mt-2 text-sm leading-7">{outcome}</p>
          </section>
        )}
        {learning && (
          <section className="mt-6">
            <h3 className="text-xs text-[#8a8175]">学んだこと</h3>
            <p className="mt-2 text-sm leading-7">{learning}</p>
          </section>
        )}
        {url && (
          <p className="mt-8">
            <a href={url} className="text-sm text-[#c56b4a] underline">
              関連URLを開く
            </a>
          </p>
        )}
      </article>
    </div>
  );
}
