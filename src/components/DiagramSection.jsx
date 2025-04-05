import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import JSZip from "jszip";

export default function DiagramSection({ darkMode, setDiagram, accessToken }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [diagramType, setDiagramType] = useState("");
  const [diagramTypes, setDiagramTypes] = useState([]);
  const [generatedDiagram, setGeneratedDiagram] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch diagram types on component mount
  useEffect(() => {
    const fetchDiagramTypes = async () => {
      try {
        const response = await fetch("https://devexy-backend.azurewebsites.net/diagrams/types", {
          headers: {
            "Accept": "application/json",
            "Authorization": accessToken
          }
        });
        if (!response.ok) throw new Error("Failed to fetch diagram types");
        const data = await response.json();
        setDiagramTypes(data.diagram_types);
      } catch (err) {
        console.error("Error fetching diagram types:", err);
        setError("Failed to load diagram types. Using defaults.");
        setDiagramTypes([
          { type: "architecture", name: "Architecture Diagram" },
          { type: "activity", name: "Activity Diagram" },
          { type: "schema", name: "Schema Diagram" },
          { type: "user flow", name: "User Flow Diagram" },
          { type: "workflow", name: "Workflow Diagram" }
        ]);
      }
    };
    fetchDiagramTypes();
  }, [accessToken]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
    setExtractedFiles([]);
    setGeneratedDiagram(null);

    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const isZip = file.type === "application/zip" || file.name.toLowerCase().endsWith(".zip");
      if (!isZip) {
        setError("Please upload a valid zip file");
      }
    }
  };

  const handleExtract = async () => {
    if (files.length === 0) {
      setError("Please upload a zip file first");
      return;
    }

    if (files[0].type !== "application/zip" && !files[0].name.toLowerCase().endsWith(".zip")) {
      setError("Please upload a valid zip file");
      return;
    }

    try {
      setIsExtracting(true);
      const zip = new JSZip();
      const extracted = await zip.loadAsync(files[0]);
      const extractedFilesArray = [];

      for (const [path, file] of Object.entries(extracted.files)) {
        if (!file.dir) {
          const content = await file.async("string");
          extractedFilesArray.push({ name: file.name, path, content });
        }
      }

      if (extractedFilesArray.length === 0) {
        throw new Error("No files found in the ZIP archive");
      }

      setExtractedFiles(extractedFilesArray);
      setError(null);
    } catch (err) {
      console.error("Error extracting ZIP:", err);
      setError(err.message || "Failed to extract ZIP file. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!diagramType) {
      setError("Please select a diagram type");
      return;
    }

    if (extractedFiles.length === 0) {
      setError("Please extract files first");
      return;
    }

    try {
      setIsUploading(true);

      const payload = {
        files: extractedFiles.map(file => ({
          content: file.content,
          filepath: file.path
        })),
        diagram_type: diagramType,
        description: "Generate diagram based on the provided files"
      };

      const response = await fetch("https://devexy-backend.azurewebsites.net/diagrams/generate", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": accessToken
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setGeneratedDiagram(result);
      setDiagram(result);
      setError(null);
    } catch (err) {
      console.error("Error generating diagram:", err);
      setError(err.message || "Failed to generate diagram. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Architecture Diagrams</h2>

      <div className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h3 className="text-xl font-semibold mb-3 text-gray-200">Upload Files</h3>
        <p className={`mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Upload a zip file, extract it, and generate an architecture diagram.
        </p>

        <div className="flex flex-col space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
              darkMode ? "border-gray-600 hover:border-green-500" : "border-gray-300 hover:border-green-500"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".zip"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Drag & drop your zip file here or <span className="text-green-500">browse</span>
            </p>
          </div>

          {files.length > 0 && (
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} text-white`}>
              <h4 className="font-medium mb-2">Selected File:</h4>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>{files[0].name}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={isExtracting || files.length === 0 || (files[0].type !== "application/zip" && !files[0].name.toLowerCase().endsWith(".zip"))}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 ${
              (isExtracting || files.length === 0 || files[0].type !== "application/zip" && !files[0].name.toLowerCase().endsWith(".zip")) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isExtracting ? "Extracting..." : "Extract Files"}
          </button>

          {extractedFiles.length > 0 && (
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} text-white`}>
              <h4 className="font-medium mb-2">Extracted Files:</h4>
              <div className="max-h-40 overflow-y-auto">
                <ul className="space-y-1">
                  {extractedFiles.map((file, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>{file.path}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <label className={`block mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Diagram Type (Required)
            </label>
            <select
              value={diagramType}
              onChange={(e) => setDiagramType(e.target.value)}
              className={`w-full p-2 rounded-lg ${
                darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
              } border`}
              required
            >
              <option value="">Select a diagram type</option>
              {diagramTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isUploading || extractedFiles.length === 0 || !diagramType}
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 ${
              (isUploading || extractedFiles.length === 0 || !diagramType) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Generating..." : "Generate Diagram"}
          </button>

          {generatedDiagram && (
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"} text-white mt-4`}>
              <h4 className="font-medium mb-2">Generated Diagram:</h4>
              <pre className="text-sm overflow-x-auto bg-gray-800 p-2 rounded">
                {JSON.stringify(generatedDiagram, null, 2)}
              </pre>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
}
