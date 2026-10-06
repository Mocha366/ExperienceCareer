-- 再実行しやすいように同じ username を消してから入れる（任意）
DELETE FROM profiles WHERE username = 'tarou';

INSERT INTO profiles (username, name, school, department, bio)
VALUES (
  'tarou',
  '情報太郎',
  '情報科学専門学校',
  '情報セキュリティ学科',
  '人と場を繋ぐイベント運営を通して、チームで作る体験の可能性を学んでいます。'
);

-- いま入れた tarou の id を使う
INSERT INTO experiences (
  profile_id, title, role, start_date, end_date, attendance,
  photo_url, organizer, summary, challenge, outcome, learning, url
)
SELECT id, 'いわふぇす', '運営リーダー', '2025-11-02', '2025-11-04', 420,
  '/favicon.svg', '情報科学専門学校 学園祭実行委員会',
  '学生と地域の方が一緒に楽しめるステージを、企画から当日の進行まで担当しました。',
  '出演数が多く、転換時間を含めると予定通りに進まない可能性がありました。',
  '進行表を15分単位で共有し、予定時刻との差を5分以内に収めて全プログラムを完走しました。',
  '相手に見える形で情報を揃えることが、チームの判断を速くすることを学びました。',
  ''
FROM profiles WHERE username = 'tarou';

INSERT INTO experiences (
  profile_id, title, role, start_date, end_date, attendance,
  photo_url, organizer, summary, challenge, outcome, learning, url
)
SELECT id, '夏期 e-sports 学生大会', '機材統括', '2025-08-20', NULL, 30,
  '/favicon.svg', '情報科学専門学校 e-sportsサークル',
  '学内の対戦大会で、配信と観戦に必要な機材の準備と当日運営を担当しました。',
  '',
  '開場から決勝まで、機材トラブルによる中断なく進行できました。',
  '予備機を表にしておくと、異常が起きてから探す時間を減らせるとわかりました。',
  ''
FROM profiles WHERE username = 'tarou';

INSERT INTO experiences (
  profile_id, title, role, start_date, end_date, attendance,
  photo_url, organizer, summary, challenge, outcome, learning, url
)
SELECT id, 'IMGサークル 新歓運営', '広報担当', '2025-04-15', NULL, 20,
  '', '',
  '新入生向けのサークル紹介で、告知文と当日の案内を担当しました。',
  '',
  '事前告知から当日までに20人がブースを訪れました。',
  '伝えたい内容を先に一文へまとめると、案内のブレが減るとわかりました。',
  'https://qiita.com/Mocha366/items/52f3d6027e2563f93d3d'
FROM profiles WHERE username = 'tarou';

-- いわふぇす
INSERT INTO experience_areas (experience_id, area)
SELECT e.id, a.area
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES ('企画'), ('運営'), ('MC')) AS a(area)
WHERE p.username = 'tarou' AND e.title = 'いわふぇす';

INSERT INTO experience_event_types (experience_id, event_type)
SELECT e.id, t.event_type
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES ('学園祭'), ('イベント'), ('サークル')) AS t(event_type)
WHERE p.username = 'tarou' AND e.title = 'いわふぇす';

INSERT INTO experience_responsibilities (experience_id, sort_order, body)
SELECT e.id, r.sort_order, r.body
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES
  (0, '全体スケジュールとWBSの作成'),
  (1, '出演団体との進行調整'),
  (2, '当日の音響・転換・進行管理'),
  (3, 'ステージMC')
) AS r(sort_order, body)
WHERE p.username = 'tarou' AND e.title = 'いわふぇす';

-- 夏期 e-sports
INSERT INTO experience_areas (experience_id, area)
SELECT e.id, a.area
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES ('企画'), ('運営')) AS a(area)
WHERE p.username = 'tarou' AND e.title = '夏期 e-sports 学生大会';

INSERT INTO experience_event_types (experience_id, event_type)
SELECT e.id, t.event_type
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES ('ゲーム大会'), ('サークル')) AS t(event_type)
WHERE p.username = 'tarou' AND e.title = '夏期 e-sports 学生大会';

INSERT INTO experience_responsibilities (experience_id, sort_order, body)
SELECT e.id, r.sort_order, r.body
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES
  (0, 'PCモニターの設置'),
  (1, '対戦用ネットワークの確認'),
  (2, 'トラブル時の機材交換')
) AS r(sort_order, body)
WHERE p.username = 'tarou' AND e.title = '夏期 e-sports 学生大会';

-- IMG 新歓
INSERT INTO experience_areas (experience_id, area)
SELECT e.id, a.area
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES ('広報')) AS a(area)
WHERE p.username = 'tarou' AND e.title = 'IMGサークル 新歓運営';

INSERT INTO experience_event_types (experience_id, event_type)
SELECT e.id, t.event_type
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES ('サークル')) AS t(event_type)
WHERE p.username = 'tarou' AND e.title = 'IMGサークル 新歓運営';

INSERT INTO experience_responsibilities (experience_id, sort_order, body)
SELECT e.id, r.sort_order, r.body
FROM experiences e
JOIN profiles p ON p.id = e.profile_id
CROSS JOIN (VALUES
  (0, '告知文の作成'),
  (1, '当日の受付案内')
) AS r(sort_order, body)
WHERE p.username = 'tarou' AND e.title = 'IMGサークル 新歓運営';
