import { FileText, FileCode, Printer, RefreshCw } from "lucide-react";

const deliverables = [
  { icon: FileText, title: "PDF Drawing Sets", desc: "Print-ready A3/A1 format issue sets for council and construction" },
  { icon: FileCode, title: "DWG / CAD Files", desc: "Editable DWG files and shop drawing packages on request" },
  { icon: RefreshCw, title: "Revision Updates", desc: "Tracked revision cycles with redline updates as agreed" },
  { icon: Printer, title: "Title Block Formatting", desc: "Custom title blocks formatted to your company standards" },
];

const DeliverablesSection = () => {
  return (
    <section id="deliverables" className="section-padding section-warm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gold" />
          <span className="text-gold text-sm font-semibold tracking-[0.2em] uppercase font-display">
            Deliverables
          </span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-foreground">
          What You Receive
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliverables.map((d) => (
            <div
              key={d.title}
              className="bg-card border border-border rounded-sm p-6 text-center"
            >
              <d.icon size={28} className="text-gold mx-auto mb-4" />
              <h3 className="font-display font-bold text-foreground mb-2">{d.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliverablesSection;
