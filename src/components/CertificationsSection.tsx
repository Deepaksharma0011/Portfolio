import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, CheckCircle2 } from "lucide-react";

const certifications = [
  {
    title: "Data Analyst",
    issuer: "Deloitte",
    badge: "🏆",
  },
  {
    title: "Cyber Security",
    issuer: "Deloitte",
    badge: "🔐",
  },
  {
    title: "Desktop Specialist",
    issuer: "Tableau",
    badge: "📊",
  },
  {
    title: "Power BI Certification",
    issuer: "Upflairs",
    badge: "📈",
  },
  {
    title: "Machine Learning",
    issuer: "Upflairs",
    badge: "🤖",
  },
];

const CertificationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="certifications" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Credentials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Certifications
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl">{cert.badge}</div>
                <div>
                  <h4 className="font-semibold text-foreground">{cert.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-primary" />
                    {cert.issuer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
