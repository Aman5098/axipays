import { motion } from "framer-motion";

function TransactionTable({ transactions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px]">
        {/* TABLE HEADER */}
        <thead className="bg-[#1E293B] border-b border-slate-700">
          <tr>
            {[
              "Order ID",
              "Card Number",
              "Email",
              "Expiry",
              "CVC",
              "Amount",
              "Currency",
              "Status",
            ].map((heading) => (
              <th
                key={heading}
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-300 whitespace-nowrap"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody className="divide-y divide-slate-700 bg-[#111827]">
          {transactions.length > 0 ? (
            transactions.map((txn, index) => (
              <motion.tr
                key={txn.orderId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-[#1E293B] transition-all duration-200"
              >
                <td className="px-6 py-4 text-slate-200 text-sm">
                  {txn.orderId}
                </td>

                <td className="px-6 py-4 text-slate-200 text-sm">
                  {txn.cardNumber
                    ? `${txn.cardNumber.slice(0, 6)}******${txn.cardNumber.slice(-4)}`
                    : "******"}
                </td>

                <td className="px-6 py-4 text-slate-200 text-sm">
                  {txn.email || "-"}
                </td>

                <td className="px-6 py-4 text-slate-200 text-sm">
                  {txn.expiryMonth} / {txn.expiryYear}
                </td>

                <td className="px-6 py-4 text-slate-200 text-sm">***</td>

                <td className="px-6 py-4 text-slate-200 text-sm">
                  {Number(txn.amount).toFixed(2)}
                </td>

                <td className="px-6 py-4 text-slate-200 text-sm">
                  {txn.currency}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-semibold ${
                      txn.status?.toLowerCase() === "success"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : txn.status?.toLowerCase() === "failed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {txn.status.toUpperCase()}
                  </span>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center py-16 text-slate-400 text-lg"
              >
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
