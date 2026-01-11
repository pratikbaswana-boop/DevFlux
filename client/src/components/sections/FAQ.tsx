import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How fast will we see results?",
    a: "Most clients see their first major efficiency win within 7 days. Our 14-day sprint is designed to get you fully operational quickly.",
  },
  {
    q: "Do you replace our current team?",
    a: "Absolutely not. We empower your existing team to do 10x more. We build the 'Iron Man suit' for your employees.",
  },
  {
    q: "Is our data secure?",
    a: "Security is our top priority. We only use enterprise-grade tools with SOC2 compliance and zero-retention policies where necessary.",
  },
  {
    q: "What if we don't like the results?",
    a: "We offer a 100% satisfaction guarantee. If you don't see value in the first 30 days, we'll refund your audit fee.",
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
