// Isotipo de IAL Propiedades: tres hojas dentro de un círculo, sobre un cuadrado ladrillo.
export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="100" height="100" rx="24" fill="var(--color-ladrillo)" />
      <g transform="translate(14 14) scale(.72)" fill="var(--color-superficie)">
        <path d="M17.8 20A44 44 0 0 1 82.2 20Q50 46 17.8 20Z" />
        <path d="M17.8 20A44 44 0 0 1 82.2 20Q50 46 17.8 20Z" transform="rotate(120 50 50)" />
        <path d="M17.8 20A44 44 0 0 1 82.2 20Q50 46 17.8 20Z" transform="rotate(240 50 50)" />
      </g>
    </svg>
  )
}
