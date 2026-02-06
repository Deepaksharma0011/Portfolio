import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Target, TrendingUp, CheckCheck } from "lucide-react";

const reasons = [
  {
    icon: Lightbulb,
    title: "Clear, Easy-to-Understand Insights",
    description:
      "I translate complex data into simple, actionable insights that anyone can understand and act upon.",
  },
  {
    icon: Target,
    title: "Strong Analytical Problem-Solving",
    description:
      "I approach every challenge with a structured, data-driven methodology to find the best solutions.",
  },
  {
    icon: TrendingUp,
    title: "Business-Focused Data Solutions",
    description:
      "Every analysis I perform is aligned with your business goals to drive real, measurable impact.",
  },
  {
    icon: CheckCheck,
    title: "Reliable and Detail-Oriented",
    description:
      "I deliver high-quality work on time, with meticulous attention to accuracy and precision.",
  },
];

const WhyMeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Why Choose Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              What Sets Me Apart
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-5 p-6 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                  <reason.icon className="text-primary-foreground" size={28} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground">{reason.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMeSection;
