import FAQSCard from "../home/hero/faqs/faqsCard";

export default function NRIFAQ() {
  const arr = [
    {
      id: 1,
      title: "Can NRIs buy property in India?",
      desciption:
        "Yes. NRIs can legally purchase residential and commercial properties in India as per RBI guidelines. Agricultural land, plantation property and farmhouses are not permitted unless inherited.",
    },
    {
      id: 2,
      title: "How does MilkeKhareedo help NRIs buy property remotely?",
      desciption:
        "MilkeKhareedo provides end-to-end remote support, including virtual property tours, builder verification, legal documentation, Power of Attorney assistance and continuous coordination — so you can invest without traveling to India.",
    },
    {
      id: 3,
      title: "Do NRIs need to visit India to complete property registration?",
      desciption:
        "No. NRIs can complete the process using a registered Power of Attorney (PoA). Our team assists with drafting, attestation and execution of PoA through Indian embassies or consulates.",
    },
    {
      id: 4,
      title: "What financial accounts are required for NRI property purchase?",
      desciption:
        "NRIs typically use NRE or NRO bank accounts to purchase property in India. Our team guides you on fund remittance, RBI compliance and transaction structure.",
    },
    {
      id: 5,
      title: "Does MilkeKhareedo assist with legal verification?",
      desciption:
        "Yes. We provide complete legal due diligence, including title verification, RERA compliance checks, builder credibility assessment, and agreement & registration coordination.",
    },
    {
      id: 6,
      title: "Can NRIs get home loans in India?",
      desciption:
        "Yes. Many Indian banks offer home loans for NRIs. We assist in connecting you with trusted banking partners and guide you through eligibility, documentation and approval.",
    },
    {
      id: 7,
      title: "What cities does MilkeKhareedo support for NRIs?",
      desciption:
        "Currently, MilkeKhareedo primarily supports Hyderabad real estate projects, working as authorized channel partners with reputed builders. Expansion to other cities is planned.",
    },
    {
      id: 8,
      title: "Does MilkeKhareedo provide property management services?",
      desciption:
        "Yes. We offer post-purchase property management, including tenant coordination, rent collection, maintenance support and periodic property updates for NRIs.",
    },
    {
      id: 9,
      title: "How safe is it to invest through MilkeKhareedo?",
      desciption:
        "MilkeKhareedo works only with verified builders and legally approved projects. Our group-buying model also helps NRIs get better pricing, transparency and reduced risk.",
    },
    {
      id: 10,
      title: "How can NRIs contact the MilkeKhareedo support team?",
      desciption:
        "NRIs can reach us via Email: nri@milkeKhareedo.com or Call/WhatsApp: +91-XXXXXXXXXX. Our dedicated NRI relationship managers will assist you personally.",
    },
  ];

  return (
    <section className="bg-[#F0F8FF] py-16 px-4 sm:px-6 md:px-10">
      <div className="mx-auto max-w-[1300px] flex flex-col items-center gap-10">
        
        <h2 className="text-[26px] md:text-[32px] font-semibold text-black text-center">
          <span className="relative inline-block text-[#1C4692] pe-2">
            NRI
            <svg
              className="absolute left-0 -bottom-2 w-[160px]"
              viewBox="0 0 228 11"
              fill="none"
            >
              <path
                d="M2 8.5C60 1.5 170 5.5 226 8.5"
                stroke="#1C4692"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          Support FAQs
        </h2>

        <div className="w-full flex flex-col gap-5">
          {arr.map((i) => (
            <FAQSCard key={i.id} data={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
