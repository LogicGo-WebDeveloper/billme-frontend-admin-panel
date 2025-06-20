import { useSearchParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../config/route.const";
import { RxCross2 } from "react-icons/rx";

const InvoicePreview = () => {
  const [searchParams] = useSearchParams();
  const pdfUrl = searchParams.get("url");
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h1 className="text-lg font-semibold text-gray-800">Invoice Preview</h1>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD.INVOICES)}
          className="text-sm bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 transition"
        >
          <RxCross2 />
        </button>
      </div>

      {/* PDF Viewer via Google Docs (CORS Safe) */}
      <div className="flex-1 overflow-hidden">
        {pdfUrl ? (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(
              pdfUrl
            )}&embedded=true`}
            title="Invoice PDF Preview"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        ) : (
          <div className="text-center mt-10 text-red-500">Invalid PDF URL</div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;
