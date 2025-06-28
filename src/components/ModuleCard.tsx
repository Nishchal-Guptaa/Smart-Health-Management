
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}

interface ModuleCardProps {
  module: Module;
  index: number;
  onClick: () => void;
}

const ModuleCard = ({ module, index, onClick }: ModuleCardProps) => {
  const { title, description, icon: Icon, color, features } = module;
  
  return (
    <Card 
      className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer glass-card animate-fade-in group"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <Badge variant="secondary" className="text-xs">
            AI-Powered
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-medical-blue transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-medical-green rounded-full"></div>
              <span className="text-sm text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* <Button 
          className="w-full medical-gradient text-white group-hover:shadow-lg transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Explore Now
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default ModuleCard;
