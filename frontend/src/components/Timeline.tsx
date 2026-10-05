import { useState } from "react";
import { ExperienceDetail } from "./ExperienceDetail";
import { TimelineItem } from "./TimelineItem";
import type { Experience } from "./experiences";

type Props = {
  experiences: Experience[];
};

export function Timeline({ experiences }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = experiences.find((experience) => experience.id === selectedId);

  return (
    <section className="py-12">
      <h2 className="mb-10 text-2xl font-semibold">イベントキャリア</h2>
      <div className="flex flex-col gap-10">
        {experiences.map((experience) => (
          <TimelineItem
            key={experience.id}
            experience={experience}
            onOpen={() => setSelectedId(experience.id)}
          />
        ))}
      </div>
      {selected && <ExperienceDetail experience={selected} onClose={() => setSelectedId(null)} />}
    </section>
  );
}
