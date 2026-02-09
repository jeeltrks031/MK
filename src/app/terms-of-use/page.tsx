// "use client";

// import Heading from "@/components/typography/heading";

// export default function Page() {
//   // Get current date in DD/MM/YYYY format
//   const getCurrentDate = () => {
//     const today = new Date();
//     const day = String(today.getDate()).padStart(2, "0");
//     const month = String(today.getMonth() + 1).padStart(2, "0");
//     const year = today.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <>
//       <section className="pt-10 pb-[100px]">
//         <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
//           <div className="inline-flex flex-col justify-start items-start gap-7">
//             <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
//               <Heading
//                 variant={"h3"}
//                 className="justify-start text-black font-semibold"
//               >
//                 TERMS & CONDITIONS
//               </Heading>
//               <div className="self-stretch h-0 outline outline-offset-[-0.50px] outline-neutral-200"></div>
//               <div className="self-stretch justify-start text-zinc-500 text-lg font-medium leading-8">
//                 <p className="mb-6">
//                   <strong>Last updated: {getCurrentDate()}</strong>
//                 </p>
//                 <p className="mb-6">Welcome to Milke Khareedo.</p>
//                 <p className="mb-6">
//                   By accessing or using our website, platform, or services, you
//                   agree to the following terms. Please read them carefully. If
//                   you do not agree, kindly refrain from using our services.
//                 </p>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>1. About Milke Khareedo</strong>
//                   </p>
//                   <p>
//                     Milke Khareedo is a group-buying platform designed to help
//                     property buyers come together and access better pricing and
//                     benefits than individual buying. We do not sell property
//                     directly and do not act as a builder or developer.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>2. Nature of Our Service</strong>
//                   </p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>
//                       We help buyers discover properties, form buyer groups, and
//                       understand potential pricing advantages.
//                     </li>
//                     <li>
//                       All property purchases are made directly between the buyer
//                       and the developer/builder.
//                     </li>
//                     <li>
//                       Final pricing, availability, approvals, and agreements are
//                       solely determined by the developer.
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>3. No Guarantee of Pricing or Savings</strong>
//                   </p>
//                   <p>
//                     While group buying can lead to better pricing, Milke
//                     Khareedo does not guarantee specific discounts, savings, or
//                     outcomes. Benefits may vary based on demand, project, and
//                     builder policies.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>4. No Brokerage or Forced Commitment</strong>
//                   </p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>
//                       Joining a buyer group does not obligate you to purchase.
//                     </li>
//                     <li>
//                       You are free to proceed or not proceed at any stage.
//                     </li>
//                     <li>We do not force decisions, urgency, or commitments.</li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>5. Information Accuracy</strong>
//                   </p>
//                   <p>
//                     We strive to provide accurate and updated information.
//                     However, property details such as pricing, availability,
//                     timelines, and specifications are subject to change by
//                     developers without notice.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>6. User Responsibilities</strong>
//                   </p>
//                   <p className="mb-2">You agree to:</p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>Provide accurate contact and personal information</li>
//                     <li>Use the platform only for lawful purposes</li>
//                     <li>
//                       Not misuse or attempt to manipulate group-buying processes
//                     </li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>7. Third-Party Relationships</strong>
//                   </p>
//                   <p>
//                     Milke Khareedo may connect you with developers, agents, or
//                     service providers. We are not responsible for third-party
//                     actions, representations, or agreements.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>8. Limitation of Liability</strong>
//                   </p>
//                   <p className="mb-2">Milke Khareedo is not liable for:</p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>Financial decisions made by users</li>
//                     <li>Disputes between buyers and developers</li>
//                     <li>Delays, cancellations, or changes by builders</li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>9. Intellectual Property</strong>
//                   </p>
//                   <p>
//                     All content, branding, and materials on this website belong
//                     to Milke Khareedo and may not be copied or reused without
//                     permission.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>10. Changes to Terms</strong>
//                   </p>
//                   <p>
//                     We may update these terms from time to time. Continued use
//                     of the platform implies acceptance of updated terms.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>11. Governing Law</strong>
//                   </p>
//                   <p>
//                     These terms are governed by the laws of India. Any disputes
//                     shall be subject to the jurisdiction of courts in Hyderabad,
//                     Telangana.
//                   </p>
//                 </div>
//                 <p className="mt-6">
//                   For questions, contact us at:
//                   <br />
//                   Email:{" "}
//                   <a
//                     href="mailto:support@milkekhereedo.com"
//                     className="text-blue-600 hover:underline"
//                   >
//                     support@milkekhereedo.com
//                   </a>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import Heading from "@/components/typography/heading";

