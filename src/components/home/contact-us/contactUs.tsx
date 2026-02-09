import Title from "@/components/typography/title";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import AboutHeroBg from "@/assets/about-us/about-hero-bg.png";
import HeroSection from "@/components/sections/HeroSection";
import ContactForm from "@/components/home/contact-us/ContactForm";

const contactMethods = [
  {
    type: "normal",
    icon: "/images/Frame1.png",
    title: "What We Help With",
    desc: "Help with apartments, villas, and plots — from shortlisting to better group pricing.",
  },
  {
    type: "contact",
    icon: "/images/Frame2.png",
    title: "How to Reach Us",
    details: [
      { icon: <Phone size={20} />, value: "+91 XXXXXXXXXX" },
      { icon: <Mail size={20} />, value: "support@milkekhereedo.com" },
    ],
  },
  {
    type: "normal",
    icon: "/images/Frame3.png",
    title: "Where We Are",
    desc: "Tk Residency , Friends Colony Rd, Friends Colony, Indira Nagar Colony, Miyapur, Hyderabad, Telangana 500049",
  },
];

export default function ConnectWithUs() {
  return (
    <>
      <HeroSection
        backgroundImage={AboutHeroBg}
        badgeText="Contact Us"
        title="Talk to us. Buy smarter."
        highlightText="Save more."
        description="We help buyers come together and unlock better pricing than buying alone."
        headingVariant="h3"
      />

      <section className="w-full bg-white py-16 px-4">
        <div className="mx-auto max-w-7xl">
          {/* TITLE */}
          <div className="flex justify-center mb-10 md:mb-20">
            <Title text="Company" isDrawLine drawLineText="Overview" />
          </div>

          {/* CONTACT CARDS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">

            {contactMethods.map((item, index) => (
              <div
                key={index}
                className="bg-[#EEF4FF] rounded-2xl p-7 flex flex-col justify-between min-h-[260px]"
              >
                <div>
                  <div className="relative flex h-[70px] w-[70px] items-center justify-center rounded-xl overflow-hidden mb-4">
                    <Image
                      src="/images/LightGradient.svg"
                      alt="LightGradient"
                      width={80}
                      height={80}
                      className="absolute inset-0"
                    />
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={35}
                      height={35}
                      className="relative z-10"
                    />
                  </div>

                  <p className="font-bold text-black text-[22px] mb-2">
                    {item.title}
                  </p>

                  {item.type === "normal" && (
                    <p className="text-[#514F6F] text-[17px] leading-relaxed">
                      {item.desc}
                    </p>
                  )}

                  {item.type === "contact" && (
                    <div className="space-y-3">
                      {item.details?.map((d, i) => (
                        <div key={i} className="flex items-center gap-3 text-[17px] text-[#514F6F]">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center">
                            {d.icon}
                          </div>
                          <span className="break-all">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FORM + IMAGE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* FORM */}
            <div className="flex">
              <div className="w-full bg-white border border-[#DDDDDD] rounded-[30px] p-6 md:p-8 flex flex-col justify-center">
                <h3 className="font-bold text-black text-[28px] mb-2">
                  Let’s find the right deal for you
                </h3>
                <p className="text-[#373737] font-medium text-[17px] mb-6">
                  Fill out the form, and we’ll reach out within 24 hours.
                </p>
                <ContactForm />
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative w-full min-h-[280px] sm:min-h-[320px] lg:min-h-full rounded-2xl overflow-hidden">
              <Image
                src="/images/contact.jpg"
                alt="Contact"
                fill
                className="object-cover"
              />
            </div>

          </div>

        </div>
      </section>
    </>
  );
}
