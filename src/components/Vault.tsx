import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Upload, Download, Trash2 } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

interface VaultFile {
  id: string;
  name: string;
  type: string;
  prescribedAt: string; // ISO timestamp
  url: string;
}

const Vault = () => {
  const { userData, userId } = useUserData();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("report");
  const [prescribedAt, setPrescribedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:4000/files");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.files && Array.isArray(data.files)) {
        setFiles(
          data.files
            .map((file: any) => ({
              ...file,
              prescribedAt: file.prescribed_at, // map backend to frontend
            }))
            .sort(
              (a: VaultFile, b: VaultFile) =>
                new Date(b.prescribedAt).getTime() - new Date(a.prescribedAt).getTime()
            )
        );
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!uploadFile || !prescribedAt || !userId) {
      alert("File, timestamp, and userId required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("type", fileType);
      formData.append("prescribedAt", prescribedAt);
      formData.append("userId", userId);

      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      await fetchFiles();
      setUploadFile(null);
      setPrescribedAt("");
      alert("File uploaded successfully!");
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`http://localhost:4000/delete/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Delete failed' }));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      
      await fetchFiles();
      alert("File deleted successfully!");
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Delete failed');
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Report/Prescription</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Select File</Label>
                <Input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  disabled={loading}
                />
              </div>
              <div>
                <Label>Type</Label>
                <select 
                  value={fileType} 
                  onChange={(e) => setFileType(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  <option value="report">Report</option>
                  <option value="prescription">Prescription</option>
                </select>
              </div>
              <div>
                <Label>Prescribed Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={prescribedAt}
                  onChange={(e) => setPrescribedAt(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              onClick={handleUpload} 
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Uploaded Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-gray-500">Loading files...</p>
            ) : files.length === 0 ? (
              <p className="text-gray-500">No files uploaded yet.</p>
            ) : (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex justify-between items-center p-3 rounded border hover:shadow-sm"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Type: {file.type} | Prescribed:{" "}
                      {new Date(file.prescribedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      onClick={() => window.open(file.url, "_blank")}
                      disabled={loading}
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
                      onClick={() => handleDelete(file.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vault;
