type Advice = {
  title: string;
  message: string;
  priority: string;
};

type AdviceCardsProps = {
  advice: Advice[];
};

export default function AdviceCards({ advice }: AdviceCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {advice.map((item, index) => (
        <article key={`${item.title}-${index}`} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-zinc-900">{item.title}</h3>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {item.priority}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{item.message}</p>
        </article>
      ))}
    </section>
  );
}