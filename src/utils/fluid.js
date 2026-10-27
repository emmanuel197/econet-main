// Proportional scaling for values designed against the 1728px comp: scales linearly with
// --vw (clamp(768px, 100vw, 1728px), see App.css), floors at px*0.444 below a 768px viewport.
// For inline styles only — for Tailwind classes, write the calc inline instead.
export const fluid = (px) => `calc(${px} / 1728 * var(--vw))`;

export default fluid;
