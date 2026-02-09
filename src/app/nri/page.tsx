"use client";

import NRIFAQ from "@/components/nri/nriFaqs";

export default function NRIPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          NRI <span className="text-[#1C4692]">Support & Services</span>
        </h1>

        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Helping You Invest in Indian Real Estate — From Anywhere in the World
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-gray-600 leading-7 text-center">
          At MilkeKhareedo, we understand that buying or managing property in
          India as a Non-Resident Indian (NRI) can be complex — from legal
          compliance and documentation to remote coordination and financial
          planning. Our dedicated NRI Support Team provides end-to-end solutions
          designed for NRIs living abroad — with transparency, trust and local
          expertise.
        </p>
      </section>

      {/* What We Offer */}
      <section className="bg-[#F8FAFF] py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <SectionCard
            title="Tailored Property Search & Acquisition Support"
            description="We help NRIs find, evaluate and acquire property in India — whether residential, commercial or investment-grade real estate."
            content={[
              "Hand-picked property recommendations",
              "Market trends and location insights",
              "Project / Builder verification",
              "RERA & regulatory compliance checks",
            ]}
          />

          <SectionCard
            title="Legal, Documentation & Compliance Assistance"
            description="We ensure every transaction is legally sound and fully compliant."
            content={[
              "Title verification",
              "Sale agreement & sale deed preparation",
              "Power of Attorney (PoA) services",
              "Mutation, registration & transfer procedures",
              "Statutory compliance checks",
            ]}
          />

          <SectionCard
            title="Financial Advisory & Transaction Support"
            description="We guide NRIs through financial frameworks and overseas investment practices."
            content={[
              "NRE/NRO account assistance",
              "Foreign remittance & RBI compliance",
              "Tax planning guidance",
              "Home loan & NRI financing support",
            ]}
          />

          <SectionCard
            title="Virtual Experience & Remote Coordination"
            description="Distance shouldn’t be a barrier to property investment."
            content={[
              "Live virtual property tours",
              "Video walkthrough & progress updates",
              "Online consultations",
              "Dedicated NRI helpline",
            ]}
          />

          <SectionCard
            title="Property Management & After-Sale Support"
            description="We offer complete property care so you can relax while we manage everything."
            content={[
              "Tenant screening & rental management",
              "Rent collection & remittance",
              "Maintenance & bill payments",
              "Vacant property inspection & security",
              "Tax documentation support",
            ]}
          />
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose <span className="text-[#1C4692]">MilkeKhareedo</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            title="Local Expertise + Global Reach"
            desc="Our team combines local Hyderabad real estate knowledge with global NRI expectations."
          />

          <FeatureCard
            title="Complete Transparency"
            desc="From pricing to documentation and updates — we keep you informed at every step."
          />

          <FeatureCard
            title="Dedicated Personalized Assistance"
            desc="You get a single point of contact and tailored investment solutions."
          />

          <FeatureCard
            title="Remote-Friendly Processes"
            desc="Participate in your real estate journey from your home country with minimal travel."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1C4692] text-white py-20 text-center">
        <h3 className="text-3xl font-semibold mb-4">Get Started Today</h3>

        <p className="max-w-xl mx-auto text-white/80">
          Connect with our NRI Support Team to explore verified properties or
          schedule a free consultation.
        </p>

        <div className="mt-6 space-y-2">
          <p>Email: nri@milkeKhareedo.com</p>
          <p>Call / WhatsApp: +91-XXXXXXXXXX</p>
        </div>
      </section>

      {/* FAQ */}
      <NRIFAQ />
    </div>
  );
}

function SectionCard({ title, description, content }: any) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border">
      <h3 className="text-xl font-semibold mb-3 text-[#1C4692]">{title}</h3>

      <p className="text-gray-600 mb-4">{description}</p>

      <ul className="space-y-2 text-gray-600">
        {content.map((item: string, index: number) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function FeatureCard({ title, desc }: any) {
  return (
    <div className="border rounded-xl p-6 hover:shadow-md transition">
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
