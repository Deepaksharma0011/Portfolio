import { motion } from "framer-motion";
import { 
  BarChart3, 
  Brain, 
  Cloud, 
  MessageSquare, 
  Database, 
  LineChart 
} from "lucide-react";

const skillCategories = [
  {
    title: "Data Analysis",
    icon: BarChart3,
    skills: ["Python", "SQL", "Excel", "Statistics"],
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "Data Visualization",
    icon: LineChart,
    skills: ["Power BI", "Tableau"],
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Machine Learning",
    icon: Brain,
    skills: ["Scikit-learn", "TensorFlow"],
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Cloud Platforms",
    icon: Cloud,
    skills: ["AWS", "Azure"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["MySQL", "PostgreSQL", "MongoDB"],
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Soft Skills",
    icon: MessageSquare,
    skills: ["Communication", "Critical Thinking", "Presentation"],
    color: "from-orange-500 to-amber-500",
  },
];

const viewport = { once: false, margin: "-100px" };

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 md:py-32">
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
              My Expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Skills & Technologies
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              A comprehensive toolkit for turning complex data into actionable business insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewport}
                transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/50 card-lift shimmer-border"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500 shadow-lg`}
                >
                  <category.icon className="text-white" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
