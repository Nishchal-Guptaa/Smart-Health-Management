
import { Card } from "@/components/ui/card";

const StatsSection = () => {
  const stats = [
    {
      number: "99.9%",
      label: "Uptime Guarantee",
      description: "Always available when you need care",
      color: "text-green-600"
    },
    {
      number: "< 2 min",
      label: "Average Response Time",
      description: "Quick access to healthcare services",
      color: "text-blue-600"
    },
    {
      number: "500+",
      label: "Partner Hospitals",
      description: "Extensive healthcare network",
      color: "text-purple-600"
    },
    {
      number: "24/7",
      label: "Emergency Support",
      description: "Round-the-clock assistance",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className="text-gray-900 font-semibold mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">
                {stat.description}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
