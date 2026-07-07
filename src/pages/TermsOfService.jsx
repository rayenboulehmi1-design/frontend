import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account, accessing, or using the ScoutyGo platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not access or use the platform.",
  },
  {
    title: "2. Description of Service",
    body: "ScoutyGo is a market intelligence platform that scans public data sources to detect and surface business signals — including real estate developments, business deals, and investment activity — across global markets. The platform provides confidence-scored signals, alert notifications, data export tools, and dashboard analytics. We do not guarantee that any signal will result in a successful business outcome.",
  },
  {
    title: "3. Account Registration",
    body: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must be at least 16 years old to create an account. You agree to notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "4. Subscription and Billing",
    body: "ScoutyGo offers paid subscription plans billed on a monthly or annual basis. Plan pricing is displayed on the platform and may change with notice. Payments are processed securely through Stripe. You can upgrade, downgrade, or cancel your subscription at any time through the Account Overview page. Annual plans receive a 20% discount. Refunds are handled at our discretion in accordance with applicable law. If a payment fails, we may suspend access to paid features until payment is resolved.",
  },
  {
    title: "5. Acceptable Use",
    body: "You agree not to: (a) use the platform for any unlawful purpose; (b) attempt to gain unauthorized access to any part of the platform, its systems, or another user's data; (c) scrape, copy, or redistribute ScoutyGo signal data for commercial purposes outside the platform without authorization; (d) reverse engineer, decompile, or disassemble any part of the platform; (e) use automated tools to overload or disrupt the platform's servers; or (f) share your account credentials with others to bypass subscription limits.",
  },
  {
    title: "6. Intellectual Property",
    body: "ScoutyGo, including its software, design, signal aggregation methodology, AI analysis pipeline, and compiled intelligence data, is owned by ScoutyGo and protected by intellectual property laws. You retain ownership of the personal information you submit. Signal data displayed on the platform is compiled from public sources and is provided for your internal business use. You may not resell, sublicense, or redistribute the signal data as a competing service.",
  },
  {
    title: "7. Data Sources and Accuracy",
    body: "Intelligence signals are derived from public data sources. While we use AI analysis to assess signal confidence, we do not warrant that any signal is accurate, complete, or current. You should independently verify any signal before acting on it. ScoutyGo is not liable for decisions made based on signal data, including but not limited to investment decisions, real estate transactions, or business deals.",
  },
  {
    title: "8. Disclaimers",
    body: "The platform is provided on an 'as is' and 'as available' basis. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components, or that any signal will lead to a successful outcome. Your use of the platform is at your sole risk.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, ScoutyGo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising from your use of or inability to use the platform, even if we have been advised of the possibility of such damages. Our total liability for any claim arising from these terms shall not exceed the amount you paid us in the twelve (12) months preceding the claim.",
  },
  {
    title: "10. Indemnification",
    body: "You agree to indemnify and hold harmless ScoutyGo and its affiliates from any claims, damages, liabilities, costs, and expenses (including legal fees) arising from your use of the platform, your violation of these Terms, or your infringement of any third-party rights.",
  },
  {
    title: "11. Account Termination",
    body: "You may delete your account at any time through the platform. We may suspend or terminate your access if you violate these Terms, fail to pay subscription fees, or engage in activity that we determine is harmful to the platform or other users. Upon termination, your right to use the platform ceases immediately. Provisions that by their nature should survive termination shall remain in effect.",
  },
  {
    title: "12. Modifications to Terms",
    body: "We may update these Terms of Service from time to time. We will notify you of material changes by posting the updated terms on this page and, where appropriate, sending a notification to your registered email address. Your continued use of the platform after changes take effect constitutes acceptance of the updated terms.",
  },
  {
    title: "13. Governing Law",
    body: "These Terms shall be governed by and construed in accordance with applicable law, without regard to conflict of law principles. Any disputes arising from these Terms or your use of the platform shall be resolved through binding arbitration or in the courts of competent jurisdiction, as determined by applicable law.",
  },
  {
    title: "14. Contact Us",
    body: "If you have questions about these Terms of Service, please contact us through the platform's support channels or at the address provided in your account settings.",
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#fcfcfc]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Terms of Service
          </h1>
          <p className="mt-3 text-slate-500">
            Last updated: July 7, 2026
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10 p-5 rounded-2xl bg-blue-50/50 border border-blue-100"
        >
          <p className="text-sm text-slate-600 leading-relaxed">
            These Terms of Service govern your use of the ScoutyGo market intelligence platform.
            Please read them carefully before creating an account or using the service.
          </p>
        </motion.div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{section.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            © 2026 ScoutyGo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}