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
//         <div className="container mx-auto">
//           <div className="inline-flex flex-col justify-start items-start gap-7">
//             <div className="self-stretch flex flex-col justify-start items-start gap-3.5">
//               <Heading
//                 variant={"h3"}
//                 className="justify-start text-black font-semibold"
//               >
//                 Privacy Policy
//               </Heading>
//               <div className="self-stretch h-0 outline outline-offset-[-0.50px] outline-neutral-200"></div>
//               <div className="self-stretch justify-start text-zinc-500 text-lg font-medium leading-8">
//                 <p className="mb-6">
//                   <strong>Last updated: {getCurrentDate()}</strong>
//                 </p>
//                 <p className="mb-6">
//                   At Milke Khareedo, your privacy matters. This policy explains how we collect, use, and protect your information.
//                 </p>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>1. Information We Collect</strong>
//                   </p>
//                   <p className="mb-2">We may collect:</p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>Name, phone number, email address</li>
//                     <li>Property preferences and interests</li>
//                     <li>Location details (city/region)</li>
//                     <li>Any information you submit through forms</li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>2. How We Use Your Information</strong>
//                   </p>
//                   <p className="mb-2">Your information is used to:</p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>Contact you regarding properties or group-buying opportunities</li>
//                     <li>Add you to relevant buyer groups (only with your interest)</li>
//                     <li>Improve our services and user experience</li>
//                     <li>Respond to queries or support requests</li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>3. No Spam. No Selling Data.</strong>
//                   </p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>We do NOT sell your data to third parties.</li>
//                     <li>We do NOT add you to random marketing lists.</li>
//                     <li>Communication is limited and relevant.</li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>4. Sharing Information</strong>
//                   </p>
//                   <p className="mb-2">Your information may be shared only with:</p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>Developers or partners relevant to your expressed interest</li>
//                     <li>Internal teams for service coordination</li>
//                   </ul>
//                   <p className="mt-2">
//                     We never share your data without purpose.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>5. Data Security</strong>
//                   </p>
//                   <p>
//                     We take reasonable measures to protect your data from unauthorized access, misuse, or disclosure.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>6. Cookies & Analytics</strong>
//                   </p>
//                   <p>
//                     We may use cookies or analytics tools to understand website usage and improve performance. These do not personally identify you.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>7. Your Choices</strong>
//                   </p>
//                   <p className="mb-2">You may:</p>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>Request access to your data</li>
//                     <li>Ask for corrections</li>
//                     <li>Request deletion of your data</li>
//                     <li>Opt out of communication at any time</li>
//                   </ul>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>8. External Links</strong>
//                   </p>
//                   <p>
//                     Our website may contain links to third-party sites. We are not responsible for their privacy practices.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>9. Policy Updates</strong>
//                   </p>
//                   <p>
//                     This policy may be updated periodically. Changes will be reflected on this page.
//                   </p>
//                 </div>
//                 <div className="mb-6">
//                   <p className="mb-3">
//                     <strong>10. Contact Us</strong>
//                   </p>
//                   <p>
//                     If you have any questions about privacy or data usage, contact us at:
//                   </p>
//                   <p className="mt-2">
//                     Email: <a href="mailto:support@milkekhereedo.com" className="text-blue-600 hover:underline">support@milkekhereedo.com</a>
//                     <br />
//                     Location: Hyderabad, India
//                   </p>
//                 </div>
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

export default function PrivacyPolicyPage() {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Title */}
        <Heading
          variant="h3"
          className="text-black font-semibold text-2xl md:text-3xl"
        >
          Privacy Policy
        </Heading>

        <div className="my-4 h-px bg-neutral-200" />

        <div className="text-[#828282] text-base md:text-lg leading-7 md:leading-8 space-y-6">
          <p
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            Last updated: {getCurrentDate()}
          </p>

          <p
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            At Milke Khareedo, your privacy matters. This policy explains how we
            collect, use, and protect your information.
          </p>

          {/* Section 1 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>1. Information We Collect</h2>
            <p className="mb-2">We may collect:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Name, phone number, email address</li>
              <li>Property preferences and interests</li>
              <li>Location details (city/region)</li>
              <li>Any information you submit through forms</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section
            className="text-[#828282] font-normal md:text-[18px] mb-6 md:mb-8"
            style={{
              fontWeight: "500",
              lineHeight: "31px",
              fontFamily: "Figtree",
            }}
          >
            <h2>2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Contact you regarding properties or group-buying opportunities
              </li>
              <li>
                Add you to relevant buyer groups (only with your interest)
              </li>
              <li>Improve our services and user experience</li>
              <li>Respond to queries or support requests</li>
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
            <h2>3. No Spam. No Selling Data.</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>We do NOT sell your data to third parties</li>
              <li>We do NOT add you to random marketing lists</li>
              <li>Communication is limited and relevant</li>
            </ul>
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
            <h2>4. Sharing Information</h2>
            <p>Your information may be shared only with:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Developers or partners relevant to your expressed interest
              </li>
              <li>Internal teams for service coordination</li>
            </ul>
            <p className="mt-2">We never share your data without purpose.</p>
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
            <h2>5. Data Security</h2>
            <p>
              We take reasonable measures to protect your data from unauthorized
              access, misuse, or disclosure.
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
            <h2>6. Cookies & Analytics</h2>
            <p>
              We may use cookies or analytics tools to understand website usage
              and improve performance. These do not personally identify you.
            </p>
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
            <h2>7. Your Choices</h2>
            <p className="mb-2">You may:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Request access to your data</li>
              <li>Ask for corrections</li>
              <li>Request deletion of your data</li>
              <li>Opt out of communication at any time</li>
            </ul>
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
            <h2>8. External Links</h2>
            <p>
              Our website may contain links to third-party sites. We are not
              responsible for their privacy practices.
            </p>
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
            <h2>9. Policy Updates</h2>
            <p>
              This policy may be updated periodically. Changes will be reflected
              on this page.
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
            <h2>10. Contact Us</h2>
            <p>If you have any questions about privacy or data usage:</p>
            <p className="mt-2">
              Email:{" "}
              <a
                href="mailto:support@milkekhareedo.com"
                className="text-blue-600 hover:underline break-all"
              >
                support@milkekhareedo.com
              </a>
              <br />
              Location: Hyderabad, India
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
