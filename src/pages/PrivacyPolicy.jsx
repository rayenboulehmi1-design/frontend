import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us when you create an account, including your name, email address, and password. When you subscribe to a paid plan, your payment information is processed securely by Stripe; we do not store your full card details on our servers. We also collect usage data such as your saved opportunities, alert preferences, and dashboard settings to provide and improve our services.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to create and manage your account, process payments and subscriptions, deliver intelligence signals and alert notifications, personalize your dashboard experience, respond to your support requests, and detect and prevent fraud or abuse of the platform.",
  },
  {
    title: "3. Intelligence Data Sources",
    body: "ScoutyGo aggregates intelligence signals exclusively from public sources, including government registries, planning portals, procurement databases, company filings, job boards, and press releases. We do not use private, confidential, or illegally obtained data. All signals are derived from publicly available information and processed through our AI analysis pipeline.",
  },
  {
    title: "4. Data Sharing and Disclosure",
    body: "We do not sell your personal information. We share data only with service providers who help us operate the platform (such as Stripe for payment processing and our cloud infrastructure providers), when required by law or legal process, or in connection with a merger, acquisition, or asset sale. All third-party providers are bound by confidentiality and data protection obligations.",
  },
  {
    title: "5. Data Security",
    body: "We implement industry-standard security measures including encrypted data transmission (TLS), secure password hashing, and role-based access controls. Payment data is handled exclusively by Stripe, which is PCI DSS Level 1 certified. Despite these measures, no system can guarantee absolute security, and we cannot ensure the security of information transmitted over the internet.",
  },
  {
    title: "6. Your Rights and Choices",
    body: "You have the right to access, correct, or delete your personal information. You can update your profile and manage your preferences from the Settings page. You may cancel your subscription at any time through the Account Overview page. To request full data deletion, contact us through the platform. If you are located in the European Economic Area or California, you have additional rights under GDPR and CCPA respectively.",
  },
  {
    title: "7. Data Retention",
    body: "We retain your account information for as long as your account is active. After account deletion, we may retain certain data for a limited period to comply with legal obligations, resolve disputes, and enforce our agreements. Anonymous, aggregated data that cannot identify you may be retained indefinitely for analytics purposes.",
  },
  {
    title: "8. Cookies and Tracking",
    body: "We use essential cookies to maintain your authentication session and remember your preferences. We do not use cookies for third-party advertising. You can control cookies through your browser settings, but disabling essential cookies may prevent you from logging in or using the platform.",
  },
  {
    title: "9. International Data Transfers",
    body: "ScoutyGo operates globally and your information may be transferred to and processed in countries other than your country of residence, including the United States. We take appropriate measures to ensure your data is protected in accordance with this Privacy Policy and applicable law.",
  },
  {
    title: "10. Children's Privacy",
    body: "ScoutyGo is not directed to children under 16, and we do not knowingly collect personal information from children under 16. If you believe we have collected such information, please contact us so we can delete it promptly.",
  },
  {
    title: "11. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page and, where appropriate, sending a notification to your registered email address. Your continued use of the platform after changes take effect constitutes acceptance of the updated policy.",
  },
  {
    title: "12. Contact Us",
    body: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us through the platform's support channels or at the address provided in your account settings.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#fcfcfc]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Privacy Policy
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
            This Privacy Policy explains how ScoutyGo collects, uses, and protects your information
            when you use our market intelligence platform. By creating an account and using ScoutyGo,
            you agree to the practices described below.
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