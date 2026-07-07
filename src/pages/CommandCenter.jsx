import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fetchSignalsWithMeta } from "@/lib/scoutyClient";
import PlatformStats from "@/components/dashboard/PlatformStats";
import ConfidenceChart from "@/components/dashboard/ConfidenceChart";
import CategoryRadial from "@/components/dashboard/CategoryRadial";
import SignalTable from "@/components/dashboard/SignalTable";

export default function CommandCenter() {
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignalsWithMeta(200)
      .then((data) => {
        setSignals(data.signals || []);
        setStats(data.stats || null);
      })
      .catch(() => {
        setSignals([]);
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Command Center
          </h1>
          <p className="mt-2 text-slate-500">
            Operational intelligence dashboard — live signals, confidence metrics, and platform activity.
          </p>
        </motion.div>

        <PlatformStats stats={stats} loading={loading} />

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <ConfidenceChart signals={signals} loading={loading} />
          <CategoryRadial signals={signals} loading={loading} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 flex items-center justify-between"
        >
          <h2 className="text-lg font-bold text-slate-900">Signal Registry</h2>
          <span className="text-sm text-slate-400">{signals.length} records</span>
        </motion.div>

        <SignalTable signals={signals} loading={loading} />
      </div>
    </div>
  );
}