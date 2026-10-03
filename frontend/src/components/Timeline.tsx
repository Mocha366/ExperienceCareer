import { useState } from "react";
import { ExperienceDetail } from "./ExperienceDetail";
import { TimelineItem } from "./TimelineItem";
import { experiences } from "./experiences";

export function Timeline() {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const selected = experiences.find((experience) => experience.title === selectedTitle);

  return (
    <section className="py-12">
      <h2 className="mb-10 text-2xl font-semibold">イベントキャリア</h2>
      <div className="flex flex-col gap-10">
        {experiences.map((experience) => (
          <TimelineItem
            key={experience.title}
            experience={experience}
            onOpen={() => setSelectedTitle(experience.title)}
          />
        ))}
      </div>
      {selected && (
        <ExperienceDetail experience={selected} onClose={() => setSelectedTitle(null)} />
      )}
    </section>
  );
}