export default function TermsPage() {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <Heading
          variant="h3"
          className="text-black font-semibold text-2xl md:text-[35px] mb-4"
          style={{ fontWeight: "600" }}
        >
          Terms & Conditions
        </Heading>

        <div className="my-4 h-px bg-neutral-200" />

        <div className="text-[#828282] text-base md:text-[18px] leading-7 md:leading-8 space-y-6">
          <p>Last updated: {getCurrentDate()}</p>

          <p
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            Welcome to Milke Khareedo.
          </p>

          <p
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            By accessing or using our website, platform, or services, you agree
            to the following terms. Please read them carefully. If you do not
            agree, kindly refrain from using our services.
          </p>

          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>1. About Milke Khareedo</h2>
            <p>
              Milke Khareedo is a group-buying platform designed to help
              property buyers come together and access better pricing and
              benefits than individual buying. We do not sell property directly
              and do not act as a builder or developer.
            </p>
          </section>

          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>2. Nature of Our Service</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                We help buyers discover properties, form buyer groups, and
                understand potential pricing advantages.
              </li>
              <li>
                All property purchases are made directly between the buyer and
                the developer/builder.
              </li>
              <li>
                Final pricing, availability, approvals, and agreements are
                solely determined by the developer.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>3. No Guarantee of Pricing or Savings</h2>
            <p>
              While group buying can lead to better pricing, Milke Khareedo does
              not guarantee specific discounts, savings, or outcomes. Benefits
              may vary based on demand, project, and builder policies.
            </p>
          </section>

          {/* Section 4 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>4. No Brokerage or Forced Commitment</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Joining a buyer group does not obligate you to purchase.</li>
              <li>You are free to proceed or not proceed at any stage.</li>
              <li>We do not force decisions, urgency, or commitments.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>5. Information Accuracy</h2>
            <p>
              We strive to provide accurate and updated information. However,
              property details such as pricing, availability, timelines, and
              specifications are subject to change by developers without notice.
            </p>
          </section>

          {/* Section 6 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>6. User Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide accurate contact and personal information</li>
              <li>Use the platform only for lawful purposes</li>
              <li>Not misuse or manipulate group-buying processes</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>7. Third-Party Relationships</h2>
            <p>
              Milke Khareedo may connect you with developers, agents, or service
              providers. We are not responsible for third-party actions,
              representations, or agreements.
            </p>
          </section>

          {/* Section 8 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>8. Limitation of Liability</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Financial decisions made by users</li>
              <li>Disputes between buyers and developers</li>
              <li>Delays, cancellations, or changes by builders</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>9. Intellectual Property</h2>
            <p>
              All content, branding, and materials on this website belong to
              Milke Khareedo and may not be copied or reused without permission.
            </p>
          </section>

          {/* Section 10 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>10. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the
              platform implies acceptance of updated terms.
            </p>
          </section>

          {/* Section 11 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>11. Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes shall
              be subject to the jurisdiction of courts in Hyderabad, Telangana.
            </p>
          </section>

          {/* Contact */}
          <p className="pt-6">
            For questions, contact us at:
            <br />
            <a
              href="mailto:support@milkekhareedo.com"
              className="text-blue-600 hover:underline break-all"
            >
              support@milkekhareedo.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
