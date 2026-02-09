"use client";

import { useState, useMemo, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { type NeighborhoodData, type ConnectivityPoint } from "@/lib/api/services/home.service";
import Loader from "@/components/ui/loader";

const SCHOOL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
<path d="M10.6249 12.4999H14.3749C16.5356 12.4999 17.5001 11.5363 17.5001 9.37499V4.50896C17.1 4.30736 16.6813 4.14502 16.2499 4.02422V3.75C16.2499 1.67883 14.5711 0 12.4999 0C10.429 0 8.74992 1.67883 8.74992 3.75V4.02422C8.3186 4.14506 7.90001 4.3074 7.5 4.50896V9.37499C7.5 11.5363 8.46428 12.4999 10.6249 12.4999ZM10.0001 3.75C10.0001 2.36935 11.1193 1.24992 12.4999 1.24992C13.8807 1.24992 15 2.36935 15 3.75V3.7882C14.7933 3.76898 14.5866 3.75 14.3749 3.75H10.6249C10.4134 3.75 10.2066 3.76875 10.0001 3.7882V3.75Z" fill="currentColor"/>
<path d="M18.75 5.32605V9.37499C18.75 12.2369 17.2375 13.7501 14.3749 13.7501H10.6249C7.76249 13.7501 6.25007 12.2369 6.25007 9.37499V5.32605C5.46817 5.97008 4.8385 6.77919 4.40626 7.69533C3.97401 8.61147 3.7499 9.61192 3.75 10.6249V21.8749C3.75181 23.6002 5.1498 24.9982 6.87492 25.0001H18.1249C19.8502 24.9982 21.2482 23.6003 21.2501 21.8749V10.6249C21.2502 9.61192 21.026 8.61147 20.5938 7.69533C20.1616 6.77919 19.5319 5.97008 18.75 5.32605ZM15.6251 19.9999H15V20.625C15 20.9701 14.7201 21.2501 14.3749 21.2501C14.0297 21.2501 13.7501 20.9702 13.7501 20.625V19.9999H9.37499C9.02988 19.9999 8.74992 19.7202 8.74992 19.3751C8.74992 19.0299 9.02982 18.75 9.37499 18.75H15.6251C15.9702 18.75 16.2499 19.0299 16.2499 19.3751C16.2499 19.7202 15.9702 19.9999 15.6251 19.9999ZM23.1251 15H22.5V22.4368C23.9539 22.1381 24.998 20.8594 25.0001 19.3751V16.875C24.9989 15.84 24.1601 15.0012 23.1251 15ZM0 16.875V19.3751C0.0018164 20.8594 1.04601 22.1381 2.50008 22.4368V15H1.875C0.839999 15.0012 0.00117187 15.84 0 16.875Z" fill="currentColor"/>
</svg>
`;

const HOSPITAL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M18.6406 1.03899e-05H4.96875C4.77398 1.03899e-05 4.58719 0.0773818 4.44947 0.215104C4.31175 0.352826 4.23438 0.539617 4.23438 0.734385V22.707C4.23489 22.8035 4.25439 22.8989 4.29177 22.9878C4.32915 23.0767 4.38367 23.1574 4.45223 23.2252C4.52078 23.293 4.60203 23.3467 4.69132 23.3831C4.78062 23.4195 4.87622 23.438 4.97266 23.4375H18.6445C18.8386 23.4375 19.0248 23.3607 19.1624 23.2238C19.3 23.0869 19.3779 22.9011 19.3789 22.707V0.734385C19.3789 0.637616 19.3598 0.541801 19.3226 0.452447C19.2855 0.363093 19.231 0.281962 19.1624 0.213718C19.0938 0.145474 19.0124 0.0914615 18.9229 0.0547862C18.8333 0.0181109 18.7374 -0.000504339 18.6406 1.03899e-05ZM8.82422 18.8438C8.82422 18.8833 8.81644 18.9224 8.80132 18.9589C8.78621 18.9954 8.76405 19.0285 8.73612 19.0564C8.70819 19.0844 8.67503 19.1065 8.63854 19.1216C8.60205 19.1368 8.56294 19.1445 8.52344 19.1445H7.71875C7.67911 19.1451 7.63976 19.1376 7.60303 19.1227C7.5663 19.1078 7.53293 19.0857 7.5049 19.0576C7.47686 19.0296 7.45472 18.9962 7.43979 18.9595C7.42486 18.9228 7.41744 18.8834 7.41797 18.8438V18.0352C7.41797 17.9958 7.42577 17.9569 7.44093 17.9206C7.4561 17.8844 7.47831 17.8515 7.5063 17.8239C7.53428 17.7962 7.56747 17.7744 7.60394 17.7598C7.64041 17.7451 7.67944 17.7378 7.71875 17.7383H8.52344C8.60254 17.7383 8.67846 17.7694 8.73475 17.825C8.79105 17.8806 8.82319 17.9561 8.82422 18.0352V18.8438ZM8.82422 15.8359C8.82321 15.9154 8.79119 15.9913 8.735 16.0475C8.67881 16.1037 8.60289 16.1357 8.52344 16.1367H7.71875C7.63898 16.1367 7.56247 16.105 7.50606 16.0486C7.44966 15.9922 7.41797 15.9157 7.41797 15.8359V15.0274C7.41797 14.988 7.42577 14.9491 7.44093 14.9128C7.4561 14.8766 7.47831 14.8437 7.5063 14.816C7.53428 14.7884 7.56747 14.7666 7.60394 14.7519C7.64041 14.7373 7.67944 14.73 7.71875 14.7305H8.52344C8.56275 14.73 8.60178 14.7373 8.63825 14.7519C8.67472 14.7666 8.70791 14.7884 8.73589 14.816C8.76387 14.8437 8.78609 14.8766 8.80125 14.9128C8.81642 14.9491 8.82422 14.988 8.82422 15.0274V15.8359ZM8.82422 12.8242C8.82422 12.904 8.79253 12.9805 8.73612 13.0369C8.67971 13.0933 8.60321 13.125 8.52344 13.125H7.71875C7.67911 13.1255 7.63976 13.1181 7.60303 13.1032C7.5663 13.0883 7.53293 13.0661 7.5049 13.0381C7.47686 13.01 7.45472 12.9767 7.43979 12.94C7.42486 12.9032 7.41744 12.8639 7.41797 12.8242V12.0195C7.41797 11.9398 7.44966 11.8633 7.50606 11.8069C7.56247 11.7505 7.63898 11.7188 7.71875 11.7188H8.52344C8.60289 11.7198 8.67881 11.7518 8.735 11.808C8.79119 11.8642 8.82321 11.9401 8.82422 12.0195V12.8242ZM12.5898 18.8438C12.5898 18.8827 12.5822 18.9214 12.5672 18.9574C12.5523 18.9934 12.5305 19.0261 12.5029 19.0537C12.4753 19.0812 12.4426 19.1031 12.4066 19.118C12.3706 19.133 12.332 19.1406 12.293 19.1406H11.4844C11.4447 19.1412 11.4054 19.1337 11.3687 19.1188C11.3319 19.1039 11.2986 19.0817 11.2705 19.0537C11.2425 19.0257 11.2203 18.9923 11.2054 18.9556C11.1905 18.9188 11.1831 18.8795 11.1836 18.8399V18.0352C11.1836 17.9958 11.1914 17.9569 11.2066 17.9206C11.2217 17.8844 11.2439 17.8515 11.2719 17.8239C11.2999 17.7962 11.3331 17.7744 11.3696 17.7598C11.406 17.7451 11.4451 17.7378 11.4844 17.7383H12.293C12.3717 17.7383 12.4472 17.7696 12.5029 17.8252C12.5586 17.8809 12.5898 17.9564 12.5898 18.0352V18.8438ZM12.5898 15.8359C12.5899 15.915 12.5587 15.991 12.5031 16.0473C12.4476 16.1036 12.3721 16.1357 12.293 16.1367H11.4844C11.4046 16.1367 11.3281 16.105 11.2717 16.0486C11.2153 15.9922 11.1836 15.9157 11.1836 15.8359V15.0274C11.1836 14.988 11.1914 14.9491 11.2066 14.9128C11.2217 14.8766 11.2439 14.8437 11.2719 14.816C11.2999 14.7884 11.3331 14.7666 11.3696 14.7519C11.406 14.7373 11.4451 14.73 11.4844 14.7305H12.293C12.3321 14.73 12.3709 14.7373 12.4072 14.752C12.4435 14.7667 12.4764 14.7886 12.5041 14.8163C12.5317 14.8439 12.5536 14.8769 12.5683 14.9131C12.583 14.9494 12.5904 14.9882 12.5898 15.0274V15.8359ZM12.5898 12.8242C12.5904 12.8635 12.5831 12.9026 12.5684 12.939C12.5537 12.9755 12.5319 13.0087 12.5043 13.0367C12.4767 13.0647 12.4438 13.0869 12.4075 13.102C12.3712 13.1172 12.3323 13.125 12.293 13.125H11.4844C11.4447 13.1255 11.4054 13.1181 11.3687 13.1032C11.3319 13.0883 11.2986 13.0661 11.2705 13.0381C11.2425 13.01 11.2203 12.9767 11.2054 12.94C11.1905 12.9032 11.1831 12.8639 11.1836 12.8242V12.0195C11.1836 11.9398 11.2153 11.8633 11.2717 11.8069C11.3281 11.7505 11.4046 11.7188 11.4844 11.7188H12.293C12.3721 11.7198 12.4476 11.7519 12.5031 11.8082C12.5587 11.8645 12.5899 11.9404 12.5898 12.0195V12.8242ZM12.5352 6.88282V9.05079C12.5425 9.15147 12.529 9.25259 12.4956 9.34783C12.4621 9.44306 12.4093 9.53038 12.3406 9.60432C12.2719 9.67825 12.1886 9.73723 12.0961 9.77755C12.0035 9.81788 11.9037 9.83869 11.8027 9.83869C11.7018 9.83869 11.6019 9.81788 11.5094 9.77755C11.4168 9.73723 11.3336 9.67825 11.2649 9.60432C11.1961 9.53038 11.1434 9.44306 11.1099 9.34783C11.0764 9.25259 11.063 9.15147 11.0703 9.05079V6.88282H8.89844C8.79776 6.89018 8.69664 6.8767 8.6014 6.84323C8.50616 6.80975 8.41885 6.75701 8.34491 6.68827C8.27098 6.61954 8.212 6.53631 8.17168 6.44376C8.13135 6.35122 8.11054 6.25135 8.11054 6.1504C8.11054 6.04945 8.13135 5.94959 8.17168 5.85704C8.212 5.7645 8.27098 5.68126 8.34491 5.61253C8.41885 5.5438 8.50616 5.49105 8.6014 5.45757C8.69664 5.4241 8.79776 5.41062 8.89844 5.41798H11.0703V3.2461C11.063 3.14542 11.0764 3.04431 11.1099 2.94907C11.1434 2.85383 11.1961 2.76652 11.2649 2.69258C11.3336 2.61864 11.4168 2.55967 11.5094 2.51934C11.6019 2.47902 11.7018 2.4582 11.8027 2.4582C11.9037 2.4582 12.0035 2.47902 12.0961 2.51934C12.1886 2.55967 12.2719 2.61864 12.3406 2.69258C12.4093 2.76652 12.4621 2.85383 12.4956 2.94907C12.529 3.04431 12.5425 3.14542 12.5352 3.2461V5.41798H14.707C14.892 5.4315 15.0651 5.51453 15.1914 5.6504C15.3177 5.78627 15.3879 5.9649 15.3879 6.1504C15.3879 6.3359 15.3177 6.51453 15.1914 6.6504C15.0651 6.78627 14.892 6.8693 14.707 6.88282H12.5352ZM16.1992 18.8438C16.1992 18.8833 16.1914 18.9224 16.1763 18.9589C16.1612 18.9954 16.1391 19.0285 16.1111 19.0564C16.0832 19.0844 16.05 19.1065 16.0135 19.1216C15.977 19.1368 15.9379 19.1445 15.8984 19.1445H15.0898C15.0503 19.1445 15.0112 19.1368 14.9747 19.1216C14.9382 19.1065 14.9051 19.0844 14.8772 19.0564C14.8492 19.0285 14.8271 18.9954 14.812 18.9589C14.7968 18.9224 14.7891 18.8833 14.7891 18.8438V18.0352C14.7901 17.9561 14.8222 17.8806 14.8785 17.825C14.9348 17.7694 15.0107 17.7383 15.0898 17.7383H15.8984C15.9775 17.7383 16.0535 17.7694 16.1098 17.825C16.166 17.8806 16.1982 17.9561 16.1992 18.0352V18.8438ZM16.1992 15.8359C16.1982 15.9154 16.1662 15.9913 16.11 16.0475C16.0538 16.1037 15.9779 16.1357 15.8984 16.1367H15.0898C15.0104 16.1357 14.9345 16.1037 14.8783 16.0475C14.8221 15.9913 14.7901 15.9154 14.7891 15.8359V15.0274C14.7891 14.988 14.7969 14.9491 14.812 14.9128C14.8272 14.8766 14.8494 14.8437 14.8774 14.816C14.9054 14.7884 14.9386 14.7666 14.975 14.7519C15.0115 14.7373 15.0505 14.73 15.0898 14.7305H15.8984C15.9378 14.73 15.9768 14.7373 16.0132 14.7519C16.0497 14.7666 16.0829 14.7884 16.1109 14.816C16.1389 14.8437 16.1611 14.8766 16.1763 14.9128C16.1914 14.9491 16.1992 14.988 16.1992 15.0274V15.8359ZM16.1992 12.8242C16.1992 12.904 16.1675 12.9805 16.1111 13.0369C16.0547 13.0933 15.9782 13.125 15.8984 13.125H15.0898C15.0101 13.125 14.9336 13.0933 14.8772 13.0369C14.8208 12.9805 14.7891 12.904 14.7891 12.8242V12.0195C14.7901 11.9401 14.8221 11.8642 14.8783 11.808C14.9345 11.7518 15.0104 11.7198 15.0898 11.7188H15.8984C15.9779 11.7198 16.0538 11.7518 16.11 11.808C16.1662 11.8642 16.1982 11.9401 16.1992 12.0195V12.8242ZM23.6211 7.19532V22.707C23.6211 22.8036 23.6019 22.8993 23.5648 22.9884C23.5276 23.0775 23.473 23.1584 23.4044 23.2263C23.3357 23.2943 23.2543 23.3479 23.1648 23.3842C23.0752 23.4204 22.9794 23.4385 22.8828 23.4375H19.9102C20.0388 23.2156 20.1062 22.9635 20.1055 22.707V6.46485H22.8828C22.9794 6.46382 23.0752 6.48195 23.1648 6.5182C23.2543 6.55445 23.3357 6.60809 23.4044 6.67602C23.473 6.74396 23.5276 6.82483 23.5648 6.91397C23.6019 7.00311 23.6211 7.09874 23.6211 7.19532ZM3.50781 22.707C3.50594 22.9632 3.57199 23.2152 3.69922 23.4375H0.730469C0.536736 23.4375 0.350939 23.3605 0.213949 23.2236C0.0769599 23.0866 0 22.9008 0 22.707V7.19532C0 7.00159 0.0769599 6.81579 0.213949 6.6788C0.350939 6.54181 0.536736 6.46485 0.730469 6.46485H3.50781V22.707Z" fill="currentColor"/>
</svg>
`;

const RESTAURANT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
<g clip-path="url(#clip0_1110_13057)">
<path d="M24.2651 13.2864H23.4958C23.1606 8.2396 19.4115 4.10029 14.5363 3.20454C14.6673 2.92334 14.7458 2.52695 14.7458 2.19678C14.7458 0.985449 13.7603 0 12.549 0C11.3376 0 10.3522 0.985449 10.3522 2.19678C10.3522 2.52695 10.4306 2.92334 10.5616 3.20454C5.68647 4.10029 1.83965 8.23955 1.50459 13.2864H0.735205C0.330469 13.2864 0.00292969 13.5944 0.00292969 13.9991C0.00292969 14.4039 0.33042 14.7314 0.735205 14.7314H24.2651C24.6699 14.7314 24.9974 14.4039 24.9974 13.9991C24.9974 13.5944 24.6699 13.2864 24.2651 13.2864ZM12.549 3.01523C12.145 3.01523 11.8167 2.60083 11.8167 2.19678C11.8167 1.79272 12.145 1.4645 12.549 1.4645C12.953 1.4645 13.2812 1.79272 13.2812 2.19678C13.2812 2.60083 12.953 3.01523 12.549 3.01523ZM2.19976 17.6604C1.78965 17.6604 1.46748 17.9826 1.46748 18.3927V24.2622C1.46748 24.6722 1.78965 24.9944 2.19976 24.9944H4.39653V17.6604H2.19976ZM22.7147 17.0335C22.1427 16.4614 21.216 16.4614 20.6439 17.0334L16.4506 21.2072C15.9252 21.7326 15.234 22.0247 14.4961 22.0539H12.4905C12.0889 22.0539 11.7582 21.7551 11.7582 21.3216C11.7582 20.8881 12.0888 20.5894 12.4905 20.5894H14.7458C15.5513 20.5894 16.2103 19.9303 16.2103 19.1249C16.2103 18.3194 15.5513 17.6799 14.7458 17.6799H13.2813C13.0243 17.6799 12.8305 17.6891 12.6223 17.5042C12.3626 17.2769 12.0805 16.9934 11.8168 16.8256C10.3531 15.7924 8.23643 15.5416 6.47124 16.4639C6.28721 16.5601 6.13306 16.7049 6.02549 16.8826C5.91793 17.0602 5.86107 17.264 5.86108 17.4716V24.9944C15.1754 25.0069 14.3231 24.9943 14.379 24.9944C15.9436 24.9944 17.4152 24.3852 18.5215 23.2782L22.7148 19.0849C23.2869 18.5128 23.2869 17.6056 22.7147 17.0335Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_1110_13057">
<rect width="25" height="25" fill="white"/>
</clipPath>
</defs>
</svg>

`;

const BUS_STOP_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
<path d="M17.1208 10.7576L11.6663 9.09091C10.7193 8.75 10.0753 7.95454 9.96171 7.00757C9.73443 5.34091 11.136 3.90151 12.8405 4.09091C14.1663 4.24242 15.1132 5.30303 15.1132 6.66666C15.1132 7.68939 15.9466 8.52272 16.9693 8.52272C17.992 8.52272 18.8253 7.72727 18.8253 6.70454C18.8253 3.25757 16.0602 0.378784 12.4996 0.378784C9.0905 0.378784 6.17383 3.33333 6.17383 6.85606V22.197C6.17383 23.5227 7.27231 24.6212 8.59807 24.6212H16.4011C17.7269 24.6212 18.8253 23.5227 18.8253 22.197V13.0303C18.8253 11.9697 18.1435 11.0606 17.1208 10.7576ZM15.7572 17.5379L12.1966 21.0985C11.8935 21.4394 11.3632 21.4394 11.0223 21.0985L9.24201 19.3182C8.93898 19.0151 8.93898 18.5606 9.24201 18.2576C9.39353 18.1061 9.58292 18.0303 9.77231 18.0303C9.96171 18.0303 10.1511 18.1061 10.3026 18.2576L11.5905 19.5455L14.6966 16.4394C14.9996 16.1364 15.492 16.1364 15.7572 16.4394C15.9087 16.5909 15.9844 16.7803 15.9844 16.9697C15.9844 17.1591 15.9087 17.3864 15.7572 17.5379Z" fill="currentColor"/>
</svg>
`

const CATEGORY_CONFIG: Record<string, { label: string; icon: string; color: string; pinColor: string }> = {
  schools: { label: "School", icon: SCHOOL_SVG, color: "#1C4692", pinColor: "#1C4692" },
  hospitals: { label: "Hospital", icon: HOSPITAL_SVG, color: "#4ECDC4", pinColor: "#4ECDC4" },
  transportation: { label: "Transport", icon: BUS_STOP_SVG, color: "#45B7D1", pinColor: "#45B7D1" },
  restaurants: { label: "Restaurant", icon: RESTAURANT_SVG, color: "#FFA07A", pinColor: "#FFA07A" },
  malls: { label: "Mall", icon: "🛍️", color: "#9B59B6", pinColor: "#9B59B6" },
  cafes: { label: "Cafe", icon: "☕", color: "#F39C12", pinColor: "#F39C12" },
  hotels: { label: "Hotels", icon: "🛏️", color: "#8E44AD", pinColor: "#8E44AD" },
};

interface PDPNeighborhoodProps {
  neighborhood: NeighborhoodData;
  propertyLocation: { lat: number; lng: number };
}

export default function PDPNeighborhood({
  neighborhood,
  propertyLocation,
}: PDPNeighborhoodProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [markerAnimationState, setMarkerAnimationState] = useState<Record<string, boolean>>({});
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const categories = useMemo(() => {
    const order = ["schools", "restaurants", "hospitals", "hotels", "cafes", "transportation", "malls"];
    const cats: Array<{ key: string; label: string; count: number; icon: string; color: string }> = [];

    if (neighborhood?.connectivity) {
      order.forEach((key) => {
        const points = neighborhood.connectivity[key as keyof typeof neighborhood.connectivity];
        if (Array.isArray(points) && points.length > 0) {
          const config = CATEGORY_CONFIG[key] || { label: key, icon: "📍", color: "#666", pinColor: "#666" };
          cats.push({
            key,
            label: config.label,
            count: points.length,
            icon: config.icon,
            color: config.color
          });
        }
      });
    }
    return cats;
  }, [neighborhood]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].key);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    const checkGoogleMaps = () => {
      if (typeof window !== "undefined" && (window as any).google?.maps) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGoogleMaps()) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 50;

    const interval = setInterval(() => {
      attempts++;
      if (checkGoogleMaps() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const allMarkers = useMemo(() => {
    const markers: Array<{
      lat: number;
      lng: number;
      type: "property" | string;
      title: string;
      color: string;
      icon?: string;
      category?: string;
    }> = [];

    markers.push({
      lat: propertyLocation.lat,
      lng: propertyLocation.lng,
      type: "property",
      title: "Property Location",
      color: "#1C4692",
    });

    if (neighborhood?.connectivity) {
      Object.entries(neighborhood.connectivity).forEach(([key, points]) => {
        if (Array.isArray(points) && (!selectedCategory || selectedCategory === key)) {
          const config = CATEGORY_CONFIG[key] || { pinColor: "#666", icon: "📍" };
          points.forEach((point: ConnectivityPoint) => {
            markers.push({
              lat: point.latitude,
              lng: point.longitude,
              type: key,
              title: point.name,
              color: config.pinColor,
              icon: config.icon,
              category: key,
            });
          });
        }
      });
    }

    return markers;
  }, [neighborhood, propertyLocation, selectedCategory]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  useEffect(() => {
    if (map && allMarkers.length > 0 && typeof window !== "undefined" && (window as any).google?.maps) {
      const googleMaps = (window as any).google.maps;
      const bounds = new googleMaps.LatLngBounds();
      let hasValidMarkers = false;

      allMarkers.forEach((marker) => {
        if (marker.lat && marker.lng && !isNaN(marker.lat) && !isNaN(marker.lng)) {
          bounds.extend(new googleMaps.LatLng(marker.lat, marker.lng));
          hasValidMarkers = true;
        }
      });

      if (hasValidMarkers && !bounds.isEmpty()) {
        const timeoutId = setTimeout(() => {
          const padding = {
            top: 80,
            right: 80,
            bottom: 80,
            left: window.innerWidth > 768 ? 380 : 80,
          };

          map.fitBounds(bounds, padding);
          const listener = googleMaps.event.addListener(map, 'bounds_changed', () => {
            const zoom = map.getZoom();
            if (zoom !== undefined && zoom > 18) {
              map.setZoom(18);
            }
            googleMaps.event.removeListener(listener);
          });
        }, 400);

        return () => clearTimeout(timeoutId);
      } else if (allMarkers.length === 1) {
        const marker = allMarkers[0];
        if (marker.lat && marker.lng) {
          map.setCenter(new googleMaps.LatLng(marker.lat, marker.lng));
          map.setZoom(15);
        }
      }
    }
  }, [map, allMarkers, selectedCategory]);

  const createMarkerIcon = (color: string, type: string, icon?: string, isProperty: boolean = false): google.maps.Icon | undefined => {
    if (typeof window === "undefined" || !(window as any).google?.maps) {
      return undefined;
    }

    if (isProperty) {
      const svg = `
        <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow-property-${type}" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="grad-property" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${color}dd;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" 
                fill="url(#grad-property)" 
                stroke="#ffffff" 
                stroke-width="2.5"
                filter="url(#shadow-property-${type})"/>
          <circle cx="20" cy="20" r="7" fill="#ffffff" opacity="0.95"/>
          <circle cx="20" cy="20" r="4" fill="${color}"/>
        </svg>
      `;
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(40, 50),
        anchor: new google.maps.Point(20, 50),
      };
    }

    const svg = `
      <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${type}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
            <feOffset dx="0" dy="1.5" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="18" cy="18" r="15" 
                fill="white" 
                stroke="${color}" 
                stroke-width="2.5"
                filter="url(#shadow-${type})"/>
        <circle cx="18" cy="18" r="12" 
                fill="${color}" 
                opacity="0.1"/>
       ${icon ? `<g transform="translate(6,6) scale(0.9)">${icon}</g>` : ""}
      </svg>
    `;

    try {
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 36),
      };
    } catch (error) {
      console.error("Error creating marker icon:", error);
      return undefined;
    }
  };

  useEffect(() => {
    if (allMarkers.length > 0) {
      const newState: Record<string, boolean> = {};
      allMarkers.forEach((marker, index) => {
        const key = `${marker.type}-${marker.lat}-${marker.lng}-${index}`;
        newState[key] = false;
      });
      setMarkerAnimationState(newState);

      setTimeout(() => {
        allMarkers.forEach((marker, index) => {
          const key = `${marker.type}-${marker.lat}-${marker.lng}-${index}`;
          setTimeout(() => {
            setMarkerAnimationState((prev) => ({ ...prev, [key]: true }));
          }, index * 60);
        });
      }, 150);

      setAnimationTrigger((prev) => prev + 1);
    }
  }, [selectedCategory, allMarkers.length]);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(selectedCategory === categoryKey ? null : categoryKey);
  };

  if (!isLoaded) {
    return (
      <section className="relative w-full min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-200" />
        <div className="relative z-10 mx-auto container py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="w-full md:w-1/3 bg-white/90 backdrop-blur-md rounded-2xl p-6">
              <h2 className="mb-6 font-semibold text-3xl text-gray-900">The Neighborhood</h2>
              <div className="text-center text-gray-600"><Loader size={38}/></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative max-w-6xl mx-auto w-full min-h-[600px] overflow-hidden bg-gray-100 flex flex-col md:block">
      
      <div className="relative order-2 md:order-none md:absolute inset-0 z-0 pointer-events-auto h-[360px] md:h-full">

        
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={propertyLocation}
            zoom={13}
            options={{
              disableDefaultUI: false,
              clickableIcons: true,
              scrollwheel: true,
              zoomControl: true,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              draggable: true,
              gestureHandling: "greedy", 
              keyboardShortcuts: true,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
              ],
            }}
            onLoad={onLoad}>
            {allMarkers.map((marker, index) => {
              if (!marker.lat || !marker.lng || isNaN(marker.lat) || isNaN(marker.lng)) {
                return null;
              }

              const isProperty = marker.type === "property";
              const baseKey = `${marker.type}-${marker.lat}-${marker.lng}-${index}`;
              const markerKey = `${baseKey}-${selectedCategory || 'all'}-${animationTrigger}`;
              const shouldAnimate = markerAnimationState[baseKey] !== false;

              const markerIcon = createMarkerIcon(
                marker.color,
                marker.type,
                marker.type === "property" ? undefined : marker.icon,
                isProperty
              );

              let animationType: google.maps.Animation | undefined = undefined;
              if (typeof window !== "undefined" && (window as any).google?.maps) {
                if (shouldAnimate) {
                  animationType = google.maps.Animation.DROP;
                }
              }

              return (
                <Marker
                  key={markerKey}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  title={marker.title}
                  icon={markerIcon}
                  animation={animationType}
                  zIndex={isProperty ? 1000 : 100}
                  clickable={true}
                  cursor="pointer"
                />
              );
            })}
          </GoogleMap>
        )}
      </div>

      


      {/* Blur Overlay and Content - Non-blocking for map interactions */}
