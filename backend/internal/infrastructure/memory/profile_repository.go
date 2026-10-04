package memory

import "github.com/Mocha366/ExperienceCareer/backend/internal/domain"

type ProfileRepository struct{}

func NewProfileRepository() *ProfileRepository {
	return &ProfileRepository{}
}

func (r *ProfileRepository) FindByUsername(username string) (domain.Profile, bool) {
	profile, ok := profiles[username]
	return profile, ok
}

var profiles = map[string]domain.Profile{
	"tarou": {
		Username:   "tarou",
		Name:       "情報太郎",
		School:     "情報科学専門学校",
		Department: "情報セキュリティ学科",
		Bio:        "人と場を繋ぐイベント運営を通して、チームで作る体験の可能性を学んでいます。",
		Experiences: []domain.Experience{
			{
				ID:         "1",
				Title:      "いわふぇす",
				Role:       "運営リーダー",
				StartDate:  "2025-11-02",
				EndDate:    "2025-11-04",
				Attendance: 420,
				Areas:      []string{"企画", "運営", "MC"},
				EventTypes: []string{"学園祭", "イベント", "サークル"},
				PhotoURL:   "/favicon.svg",
				Organizer:  "情報科学専門学校 学園祭実行委員会",
				Summary:    "学生と地域の方が一緒に楽しめるステージを、企画から当日の進行まで担当しました。",
				Responsibilities: []string{
					"全体スケジュールとWBSの作成",
					"出演団体との進行調整",
					"当日の音響・転換・進行管理",
					"ステージMC",
				},
				Challenge: "出演数が多く、転換時間を含めると予定通りに進まない可能性がありました。",
				Outcome:   "進行表を15分単位で共有し、予定時刻との差を5分以内に収めて全プログラムを完走しました。",
				Learning:  "相手に見える形で情報を揃えることが、チームの判断を速くすることを学びました。",
			},
			{
				ID:         "2",
				Title:      "夏期 e-sports 学生大会",
				Role:       "機材統括",
				StartDate:  "2025-08-20",
				Attendance: 30,
				Areas:      []string{"企画", "運営"},
				EventTypes: []string{"ゲーム大会", "サークル"},
				PhotoURL:   "/favicon.svg",
				Organizer:  "情報科学専門学校 e-sportsサークル",
				Summary:    "学内の対戦大会で、配信と観戦に必要な機材の準備と当日運営を担当しました。",
				Responsibilities: []string{
					"PCモニターの設置",
					"対戦用ネットワークの確認",
					"トラブル時の機材交換",
				},
				Outcome:  "開場から決勝まで、機材トラブルによる中断なく進行できました。",
				Learning: "予備機を表にしておくと、異常が起きてから探す時間を減らせるとわかりました。",
			},
			{
				ID:         "3",
				Title:      "IMGサークル 新歓運営",
				Role:       "広報担当",
				StartDate:  "2025-04-15",
				Attendance: 20,
				Areas:      []string{"広報"},
				EventTypes: []string{"サークル"},
				Summary:    "新入生向けのサークル紹介で、告知文と当日の案内を担当しました。",
				Responsibilities: []string{
					"告知文の作成",
					"当日の受付案内",
				},
				Outcome:  "事前告知から当日までに20人がブースを訪れました。",
				Learning: "伝えたい内容を先に一文へまとめると、案内のブレが減るとわかりました。",
				URL:      "https://qiita.com/Mocha366/items/52f3d6027e2563f93d3d",
			},
		},
	},
}
