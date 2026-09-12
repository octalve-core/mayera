export function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="rounded-[1.5rem] border border-mayera-line bg-mayera-paper p-5 shadow-[0_8px_30px_rgba(31,26,23,0.035)]"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-mayera-olive">{label}</p><p className="mt-3 font-serif text-3xl tracking-[-0.03em]">{value}</p>{detail ? <p className="mt-2 text-xs text-mayera-espresso/48">{detail}</p> : null}</div>;
}
