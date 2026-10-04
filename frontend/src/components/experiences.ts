export type Experience = {
  title: string;
  role: string;
  startDate: string;
  endDate?: string;
  attendance: number;
  areas: string[];
  eventTypes: string[];
  photoUrl?: string;
  organizer?: string;
  summary?: string;
  responsibilities?: string[];
  challenge?: string;
  outcome?: string;
  learning?: string;
  url?: string;
};

export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function formatSchedule(startDate: string, endDate?: string) {
  if (!endDate || endDate === startDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)}~${formatDate(endDate)}`;
}

export const experiences: Experience[] = [
  {
    title: "いわふぇす",
    role: "運営リーダー",
    startDate: "2025-11-2",
    endDate: "2025-11-4",
    attendance: 420,
    areas: ["企画", "運営", "MC"],
    eventTypes: ["学園祭", "イベント", "サークル"],
    photoUrl: "/favicon.svg",
    organizer: "情報科学専門学校 学園祭実行委員会",
    summary: "学生と地域の方が一緒に楽しめるステージを、企画から当日の進行まで担当しました。",
    responsibilities: [
      "全体スケジュールとWBSの作成",
      "出演団体との進行調整",
      "当日の音響・転換・進行管理",
      "ステージMC",
    ],
    challenge: "出演数が多く、転換時間を含めると予定通りに進まない可能性がありました。",
    outcome:
      "進行表を15分単位で共有し、予定時刻との差を5分以内に収めて全プログラムを完走しました。",
    learning: "相手に見える形で情報を揃えることが、チームの判断を速くすることを学びました。",
  },
  {
    title: "夏期 e-sports 学生大会",
    role: "機材統括",
    startDate: "2025-8-20",
    attendance: 30,
    areas: ["企画", "運営"],
    eventTypes: ["ゲーム大会", "サークル"],
    photoUrl: "/favicon.svg",
    organizer: "情報科学専門学校 e-sportsサークル",
    summary: "学内の対戦大会で、配信と観戦に必要な機材の準備と当日運営を担当しました。",
    responsibilities: ["PCモニターの設置", "対戦用ネットワークの確認", "トラブル時の機材交換"],
    outcome: "開場から決勝まで、機材トラブルによる中断なく進行できました。",
    learning: "予備機を表にしておくと、異常が起きてから探す時間を減らせるとわかりました。",
  },
  {
    title: "IMGサークル 新歓運営",
    role: "広報担当",
    startDate: "2025-4-15",
    attendance: 20,
    areas: ["広報"],
    eventTypes: ["サークル"],
    summary: "新入生向けのサークル紹介で、告知文と当日の案内を担当しました。",
    responsibilities: ["告知文の作成", "当日の受付案内"],
    outcome: "事前告知から当日までに20人がブースを訪れました。",
    learning: "伝えたい内容を先に一文へまとめると、案内のブレが減るとわかりました。",
    url: "https://qiita.com/Mocha366/items/52f3d6027e2563f93d3d",
  },
];
