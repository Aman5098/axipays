import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock3, Sparkles } from "lucide-react";

function StatusModal({ status, onClose }) {
  if (!status) return null;

  const normalizedStatus = status.toLowerCase();
  const isSuccess = normalizedStatus === "success";
  const isFailed = normalizedStatus === "failed";
  const isPending = normalizedStatus === "pending";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-5"
      >
        {/* Glow Background */}
        <div
          className={`absolute w-[350px] h-[350px] blur-[120px] rounded-full ${
            isSuccess
              ? "bg-emerald-500/20"
              : isFailed
                ? "bg-red-500/20"
                : "bg-yellow-500/20"
          }`}
        />

        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
            y: 30,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          exit={{
            scale: 0.8,
            opacity: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="relative z-10 w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(255,255,255,0.08)] overflow-hidden"
        >
          {/* Top Glow Line */}
          <div
            className={`h-1 w-full ${
              isSuccess
                ? "bg-emerald-400"
                : isFailed
                  ? "bg-red-400"
                  : "bg-yellow-400"
            }`}
          />

          <div className="p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 12,
              }}
              className={`mx-auto mb-6 w-24 h-24 rounded-full flex items-center justify-center ${
                isSuccess
                  ? "bg-emerald-500/15"
                  : isFailed
                    ? "bg-red-500/15"
                    : "bg-yellow-500/15"
              }`}
            >
              {isSuccess && (
                <CheckCircle className="w-14 h-14 text-emerald-400" />
              )}

              {isFailed && <XCircle className="w-14 h-14 text-red-400" />}

              {isPending && (
                <Clock3 className="w-14 h-14 text-yellow-400 animate-pulse" />
              )}
            </motion.div>

            {/* Title */}
            <h2
              className={`text-4xl font-extrabold tracking-wide mb-3 ${
                isSuccess
                  ? "text-emerald-400"
                  : isFailed
                    ? "text-red-400"
                    : "text-yellow-400"
              }`}
            >
              {status}
            </h2>

            {/* Subtitle */}
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              {isSuccess && "Your payment was processed successfully."}

              {isFailed && "Payment could not be completed. Please try again."}

              {isPending && "Your payment is currently being processed."}
            </p>

            {/* Decorative */}
            <div className="flex items-center justify-center gap-2 mb-8 text-cyan-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm tracking-widest uppercase">
                AXIPAYS Secure Gateway
              </span>
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Button */}
            <button
              onClick={onClose}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] ${
                isSuccess
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-[0_0_30px_rgba(16,185,129,0.45)]"
                  : isFailed
                    ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_30px_rgba(239,68,68,0.45)]"
                    : "bg-gradient-to-r from-yellow-500 to-amber-600 shadow-[0_0_30px_rgba(234,179,8,0.45)]"
              } text-white`}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default StatusModal;
