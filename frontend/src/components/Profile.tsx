export function Profile() {
  const name = "情報太郎";
  const school = "情報科学専門学校";
  const department = "情報セキュリティ学科";
  const bio = "人と場を繋ぐイベント運営を通して、チームで作る体験の可能性を学んでいます。";
  const areas = ["企画", "運営", "広報", "配信", "MC"];

  return (
    <section className="grid gap-8 border-b border-[#e6e1d8] py-12 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-semibold">{name}</h1>
        {(school || department) && (
          <p className="mt-3 text-sm text-[#6b6560]">
            {school}
            {school && department ? " | " : ""}
            {department}
          </p>
        )}
        {areas.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {areas.map((area) => (
              <li key={area} className="rounded bg-[#f3ddd4] px-2 py-1 text-xs">
                {area}
              </li>
            ))}
          </ul>
        )}
      </div>
      {bio && <p className="max-w-sm text-sm leading-7">{bio}</p>}
    </section>
  );
}
