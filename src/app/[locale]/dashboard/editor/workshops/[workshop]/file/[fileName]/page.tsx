"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document, DocumentCategory } from "@/types/document";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import { DocumentViewer } from "@/components/admin/DocumentViewer/DocumentViewer";

export default function WorkshopFileDetailPage() {
  const params = useParams();
  const workshopId = params?.workshop as string;
  const fileName = params?.fileName as string;
  const router = useRouter();
  const { supabase } = useAuth();
  const t = useTranslations("DocumentViewer");

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [generatingUrl, setGeneratingUrl] = useState(false);
  const [_workshopTitle, setWorkshopTitle] = useState<string | null>(null);

  // Generate signed URL for the file
  const generateSignedUrl = useCallback(async (filePath: string) => {
    setGeneratingUrl(true);
    try {
      const { data, error } = await supabase.storage
        .from("workshops")
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      if (error) throw error;
      if (data?.signedUrl) {
        setSignedUrl(data.signedUrl);
      } else {
        throw new Error(t("signedUrlError"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGeneratingUrl(false);
    }
  }, [supabase, t]);

  // Fetch file data
  useEffect(() => {
    const fetchFile = async () => {
      if (!workshopId || !fileName) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch the workshop to get the folder_path and title
        const { data: workshop, error: workshopError } = await supabase
          .from("workshops")
          .select("folder_path, title")
          .eq("id", workshopId)
          .single();
        if (workshopError || !workshop) {
          throw new Error(t("documentNotFound"));
        }
        setWorkshopTitle(workshop.title);
        // The file path is folder_path + '/' + fileName
        const filePath = `${workshop.folder_path}/${decodeURIComponent(fileName)}`;
        // Extract file type
        const fileType = fileName.split(".").pop()?.toLowerCase() || "unknown";
        // Create a document object
        const documentData: Document = {
          id: filePath,
          title: fileName,
          description: undefined,
          category: "Miscellaneous" as DocumentCategory,
          file_name: fileName,
          file_type: fileType,
          file_size: 0,
          file_path: filePath,
          file_url: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: "",
          created_by_name: undefined,
          author_name: workshop.title || undefined,
          content_url: filePath,
          region: undefined,
          language: undefined,
        };
        setDocument(documentData);
        // Generate signed URL for the file
        void generateSignedUrl(filePath);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    void fetchFile();
  }, [workshopId, fileName, supabase, t, generateSignedUrl]);

  // Handle file download
  const handleDownload = useCallback(async () => {
    if (!document?.file_path) {
      setError(t("noContentUrl"));
      return;
    }
    setGeneratingUrl(true);
    try {
      const { data, error } = await supabase.storage
        .from("workshops")
        .createSignedUrl(document.file_path, 60 * 5); // 5 min expiry
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      } else {
        throw new Error(t("downloadUrlError"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGeneratingUrl(false);
    }
  }, [document, supabase, t]);

  // Handle back navigation
  const handleBack = useCallback(() => router.back(), [router]);

  if (!document && !loading && !error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700">{t("documentNotFound")}</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-900"
        >
          {t("goBack")}
        </button>
      </div>
    );
  }

  return (
    <DocumentViewer
      document={document as Document}
      signedUrl={signedUrl}
      loading={loading}
      error={error}
      generatingUrl={generatingUrl}
      onBack={handleBack}
      onDownload={() => { void handleDownload(); }}
      t={t}
    />
  );
}