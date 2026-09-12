import { Container } from "@/components/ui/container";
import { DropIcon, LeafIcon, ShieldIcon, SparklesIcon } from "@/components/ui/icons";

const points = [
  { icon: LeafIcon, label: "Thoughtfully formulated" },
  { icon: DropIcon, label: "Textured-hair focused" },
  { icon: SparklesIcon, label: "Lightweight experience" },
  { icon: ShieldIcon, label: "Responsible beauty" }
];

export function TrustStrip() {
  return (
    <div className="border-b border-mayera-line bg-mayera-paper">
      <Container className="grid grid-cols-2 gap-px py-7 sm:grid-cols-4">
        {points.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-3 px-3 py-3 text-center text-xs font-medium uppercase tracking-[0.11em] text-mayera-espresso/68">
            <Icon className="h-5 w-5 shrink-0 text-mayera-olive" />
            <span>{label}</span>
          </div>
        ))}
      </Container>
    </div>
  );
}
