import { TimelineItem } from "./TimelineItem";

export function Timeline() {
  return (
    <section className="py-12">
      <h2 className="mb-10 text-2xl font-semibold">イベントキャリア</h2>
      <div className="flex flex-col gap-10">
        <TimelineItem
          title="いわふぇす"
          role="運営リーダー"
          startDate="2025-11-2"
          endDate="2025-11-4"
          attendance={420}
          areas={["企画", "運営", "MC"]}
          eventTypes={["学園祭", "イベント", "サークル"]}
          photoUrl="/favicon.svg"
        />
        <TimelineItem
          title="夏期 e-sports 学生大会"
          role="機材統括"
          startDate="2025-8-20"
          attendance={30}
          areas={["企画", "運営"]}
          eventTypes={["ゲーム大会", "サークル"]}
          photoUrl="/favicon.svg"
        />
        <TimelineItem
          title="IMGサークル 新歓運営"
          role="広報担当"
          startDate="2025-4-15"
          attendance={20}
          areas={["広報"]}
          eventTypes={["サークル"]}
        />
      </div>
    </section>
  );
}
