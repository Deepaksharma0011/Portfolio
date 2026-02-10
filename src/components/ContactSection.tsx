import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const viewport = { once: false, margin: "-100px" };

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Let's Work Together
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Let's turn your data into actionable insights. I'm available for
              internships, freelance projects, and full-time opportunities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewport}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="bg-card rounded-3xl border border-border p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <a
                href="mailto:ds6739820@gmail.com"
                className="flex items-center gap-4 p-5 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors duration-300 group"
              >
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                  <Mail className="text-primary-foreground" size={22} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    ds6739820@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+916378875936"
                className="flex items-center gap-4 p-5 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors duration-300 group"
              >
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                  <Phone className="text-primary-foreground" size={22} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    +91 6378875936
                  </p>
                </div>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="mailto:ds6739820@gmail.com">
                  <Send size={18} className="mr-2" />
                  Send Me an Email
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={18} className="mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={18} className="mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
