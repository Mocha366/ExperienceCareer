import type { Experience } from "./experiences";
import { formatSchedule } from "./experiences";

type TimelineItemProps = {
  experience: Experience;
  onOpen: () => void;
};

export function TimelineItem({ experience, onOpen }: TimelineItemProps) {
  const { title, role, startDate, endDate, attendance, areas, eventTypes, photoUrl } = experience;

  return (
    <article className="grid grid-cols-[1rem_1fr] gap-6 border-b border-[#e6e1d8] pb-8 md:grid-cols-[1rem_1fr_8rem]">
      <span className="mt-2 size-2 rounded-full border border-[#d07a4a]" />
      <button type="button" onClick={onOpen} className="text-left">
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-[#c56b4a]">{role}</p>
        <p className="mt-2 text-xs text-[#6b6560]">
          {formatSchedule(startDate, endDate)} / 来場者{attendance}人
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
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
        </div>
      </button>
      {photoUrl && (
        <button type="button" onClick={onOpen} className="col-start-2 md:col-start-3">
          <img src={photoUrl} alt="" className="h-24 w-32 object-cover md:col-start-3" />
        </button>
      )}
    </article>
  );
}
