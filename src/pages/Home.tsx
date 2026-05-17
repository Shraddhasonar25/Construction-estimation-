import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { HardHat, Calculator, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900"
        >
          Build Your Dream with <br />
          <span className="text-emerald-600">Accurate Estimates</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-600 max-w-2xl mx-auto"
        >
          Get instant, reliable construction cost estimates for your projects. 
          Connect with professionals and manage your building journey in one place.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/register" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zinc-50 transition-all">
            Login to Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Calculator className="w-10 h-10 text-emerald-600" />,
            title: "Smart Estimation",
            desc: "Advanced algorithms calculate costs based on area, materials, and current market rates."
          },
          {
            icon: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
            title: "Verified Quality",
            desc: "Choose from different material grades to see how quality impacts your project budget."
          },
          {
            icon: <Clock className="w-10 h-10 text-emerald-600" />,
            title: "Real-time Tracking",
            desc: "Monitor your request status from pending to approved with our intuitive dashboard."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-zinc-600 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Stats/Social Proof */}
      <section className="bg-zinc-900 rounded-3xl p-12 text-white overflow-hidden relative">
        <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-zinc-400 uppercase tracking-widest text-xs font-semibold">Projects Estimated</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-zinc-400 uppercase tracking-widest text-xs font-semibold">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-zinc-400 uppercase tracking-widest text-xs font-semibold">Admin Support</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}
