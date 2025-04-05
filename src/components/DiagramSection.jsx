import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import JSZip from "jszip";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

export default function DiagramSection({ darkMode, setDiagram }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [diagramType, setDiagramType] = useState("");
  const [diagramTypes, setDiagramTypes] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const fileInputRef = useRef(null);
  const [accessToken, setAccessToken] = useState("");

  // Get token from localStorage when component mounts
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // Fetch diagram types on component mount or when accessToken changes
  useEffect(() => {
    const fetchDiagramTypes = async () => {
      if (!accessToken) return; // Don't fetch if no token

      try {
        const response = await fetch("https://devexy-backend.azurewebsites.net/diagrams/types", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token might be expired or invalid
            localStorage.removeItem("access_token");
            localStorage.removeItem("isAuthenticated");
            setError("Session expired. Please login again.");
            return;
          }
          throw new Error("Failed to fetch diagram types");
        }
        
        const data = await response.json();
        setDiagramTypes(data.diagram_types || []);
      } catch (err) {
        console.error("Error fetching diagram types:", err);
        setError("Failed to load diagram types. Using defaults.");
        setDiagramTypes([
          { type: "architecture", name: "Architecture Diagram" },
          { type: "activity", name: "Activity Diagram" },
          { type: "schema", name: "Schema Diagram" },
          { type: "user flow", name: "User Flow Diagram" },
          { type: "workflow", name: "Workflow Diagram" },
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
    setNodes([]);
    setEdges([]);

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
    if (!accessToken) {
      setError("Authentication required. Please login first.");
      return;
    }

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

      // First, create a FormData object for the file upload
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("diagram_type", diagramType);

      // Send the request with authorization header
      const response = await fetch("https://devexy-backend.azurewebsites.net/diagrams/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      console.log(body);

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired or invalid
          localStorage.removeItem("access_token");
          localStorage.removeItem("isAuthenticated");
          setError("Session expired. Please login again.");
          return;
        }
        throw new Error(await response.text());
      }

      const result = await response.json();

      // Update the parent component with the diagram data
      setDiagram(result);

      // Transform response into ReactFlow nodes and edges with safety checks
      const newNodes = result.data.elements
        .filter((el) => el.type !== "connection")
        .map((el) => ({
          id: el.id,
          type: "default",
          data: { label: `${el.name || "Unnamed"}\n${el.description || ""}` },
          position: {
            x: el.position?.x ?? 0,
            y: el.position?.y ?? 0,
          },
          style: {
            background: darkMode ? "#4B5EAA" : "#E6F3FF",
            color: darkMode ? "#FFFFFF" : "#000000",
            border: el.style?.border || "1px solid #222",
            borderRadius: "5px",
            padding: "10px",
            width: 200,
          },
        }));

      const newEdges = result.data.elements
        .filter((el) => el.type === "connection")
        .map((el) => ({
          id: el.id,
          source: el.source || "",
          target: el.target || "",
          type: "smoothstep",
          animated: true,
          style: {
            stroke: darkMode ? "#FFFFFF" : "#000000",
            strokeDasharray: el.style?.lineStyle === "dash" ? "5,5" : "none",
          },
        }));

      setNodes(newNodes);
      setEdges(newEdges);
      setError(null);
    } catch (err) {
      console.error("Error generating diagram:", err);
      setError(err.message || "Failed to generate diagram. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: "smoothstep", animated: true }, eds)),
    [setEdges]
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) =>
        changes.reduce((acc, change) => {
          if (change.type === "position" && change.dragging) {
            return acc.map((node) =>
              node.id === change.id ? { ...node, position: { x: change.x, y: change.y } } : node
            );
          }
          return acc;
        }, [...nds])
      );
    },
    [setNodes]
  );

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>Architecture Diagrams</h2>

      {!accessToken && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg mb-6">
          You need to be logged in to generate diagrams. Please login first.
        </div>
      )}

      <div className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Upload Files</h3>
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
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Selected File:</h4>
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
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{files[0].name}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleExtract}
            disabled={
              isExtracting ||
              files.length === 0 ||
              (files[0].type !== "application/zip" && !files[0].name.toLowerCase().endsWith(".zip"))
            }
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 ${
              isExtracting ||
              files.length === 0 ||
              (files[0].type !== "application/zip" && !files[0].name.toLowerCase().endsWith(".zip"))
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isExtracting ? "Extracting..." : "Extract Files"}
          </button>

          {extractedFiles.length > 0 && (
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
              <h4 className={`font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Extracted Files:</h4>
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
                      <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{file.path}</span>
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
            disabled={isUploading || extractedFiles.length === 0 || !diagramType || !accessToken}
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300 ${
              isUploading || extractedFiles.length === 0 || !diagramType || !accessToken ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? "Generating..." : "Generate Diagram"}
          </button>

          {error && (
            <div className={`p-4 rounded-lg ${
              error.includes("expired") || error.includes("required") 
                ? "bg-yellow-100 text-yellow-800" 
                : "bg-red-100 text-red-700"
            }`}>
              {error}
            </div>
          )}
        </div>
      </div>

      {nodes.length > 0 && (
        <div className="h-[600px] w-full rounded-xl shadow-lg overflow-hidden">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onConnect={onConnect}
              fitView
              nodesDraggable
              nodesConnectable
              style={{ background: darkMode ? "#1F2937" : "#F9FAFB" }}
            >
              <Background color={darkMode ? "#4B5563" : "#D1D5DB"} gap={16} />
              <Controls />
              <MiniMap nodeColor={(node) => (darkMode ? "#4B5EAA" : "#E6F3FF")} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      )}
    </div>
  );
}