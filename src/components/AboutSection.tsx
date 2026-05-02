import { motion } from "framer-motion";
import { GraduationCap, Target, Sparkles } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const viewport = { once: false, margin: "-100px" };

const AboutSection = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
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
              About Me
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Get to Know Me
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={viewport}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <motion.div
                className="relative"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-2xl -z-10" />
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-primary/20 shadow-xl">
                  <img 
                    src={profilePhoto} 
                    alt="Deepak Sharma - Data Analyst & AI Engineer" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-xl flex items-center justify-center shadow-glow"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="text-primary-foreground" size={40} />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              <p className="text-muted-foreground text-lg leading-relaxed">
                I am <span className="text-foreground font-semibold">Deepak Sharma</span>, 
                an AI & Data Science undergraduate with hands-on experience in data analysis, 
                machine learning, and data visualization. I specialize in transforming raw 
                data into meaningful insights using Python, SQL, Excel, Power BI, and Tableau.
              </p>

              <p className="text-muted-foreground text-lg leading-relaxed">
                My passion lies in helping businesses make smarter decisions through 
                data-driven solutions. Whether it's building predictive models or creating 
                compelling visualizations, I bring a unique blend of technical skills and 
                business acumen to every project.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Education</h4>
                    <p className="text-sm text-muted-foreground">
                      B.Tech in AI & Data Science
                    </p>
                    <p className="text-xs text-muted-foreground">Expected 2027</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">CGPA</h4>
                    <p className="text-sm text-muted-foreground">8.44 / 10</p>
                    <p className="text-xs text-muted-foreground">Current Score</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
