import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What AI tools does this work with?",
    a: "Our workflows are tool-agnostic but battle-tested with Windsurf, Cursor, Claude Dev, and GitHub Copilot. We focus on the system, not the specific IDE.",
  },
  {
    q: "Our codebase is legacy/unique - will this work?",
    a: "Yes. Our playbooks include specific 'Context Injection' steps that teach AI how to navigate non-standard architectures and legacy patterns safely.",
  },
  {
    q: "How is this different from better prompting?",
    a: "Prompting is a sentence. Workflow is a system. We provide 6 systematic playbooks that cover the entire SDLC—from debugging to big refactors.",
  },
  {
    q: "What if developers don't adopt?",
    a: "We train 'AI Champions' in your team. Our results (80%+ adoption in 14 days) come from making developers' lives 10x easier, not from management mandates.",
  },
  {
    q: "How fast will we see results?",
    a: "Most clients see their first major efficiency win within 14 days. We guarantee 3x improvement in success rate within 30 days.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 bg-zinc-950/30">
      <div className="container px-4 mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-lg bg-white/5 px-4">
              <AccordionTrigger className="text-lg hover:no-underline hover:text-primary transition-colors">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
