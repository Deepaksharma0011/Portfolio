import { motion } from "framer-motion";
import { ExternalLink, Github, Shield, Newspaper, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Fake News Detector",
    icon: Newspaper,
    description:
      "Built an NLP-based system using Python and spaCy to detect fake news using real-world datasets (LIAR, FakeNewsNet), helping improve content trust and brand credibility.",
    impact: "Improves content trust & brand credibility",
    tools: ["Python", "spaCy", "NLP", "Machine Learning"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Fraud Detection System",
    icon: Shield,
    description:
      "Developed a machine learning model trained on 6.3 million transactions to identify fraudulent activity and reduce financial risk.",
    impact: "Reduces financial risk through early detection",
    tools: ["Python", "Scikit-learn", "Pandas", "Data Analysis"],
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Personal AI Chatbot",
    icon: MessageCircle,
    description:
      "Created an NLP-powered chatbot to improve user interaction and automate responses, enhancing customer engagement.",
    impact: "Automates responses & improves engagement",
    tools: ["Python", "NLP", "TensorFlow", "API Integration"],
    color: "from-purple-500 to-pink-600",
  },
];

const viewport = { once: false, margin: "-100px" };

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 md:py-32 bg-secondary/30">
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
              My Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Featured Projects
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Real-world solutions that demonstrate my ability to solve business problems with data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewport}
                transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
                >
                  <project.icon
                    className="text-white/90 group-hover:scale-110 transition-transform duration-500"
                    size={64}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="bg-primary/5 rounded-lg p-3 mb-4">
                    <p className="text-sm text-primary font-medium">
                      💡 {project.impact}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <Github size={16} className="mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