<div className="relative z-10 order-1 md:order-none mx-auto w-full max-w-6xl py-6 md:py-12 pointer-events-none px-4 md:px-0">
<div className="flex flex-col md:flex-row gap-6 md:gap-10 md:items-start">

<div
className="
  w-full md:w-1/3 md:max-w-[380px]
  bg-white/40
  backdrop-blur-2xl
  rounded-3xl
  p-5
  shadow-[0_20px_60px_rgba(0,0,0,0.12)]
  ring-1 ring-white/30
  pointer-events-auto
"

>

            <h2 className="mb-6 font-semibold text-2xl text-gray-900">The Neighborhood</h2>
             <div className="flex gap-3 overflow-x-auto no-scrollbar px-1 pb-2 md:flex-col md:overflow-visible md:gap-3 md:px-0 md:pb-0">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.key;
                return (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryClick(category.key)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 md:p-3 min-w-[160px] md:w-full shrink-0 transition-all duration-300
                    ${isSelected
                        ? "border-[#1C4692] bg-[#EEF4FF]"
                        : "border-gray-200 bg-white"
                      }`}>
                    <div
                      className={`flex items-center justify-center rounded-full size-9 md:size-10 p-2 transition-all duration-300
                      ${isSelected
                          ? "bg-[#1C4692]/10 text-[#1C4692]"
                          : "bg-gray-100 text-black"
                        }
                      `}>
                      <span className={`transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                        {category.icon ? (
                          <div
                            className="h-5 w-5"
                            dangerouslySetInnerHTML={{ __html: category.icon }}
                          />
                        ) : (
                          <span className="text-lg">📍</span>
                        )}
                      </span>

                    </div>
                    <span className={`text-[18px] font-medium flex-1 text-left transition-colors duration-300 ${isSelected ? "text-[#1C4692]" : "text-gray-900"
                      }`}>
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
