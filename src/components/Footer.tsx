const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Deepak Sharma. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Built with passion for data ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
