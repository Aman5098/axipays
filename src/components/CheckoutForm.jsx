import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

import { validateLuhn } from "../utils/luhn";
import { generateHash } from "../utils/hash";
import { initiatePayment } from "../api/payment";
import StatusModal from "./StatusModal";
import axios from "axios";

function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const formik = useFormik({
    initialValues: {
      card_holder_name: "",
      email: "",
      card_number: "",
      expiry_month: "",
      expiry_year: "",
      cvv: "",
      amount: "",
      currency: "USD",
      country: "",
      address: "",
      phone: "",
    },

    validationSchema: Yup.object({
      card_holder_name: Yup.string()
        .min(3, "Too short")
        .required("Card holder name is required"),

      email: Yup.string().email("Invalid email").required("Email is required"),

      card_number: Yup.string()
        .matches(/^[0-9\s]+$/, "Only numbers allowed")
        .min(16, "Invalid card number")
        .required("Card number is required"),

      expiry_month: Yup.string()
        .matches(/^(0[1-9]|1[0-2])$/, "Invalid month")
        .required("Expiry month is required"),

      expiry_year: Yup.string()
        .matches(/^[0-9]{4}$/, "Invalid year")
        .test(
          "future-year",
          "Card expired",
          (value) => Number(value) >= new Date().getFullYear(),
        )
        .required("Expiry year is required"),

      cvv: Yup.string()
        .matches(/^[0-9]{3,4}$/, "Invalid CVV")
        .required("CVV is required"),

      amount: Yup.number()
        .positive("Amount must be positive")
        .required("Amount is required"),

      country: Yup.string().required("Country is required"),

      address: Yup.string().required("Address is required"),

      phone: Yup.string()
        .min(8, "Invalid phone number")
        .required("Phone is required"),
    }),

    onSubmit: async (values) => {
      const cleanCardNumber = values.card_number
        .replace(/\s/g, "")
        .replace(/\./g, "");

      if (!validateLuhn(cleanCardNumber)) {
        alert("Invalid card number");
        return;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (
        Number(values.expiry_year) < currentYear ||
        (Number(values.expiry_year) === currentYear &&
          Number(values.expiry_month) < currentMonth)
      ) {
        alert("Card has expired");
        return;
      }

      try {
        setLoading(true);

        const cleanPayload = {
          orderId: `ORD-${Date.now()}`,

          cardHolderName: values.card_holder_name.trim(),

          email: values.email.trim(),

          cardNumber: cleanCardNumber,

          expiryMonth: values.expiry_month.toString(),

          expiryYear: values.expiry_year.toString(),

          cardCVC: values.cvv.trim(),

          amount: Number(values.amount),

          currency: values.currency,

          country: values.country.trim(),

          address: values.address.trim(),

          phone: values.phone.trim(),
        };

        const hash = generateHash(cleanPayload.email, cleanPayload.cardNumber);
        const response = await initiatePayment(cleanPayload, hash);
        const redirectUrl = response?.redirect_url;

        if (redirectUrl) {
          const redirectResponse = await axios.get(redirectUrl);
          if (redirectResponse.data?.status === "success") {
            setStatus("success");
          } else {
            setStatus("failed");
          }

          formik.resetForm();
        }
      } catch (err) {
        console.log(err);
        alert(err?.response?.data?.message || err?.message || "Payment failed");
      } finally {
        setLoading(false);
      }
    },
  });

  const inputClass =
    "border border-cyan-400/20 bg-white/5 text-white placeholder:text-slate-400 p-4 rounded-2xl focus:ring-2 focus:ring-cyan-400 outline-none transition-all duration-300 focus:shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:border-cyan-300/40 backdrop-blur-xl w-full";

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center p-5">
      {/* Futuristic Background */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <motion.form
        onSubmit={formik.handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white/5 backdrop-blur-2xl border border-cyan-400/20 p-8 rounded-[32px] w-full max-w-3xl shadow-[0_0_60px_rgba(0,255,255,0.08)] grid grid-cols-2 gap-5"
      >
        <h1 className="col-span-2 text-4xl font-extrabold mb-2 text-center text-white tracking-wide">
          AXIPAYS Checkout
        </h1>

        <p className="col-span-2 text-center text-slate-400 mb-6">
          Secure futuristic payment gateway
        </p>

        {/* CARD HOLDER */}
        <div>
          <input
            type="text"
            name="card_holder_name"
            placeholder="Card Holder Name"
            value={formik.values.card_holder_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.card_holder_name &&
            formik.errors.card_holder_name && (
              <p className="text-red-400 text-sm mt-1">
                {formik.errors.card_holder_name}
              </p>
            )}
        </div>

        {/* EMAIL */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.email && formik.errors.email && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* CARD NUMBER */}
        <div className="col-span-2">
          <input
            type="text"
            name="card_number"
            placeholder="Card Number"
            value={formik.values.card_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.card_number && formik.errors.card_number && (
            <p className="text-red-400 text-sm mt-1">
              {formik.errors.card_number}
            </p>
          )}
        </div>

        {/* EXPIRY MONTH */}
        <div>
          <input
            type="text"
            name="expiry_month"
            placeholder="MM"
            value={formik.values.expiry_month}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.expiry_month && formik.errors.expiry_month && (
            <p className="text-red-400 text-sm mt-1">
              {formik.errors.expiry_month}
            </p>
          )}
        </div>

        {/* EXPIRY YEAR */}
        <div>
          <input
            type="text"
            name="expiry_year"
            placeholder="YYYY"
            value={formik.values.expiry_year}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.expiry_year && formik.errors.expiry_year && (
            <p className="text-red-400 text-sm mt-1">
              {formik.errors.expiry_year}
            </p>
          )}
        </div>

        {/* CVV */}
        <div>
          <input
            type="password"
            name="cvv"
            placeholder="CVV"
            value={formik.values.cvv}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.cvv && formik.errors.cvv && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.cvv}</p>
          )}
        </div>

        {/* AMOUNT */}
        <div>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.amount && formik.errors.amount && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.amount}</p>
          )}
        </div>

        {/* CURRENCY */}
        <div>
          <select
            name="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            className={inputClass}
          >
            <option className="bg-slate-900">USD</option>
            <option className="bg-slate-900">EUR</option>
            <option className="bg-slate-900">GBP</option>
          </select>
        </div>

        {/* COUNTRY */}
        <div>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.country && formik.errors.country && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.country}</p>
          )}
        </div>

        {/* ADDRESS */}
        <div className="col-span-2">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.address && formik.errors.address && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.address}</p>
          )}
        </div>

        {/* PHONE */}
        <div className="col-span-2">
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
          />

          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-400 text-sm mt-1">{formik.errors.phone}</p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl text-lg font-bold hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:shadow-[0_0_50px_rgba(34,211,238,0.55)]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Payment...
            </div>
          ) : (
            "Pay Securely"
          )}
        </button>
      </motion.form>

      <StatusModal status={status} onClose={() => setStatus("")} />
    </div>
  );
}

export default CheckoutForm;
