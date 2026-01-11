import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export function ROICalculator() {
  const [teamSize, setTeamSize] = useState([50]);
  const [spendPerUser, setSpendPerUser] = useState([5000]);
  const [adoptionRate, setAdoptionRate] = useState([15]);

  const totalMonthlySpend = (teamSize[0] * spendPerUser[0]) + (teamSize[0] * 7.5 * 1000 * 4); // License + Wasted Hours (7.5h/week @ ₹1000/hr)
  const wastedSpend = totalMonthlySpend * ((100 - adoptionRate[0]) / 100);
  const usedSpend = totalMonthlySpend - wastedSpend;

  const data = [
    { name: "Wasted", value: wastedSpend, color: "#ef4444" },
    { name: "Utilized", value: usedSpend, color: "#22c55e" },
  ];

  return (
    <section className="py-24 bg-zinc-950/50">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center max-w-6xl mx-auto">
          
          <div className="flex-1 w-full space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Calculate Your <span className="text-red-500">Wasted Spend</span>
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-gray-300 font-medium">Team Size</label>
                  <span className="text-primary font-bold">{teamSize} Employees</span>
                </div>
                <Slider
                  value={teamSize}
                  onValueChange={setTeamSize}
                  min={5}
                  max={200}
                  step={1}
                  className="py-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-gray-300 font-medium">Avg. AI Tool Spend / User</label>
                  <span className="text-primary font-bold">₹{spendPerUser}/mo</span>
                </div>
                <Slider
                  value={spendPerUser}
                  onValueChange={setSpendPerUser}
                  min={1000}
                  max={20000}
                  step={500}
                  className="py-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-gray-300 font-medium">Current Adoption Rate</label>
                  <span className="text-red-400 font-bold">{adoptionRate}%</span>
                </div>
                <Slider
                  value={adoptionRate}
                  onValueChange={setAdoptionRate}
                  min={0}
                  max={100}
                  step={5}
                  className="py-2"
                />
              </div>
            </div>
          </div>

          <Card className="flex-1 w-full bg-black/40 border-white/10 p-8 backdrop-blur-sm">
            <h3 className="text-center text-gray-400 mb-4">Monthly Budget Analysis</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center space-y-2 mt-4">
              <div className="text-sm text-gray-400">You are wasting</div>
              <div className="text-4xl font-bold text-red-500">₹{wastedSpend.toLocaleString()}</div>
              <div className="text-sm text-gray-400">every single month</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
