import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink } from "lucide-react";

const certifications = [
  {
    title: "Data Analyst",
    issuer: "Deloitte",
    badge: "🏆",
    pdfUrl: "https://drive.google.com/file/d/13vkygRwSHqmj914_gJVw4UhNSxnmQbiT/view?usp=drive_link",
  },
  {
    title: "Cyber Security",
    issuer: "Deloitte",
    badge: "🔐",
    pdfUrl: "https://drive.google.com/file/d/1_a_hqb8w9DE4UJPHordLFwPfe93NTazP/view?usp=drive_link",
  },
  {
    title: "Desktop Specialist",
    issuer: "Tableau",
    badge: "📊",
    pdfUrl: null,
  },
  {
    title: "Power BI Certification",
    issuer: "Upflairs",
    badge: "📈",
    pdfUrl: null,
  },
  {
    title: "Machine Learning",
    issuer: "Upflairs",
    badge: "🤖",
    pdfUrl: null,
  },
];

const viewport = { once: false, margin: "-100px" };

const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
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
            {certifications.map((cert, index) => {
              const CardContent = (
                <>
                  <div className="text-3xl">{cert.badge}</div>
                  <div>
                    <h4 className="font-semibold text-foreground">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-primary" />
                      {cert.issuer}
                    </p>
                  </div>
                </>
              );

              return (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={viewport}
                  transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                >
                  {cert.pdfUrl ? (
                    <a
                      href={cert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      {CardContent}
                      <ExternalLink size={16} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
                      {CardContent}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
