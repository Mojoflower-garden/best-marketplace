"use client";
import axios from "axios";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

export const DownloadRetirementButton = ({
  retirementId,
  organizationId,
}: {
  retirementId: string;
  organizationId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: secrets } = api.icr.getSecrets.useQuery({
    organizationId,
  });
  return (
    <Button
      isLoading={isLoading}
      disabled={isLoading}
      size={"icon"}
      onClick={async () => {
        setIsLoading(true);

        try {
          const response = await axios.get(
            `${secrets?.baseURL}/organizations/${organizationId}/retirements/${retirementId}/pdf`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${secrets?.token}`,
              },
            },
          );

          // Get the content disposition filename from the response headers
          const contentDisposition = response.headers["content-disposition"];
          const filename = contentDisposition
            ? contentDisposition.split("filename=")[1]
            : "retirement-certificate.pdf";

          // Create a URL for the blob response
          const url = window.URL.createObjectURL(new Blob([response.data]));

          // Create a temporary link element and trigger the download
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();

          // Clean up
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error downloading file:", error);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <Download />
    </Button>
  );
};

export function downloadFileFromBuffer(
  buffer: Buffer,
  filename: string,
  fileType: string,
) {
  const byteArray = new Uint8Array(buffer);
  const blob = new Blob([byteArray], { type: fileType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the memory held by the blob URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
