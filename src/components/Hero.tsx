import { ArrowRight, FileText, Languages, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" />
      
      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-accent/80 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">AI-Powered Medical Analysis</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Understand Your{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Medical Reports
              </span>
              {" "}in Simple Language
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Upload your medical reports and prescriptions, get clear explanations in your preferred language. 
              AI-powered analysis that makes healthcare information accessible to everyone.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">PDF & Image Support</span>
              </div>
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                <Languages className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-sm font-medium">Multiple Languages</span>
              </div>
              <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-4 rounded-lg">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
            </div>
            
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={onGetStarted}
                className="group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
            <img 
              src={heroImage} 
              alt="Medical professional with tablet showing health data" 
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
