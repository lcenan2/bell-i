import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
export function Stars({ rating, maxRating = 5, size = 20, interactive = false, onRatingChange }) {
    const [hoverIndex, setHoverIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(rating ? Math.max(0, Math.floor(rating) - 1) : null);
    // Sync selectedIndex if parent rating changes
    useEffect(() => {
        if (typeof rating === 'number' && rating > 0) {
            setSelectedIndex(Math.max(0, Math.floor(rating) - 1));
        }
    }, [rating]);
    const handleClick = (index) => {
        if (interactive && onRatingChange) {
            // set selected and hover so UI reflects selection immediately
            setSelectedIndex(index);
            setHoverIndex(index);
            onRatingChange(index + 1);
        }
    };
    const handleKeyDown = (e, index) => {
        if (!interactive || !onRatingChange)
            return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedIndex(index);
            setHoverIndex(index);
            onRatingChange(index + 1);
        }
        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            onRatingChange(index);
        }
        if (e.key === 'ArrowRight' && index < maxRating - 1) {
            e.preventDefault();
            onRatingChange(index + 2);
        }
    };
    const displayCount = hoverIndex !== null ? hoverIndex + 1 : (selectedIndex !== null ? selectedIndex + 1 : Math.round(rating || 0));
    return (_jsx("div", { className: "flex gap-1 items-center leading-none", role: interactive ? 'radiogroup' : undefined, children: Array.from({ length: maxRating }, (_, index) => {
            const filled = index < displayCount;
            const StarSVG = ({ filled }) => (_jsx("svg", { viewBox: "0 0 24 24", width: size, height: size, "aria-hidden": "true", children: _jsx("path", { d: "M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 20.201 4.665 24 6 15.6 0 9.753l8.332-1.735L12 .587z", fill: filled ? '#F59E0B' : '#D1D5DB' }) }));
            return (_jsx("div", { className: "inline-block star-wrapper focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 rounded", onClick: () => handleClick(index), onMouseEnter: () => interactive && setHoverIndex(index), onMouseLeave: () => interactive && setHoverIndex(null), onKeyDown: (e) => handleKeyDown(e, index), role: interactive ? 'radio' : undefined, "aria-checked": interactive ? rating >= index + 1 : undefined, tabIndex: interactive ? 0 : -1, style: { cursor: interactive ? 'pointer' : 'default' }, children: _jsx(StarSVG, { filled: filled }) }, index));
        }) }));
}
