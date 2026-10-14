// Íconos de trazo, dibujados a mano para no sumar librerías.
const trazos = {
  casa: <path d="M3 10.5 12 3l9 7.5M5 9v11h5v-6h4v6h5V9" />,
  chevronAbajo: <path d="m6 9 6 6 6-6" />,
  chevronIzq: <path d="m15 18-6-6 6-6" />,
  chevronDer: <path d="m9 18 6-6-6-6" />,
  flechaIzq: <path d="M19 12H5m6-6-6 6 6 6" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
  filtros: <path d="M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0M14 4v4M8 10v4M16 16v4" />,
  buscar: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  cama: <path d="M3 18V6m0 8h18v4M3 11h7V9h8a3 3 0 0 1 3 3v2M6.5 11a1.5 1.5 0 1 0 0-.01" />,
  superficie: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 15l6-6m-4 0h4v4m-6 2H9v-4" /></>,
  auto: <path d="M5 16v3m14-3v3M3 16h18v-4l-2-5H5l-2 5v4Zm0-4h18M7 13.5h.01M17 13.5h.01" />,
  credito: <><path d="M12 3l2.2 1.6 2.7-.2.9 2.6 2.3 1.4-.8 2.6.8 2.6-2.3 1.4-.9 2.6-2.7-.2L12 21l-2.2-1.6-2.7.2-.9-2.6-2.3-1.4.8-2.6-.8-2.6 2.3-1.4.9-2.6 2.7.2Z" /><path d="m9 12 2 2 4-4" /></>,
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  reloj: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  enviar: <path d="M4 4l16 8-16 8 3-8-3-8Zm3 8h13" />,
  check: <path d="m5 12 5 5 9-10" />,
  alerta: <path d="M12 4 2.5 20h19L12 4Zm0 6v4m0 3h.01" />
}

export default function Icono({ nombre, size = 20, className, strokeWidth = 1.75, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...props}
    >
      {trazos[nombre]}
    </svg>
  )
}
