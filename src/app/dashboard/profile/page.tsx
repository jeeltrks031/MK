"use client";

import { useEffect, useMemo, useState } from "react";
import { useApi } from "@/lib/api/hooks/useApi";
import {
    userDashboardService,
    type UpdateProfilePayload,
    type GetProfileResponse,
} from "@/lib/api/services/userDashboard.service";
import { getCities, getCountries, getStates } from "@/lib/location";
import Loader from "@/components/ui/loader";


export default function ProfilePage() {
    const countries = useMemo(() => getCountries(), []);

    const [form, setForm] = useState<Partial<UpdateProfilePayload>>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        countryCode: "+91",
        address: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
    });

    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const { data, loading } = useApi<{
        user: GetProfileResponse["user"];
    }>(() => userDashboardService.getUserProfile());

    useEffect(() => {
        if (!data?.user) return;

        const user = data.user;

        const countryCode =
            countries.some((c) => c.isoCode === user.country)
                ? user.country
                : countries.find((c) => c.name === user.country)?.isoCode ?? "";

        const statesList = countryCode ? getStates(countryCode) : [];

        const stateCode =
            statesList.some((s) => s.isoCode === user.state)
                ? user.state
                : statesList.find((s) => s.name === user.state)?.isoCode ?? "";

        const citiesList =
            countryCode && stateCode ? getCities(countryCode, stateCode) : [];

        setStates(statesList);
        setCities(citiesList);

        setForm({
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            email: user.email || undefined,
            phoneNumber: user.phoneNumber || undefined,
            countryCode: user.countryCode || "+91",
            // address: user.address || undefined,
            pincode: user.pincode || undefined,
            country: countryCode || undefined,
            state: stateCode || undefined,
            city: user.city || undefined,
        });

    }, [data, countries]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const buildPayload = (): UpdateProfilePayload => ({
        firstName: form.firstName ?? "",
        lastName: form.lastName ?? "",
        email: form.email ?? "",
        phoneNumber: form.phoneNumber ?? "",
        countryCode: form.countryCode ?? "+91",
        address: form.address ?? "",
        pincode: form.pincode ?? "",
        city: form.city ?? "",
        state: form.state ?? "",
        country: form.country ?? "",
    });

    const derivedAddress = useMemo(() => {
        const parts = [
            form.city,
            states.find(s => s.isoCode === form.state)?.name,
            countries.find(c => c.isoCode === form.country)?.name,
        ].filter(Boolean);

        return parts.join(", ");
    }, [form.city, form.state, form.country, states, countries]);


    const handleSave = async () => {
        await userDashboardService.updateUserProfile(buildPayload());
    };


    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const countryCode = e.target.value;

        setForm((prev) => ({
            ...prev,
            country: countryCode,
            state: "",
            city: "",
        }));

        setStates(getStates(countryCode));
        setCities([]);
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const stateCode = e.target.value;

        setForm((prev) => ({
            ...prev,
            state: stateCode,
            city: "",
        }));

        if (!form.country) {
            setCities([]);
            return;
        }

        setCities(getCities(form.country, stateCode));
    };



    if (loading) {
        return (
            <div className="rounded-[24px] bg-white p-10 shadow">
                <Loader size={38} />
            </div>
        );
    }



    return (
        <div className="rounded-[24px] bg-white px-5 py-8 sm:px-10 sm:py-10 shadow">
            <h2 className="mb-8 text-[22px] font-semibold">My Profile</h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <FieldInput label="First Name *" name="firstName" value={form.firstName ?? ""} placeholder="Enter first name" onChange={handleChange} />
                <FieldInput label="Last Name *" name="lastName" value={form.lastName ?? ""} placeholder="Enter last name" onChange={handleChange} />
                <FieldInput label="Email Address" name="email" value={form.email ?? ""} placeholder="Enter email address" onChange={handleChange} />
                <VerifiedInput label="Mobile Number" value={
                    form.phoneNumber
                        ? `${form.countryCode ?? "+91"} ${form.phoneNumber}`
                        : ""
                }
                    placeholder="Enter mobile number" />

                {/* <FieldInput
                    label="Full Address *"
                    name="address"
                    value={form.address ?? ""}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    className="md:col-span-2"
                /> */}

                {derivedAddress && (
                    <FieldInput
                        label="Full Address"
                        value={derivedAddress}
                        disabled
                        className="md:col-span-2 hidden sm:block"
                    />
                )}


                <FieldInput
                    label="Pin code *"
                    name="pincode"
                    value={form.pincode ?? ""}
                    placeholder="Enter pin code"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        if (digits.length <= 6) {
                            setForm((prev) => ({ ...prev, pincode: digits }));
                        }
                    }}
                />

                <FieldSelect label="Country" name="country" value={form.country ?? ""} onChange={handleCountryChange} placeholder="Select your country">
                    {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                    ))}
                </FieldSelect>

                <FieldSelect label="State" name="state" value={form.state ?? ""} onChange={handleStateChange} placeholder="Select your state">
                    {states.length === 0
                        ? <option disabled>Select Country First</option>
                        : states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                        ))}
                </FieldSelect>

                <FieldSelect label="City" name="city" value={form.city ?? ""} onChange={handleChange} placeholder="Select your city">
                    {cities.length === 0
                        ? <option disabled>Select State First</option>
                        : cities.map((c) => (
                            <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                </FieldSelect>
            </div>

            <div className="mt-12">
                <button
                    onClick={handleSave}
                    className="rounded-full bg-[#1C4692] px-12 py-4 text-sm font-semibold text-white"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
}


function FieldInput({
    label,
    name,
    value,
    placeholder,
    onChange,
    disabled = false,
    className = "",
}: any) {
    const isFilled = Boolean(value);

    return (
        <div className={`relative ${className}`}>
            <span
                className={`
          absolute left-4 top-[-9px] bg-white px-2 text-xs
          ${isFilled ? "text-black" : "text-gray-400"}
        `}
            >
                {label}
            </span>

            <input
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`
          h-14 w-full rounded-[10px] px-4 text-sm outline-none
          ${isFilled ? "border border-black text-black" : "border border-gray-300 text-gray-400"}
          focus:border-black focus:text-black
          disabled:bg-gray-100
        `}
            />
        </div>
    );
}


function VerifiedInput({ label, value }: any) {
    const isFilled = Boolean(value);

    return (
        <div className="relative">
            <span
                className={`
          absolute left-4 top-[-9px] bg-white px-2 text-xs
          ${isFilled ? "text-black" : "text-gray-400"}
        `}
            >
                {label}
            </span>

            <input
                value={value}
                disabled
                className={`
          h-14 w-full rounded-[10px] px-4 pr-12 text-sm bg-gray-100
          ${isFilled ? "border border-black text-black" : "border border-gray-300 text-gray-400"}
        `}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1C4692]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </span>
        </div>
    );
}


function FieldSelect({ label, name, value, onChange, children }: any) {
    const isFilled = Boolean(value);

    return (
        <div className="relative">
            <span
                className={`
          absolute left-4 top-[-9px] bg-white px-2 text-xs z-10
          ${isFilled ? "text-black" : "text-gray-400"}
        `}
            >
                {label}
            </span>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`
          h-14 w-full rounded-[10px] px-4 pr-12 text-sm appearance-none outline-none bg-white
          ${isFilled ? "border border-black text-black" : "border border-gray-300 text-gray-400"}
          focus:border-black focus:text-black
        `}
            >
                <option value="">Select {label}</option>
                {children}
            </select>
        </div>
    );
}

