"use client";

import FAQSCard from "@/components/home/hero/faqs/faqsCard";

export default function FAQSPage() {
    const faqsData = [
        {
            id: 1,
            title: "Do I have to commit when I show interest?",
            desciption:
                "No. Showing interest only helps us understand which projects buyers are considering. There is no obligation or payment at this stage.",
        },
        {
            id: 2,
            title: "How is group buying different from buying alone?",
            desciption:
                "When buyers move forward together for the same project, pricing becomes more flexible. This usually leads to better value than individual buying.",
        },
        {
            id: 3,
            title: "Who negotiates with the builder?",
            desciption:
                "We take the discussion forward based on collective buyer interest. You don't have to negotiate alone or handle uncomfortable conversations.",
        },
        {
            id: 4,
            title: "What is the private buyer group?",
            desciption:
                "No. Showing interest only helps us understand which projects buyers are considering. There is no obligation or payment at this stage.",
        },
        {
            id: 5,
            title: "Is group buying safe and legal?",
            desciption:
                "Yes. Each buyer completes their own individual purchase directly with the builder. Group buying only helps bring clarity and better pricing options.",
        },
        {
            id: 6,
            title: "What if I'm not comfortable with the final offer?",
            desciption:
                "We share the details clearly and continue supporting you. You move forward only when you feel confident about the decision.",
        },
    ];

    return (
        <section className="bg-[#F0F8FF] py-14 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 min-h-screen">
            <div className="mx-auto max-w-[1300px] flex flex-col items-center gap-10">
                {/* Heading */}
                <h2 className="text-[22px] sm:text-[26px] md:text-[30px] font-semibold text-black text-center">
                    <span className="relative inline-block text-[#1C4692] pe-2">
                        Questions
                        <svg
                            className="absolute left-0 -bottom-2 w-[130px] sm:w-[150px] md:w-[164px]"
                            viewBox="0 0 228 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2 8.5C60 1.5 170 5.5 226 8.5"
                                stroke="#1C4692"
                                strokeWidth="5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </span>{" "}
                    Buyers Usually Ask
                </h2>

                {/* FAQ List */}
                <div className="w-full flex flex-col gap-4 sm:gap-5">
                    {faqsData.map((faq) => (
                        <FAQSCard key={faq.id} data={faq} />
                    ))}
                </div>
            </div>
        </section>
    );
}