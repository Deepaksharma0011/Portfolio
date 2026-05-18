import { motion } from "framer-motion";
import { Github, Hand, Smile, Plane, Activity, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Hand Gesture Controller",
    icon: Hand,
    description:
      "Developed a real-time hand gesture recognition system using OpenCV and MediaPipe to control system actions through intuitive hand movements, enabling touch-free human-computer interaction.",
    impact: "Enables touch-free, accessible device control",
    tools: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
    color: "from-blue-500 to-indigo-600",
    repo: "https://github.com/Deepaksharma0011/hand-gesture-controller",
  },
  {
    title: "Face Emotion Detection",
    icon: Smile,
    description:
      "Built a deep learning model using CNNs and TensorFlow to detect human emotions from facial expressions in real time, supporting use cases in customer experience and mental wellness analytics.",
    impact: "Powers smarter customer & wellness insights",
    tools: ["Python", "TensorFlow", "Keras", "CNN", "OpenCV"],
    color: "from-indigo-500 to-purple-600",
    repo: "https://github.com/Deepaksharma0011/Face-Emotion-Detection",
  },
  {
    title: "Airline Delay Analysis",
    icon: Plane,
    description:
      "Performed end-to-end data analysis on large-scale airline datasets to uncover delay patterns, root causes, and operational inefficiencies, delivering actionable insights through interactive visualizations.",
    impact: "Drives data-backed operational improvements",
    tools: ["Python", "Pandas", "Matplotlib", "Seaborn", "EDA"],
    color: "from-purple-500 to-pink-600",
    repo: "https://github.com/Deepaksharma0011/Airline-Delay-Analysis",
  },
  {
    title: "Covid-19 Analysis",
    icon: Activity,
    description:
      "Analyzed global COVID-19 datasets to track infection trends, recovery rates, and regional impact, transforming raw pandemic data into clear, actionable visual insights.",
    impact: "Turns pandemic data into clear public-health insights",
    tools: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn", "EDA"],
    color: "from-pink-500 to-rose-600",
    repo: "https://github.com/Deepaksharma0011/COVID-19-Analysis",
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
                whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
                style={{ transformPerspective: 1000 }}
                className="group relative bg-card rounded-2xl border border-border overflow-hidden card-lift shimmer-border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}
                >
                  <project.icon
                    className="text-white/90 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500"
                    size={64}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
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

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full relative z-10 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                    asChild
                  >
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} on GitHub`}
                      className="before:absolute before:inset-0 before:content-[''] before:z-0 before:rounded-2xl"
                    >
                      <Github size={16} className="mr-2" />
                      View on GitHub
                    </a>
                  </Button>
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
