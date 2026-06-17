import { useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  ImageOff,
  Maximize2,
  X,
  ZoomIn,
} from "lucide-react";

interface Props {
  url: string;
}

const EXTENSIONES_IMAGEN = ["jpg", "jpeg", "png", "gif", "webp", "avif", "bmp", "svg"];

function nombreArchivo(url: string): string {
  return decodeURIComponent(url.split("/").pop()?.split("?")[0] || "Archivo del proyecto");
}

function extension(url: string): string {
  const nombre = nombreArchivo(url);
  const i = nombre.lastIndexOf(".");
  return i >= 0 ? nombre.slice(i + 1).toLowerCase() : "";
}

/** Vista previa bonita de la imagen/archivo de un proyecto (imagen, PDF o fallback). */
export default function ProyectoImagenPreview({ url }: Props) {
  const ext = extension(url);
  const esImagen = EXTENSIONES_IMAGEN.includes(ext);
  const esPdf = ext === "pdf";
  const nombre = nombreArchivo(url);

  const [cargando, setCargando] = useState(esImagen);
  const [errorImg, setErrorImg] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const Toolbar = () => (
    <div className="mt-3 flex items-center justify-between gap-3">
      <p className="text-sm font-medium text-gray-700 truncate" title={nombre}>
        {nombre}
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        {esImagen && !errorImg && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            <Maximize2 size={14} />
            Ampliar
          </button>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium hover:from-blue-700 hover:to-blue-800 hover:shadow-md transition-all"
        >
          <ExternalLink size={14} />
          Abrir
        </a>
        <a
          href={url}
          download={nombre}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download size={14} />
        </a>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-blue-50/60 p-4 shadow-sm">
      {/* Imagen */}
      {esImagen && !errorImg && (
        <div
          className="group relative flex items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-[radial-gradient(circle_at_center,#f8fafc_0,#eef2ff_100%)] cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          {cargando && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
            </div>
          )}
          <img
            src={url}
            alt={nombre}
            onLoad={() => setCargando(false)}
            onError={() => {
              setCargando(false);
              setErrorImg(true);
            }}
            className="max-h-[420px] w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Overlay hover */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-lg">
              <ZoomIn size={16} />
              Ampliar
            </span>
          </div>
        </div>
      )}

      {/* PDF */}
      {esPdf && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <iframe
            src={`${url}#toolbar=0&view=FitH`}
            title={nombre}
            className="h-[480px] w-full"
          />
        </div>
      )}

      {/* Fallback (HEIC u otro no renderizable, o imagen rota) */}
      {!esImagen && !esPdf && (
        <FallbackCard nombre={nombre} />
      )}
      {esImagen && errorImg && <FallbackCard nombre={nombre} roto />}

      <Toolbar />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
          <img
            src={url}
            alt={nombre}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

function FallbackCard({ nombre, roto }: { nombre: string; roto?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        {roto ? <ImageOff size={26} /> : <FileText size={26} />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">
          {roto ? "No se pudo cargar la vista previa" : "Vista previa no disponible"}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{nombre}</p>
      </div>
    </div>
  );
}
