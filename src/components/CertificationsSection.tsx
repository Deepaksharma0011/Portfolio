import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const certifications = [
  {
    title: "Data Analyst Professional Certificate",
    issuer: "IBM",
    badge: "🎓",
    pdfUrl: "https://drive.google.com/file/d/1VYO0VrOiYOSRGRicA4AnJhFAfNfoKZ7h/view?usp=sharing",
  },
  {
    title: "Data Analyst Job",
    issuer: "Deloitte",
    badge: "🏆",
    pdfUrl: "https://drive.google.com/file/d/1MJAGMeSvl7tBj4PZS_T9ms82oZT5VtFy/view?usp=sharing",
  },
  {
    title: "Cyber Security",
    issuer: "Deloitte",
    badge: "🔐",
    pdfUrl: "https://drive.google.com/file/d/1QpoHw54_rIdux9csFn2KtNihIaT3FMHb/view?usp=sharing",
  },
  {
    title: "ML, PowerBI & Tableau",
    issuer: "Upflairs",
    badge: "📊",
    pdfUrl: "https://drive.google.com/file/d/1I-pjSg9IqadKoJQXhX3Rm065iiTnsmPs/view?usp=sharing",
  },
  {
    title: "SQL Advance",
    issuer: "HackerRank",
    badge: "🛢️",
    pdfUrl: "https://drive.google.com/file/d/1Vs-FjWldCwfwIh45GeapfWqcNHCaLs3x/view?usp=sharing",
  },
  {
    title: "Software Engineer Intern",
    issuer: "HackerRank",
    badge: "💻",
    pdfUrl: "https://drive.google.com/file/d/13UH9cMt5c7GoTjaRp2WjYNzU9tUaawP_/view?usp=sharing",
  },
  {
    title: "NLP, Deep Learning & GPT Technologies",
    issuer: "SkillOceans",
    badge: "🧠",
    pdfUrl: "https://drive.google.com/file/d/1eq-ZoAfudla5mOELKApYC_9O37tmv8gm/view?usp=sharing",
  },
  {
    title: "Power BI Micro Course",
    issuer: "SkillCourse",
    badge: "📈",
    pdfUrl: "https://drive.google.com/file/d/1jyw4MpcdnFFYqH0gqT_25mnVzDU_wYIz/view?usp=sharing",
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
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewport}
                transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col gap-3 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="text-3xl"
                    animate={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.3, ease: "easeInOut" }}
                  >
                    {cert.badge}
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-foreground">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-primary" />
                      {cert.issuer}
                    </p>
                  </div>
                </div>
                {cert.pdfUrl && (
                  <Button variant="outline" size="sm" asChild className="w-full mt-1">
                    <a
                      href={cert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View Certificate
                      <ExternalLink size={14} />
                    </a>
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
