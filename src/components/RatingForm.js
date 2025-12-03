import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/RatingForm.tsx
import { useMemo, useState } from "react";
import { Stars } from "./Stars";
import { Button } from "./Button";
export default function RatingForm({ onSubmit, busy = false, }) {
    const [vals, setVals] = useState({
        taste: 0,
        price: 0,
        location: 0,
        environment: 0,
        comment: "",
    });
    const overall = useMemo(() => {
        const { taste, price, location, environment } = vals;
        const filled = [taste, price, location, environment].filter(Boolean);
        return filled.length ? ((taste + price + location + environment) / 4).toFixed(1) : "0.0";
    }, [vals]);
    const disabled = !vals.taste || !vals.price || !vals.location || !vals.environment || busy;
    function setField(k, v) {
        setVals((x) => ({ ...x, [k]: v }));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        await onSubmit(vals);
        setVals({ taste: 0, price: 0, location: 0, environment: 0, comment: "" });
    }
    return (_jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [_jsxs("div", { className: "divide-y", children: [_jsxs("div", { className: "py-2 flex items-center justify-between gap-4", children: [_jsx("span", { className: "w-32 text-sm text-gray-700", children: "Taste" }), _jsx("div", { className: "star-wrapper", children: _jsx(Stars, { rating: vals.taste, interactive: true, onRatingChange: (v) => setField("taste", v) }) })] }), _jsxs("div", { className: "py-2 flex items-center justify-between gap-4", children: [_jsx("span", { className: "w-32 text-sm text-gray-700", children: "Price" }), _jsx("div", { className: "star-wrapper", children: _jsx(Stars, { rating: vals.price, interactive: true, onRatingChange: (v) => setField("price", v) }) })] }), _jsxs("div", { className: "py-2 flex items-center justify-between gap-4", children: [_jsx("span", { className: "w-32 text-sm text-gray-700", children: "Location" }), _jsx("div", { className: "star-wrapper", children: _jsx(Stars, { rating: vals.location, interactive: true, onRatingChange: (v) => setField("location", v) }) })] }), _jsxs("div", { className: "py-2 flex items-center justify-between gap-4", children: [_jsx("span", { className: "w-32 text-sm text-gray-700", children: "Environment" }), _jsx("div", { className: "star-wrapper", children: _jsx(Stars, { rating: vals.environment, interactive: true, onRatingChange: (v) => setField("environment", v) }) })] })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Comments (optional)" }), _jsx("textarea", { className: "min-h-[90px] w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300", placeholder: "What did you like or dislike?", value: vals.comment, onChange: (e) => setField("comment", e.target.value) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["Overall: ", overall, "/5"] }), _jsx(Button, { disabled: disabled, children: busy ? "Submitting…" : "Submit rating" })] })] }));
}
