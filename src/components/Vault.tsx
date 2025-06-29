import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Upload, Download, Trash2 } from "lucide-react";

interface VaultFile {
  id: string;
  name: string;
  type: string;
  prescribedAt: string; // ISO timestamp
  url: string;
}

const Vault = () => {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("report");
  const [prescribedAt, setPrescribedAt] = useState("");

  // Fetch files from backend
  const fetchFiles = async () => {
    const res = await fetch("http://localhost:4000/files");
    const data = await res.json();
    setFiles(
      data.files.sort(
        (a: VaultFile, b: VaultFile) =>
          new Date(b.prescribedAt).getTime() - new Date(a.prescribedAt).getTime()
      )
    );
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!uploadFile || !prescribedAt) return alert("File and timestamp required");

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("type", fileType);
    formData.append("prescribedAt", prescribedAt);

    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      fetchFiles();
      setUploadFile(null);
      setPrescribedAt("");
    } else {
      alert("Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`http://localhost:4000/delete/${id}`, { method: "DELETE" });
    if (res.ok) fetchFiles();
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
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Prescribed Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={prescribedAt}
                  onChange={(e) => setPrescribedAt(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleUpload}>Upload</Button>
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
            {files.length === 0 ? (
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
                    <Button variant="outline" onClick={() => window.open(file.url, "_blank")}>
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
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
