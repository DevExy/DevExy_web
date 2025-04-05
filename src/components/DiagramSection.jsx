import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import JSZip from "jszip";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";

// Custom node component from existing DiagramSection
const CustomNode = ({ data, selected }) => {
  return (
    <div
      className={`p-3 rounded-lg shadow-md transition-all ${
        selected ? "ring-2 ring-green-400" : ""
      }`}
      style={{
        background: data.background || "#E6F3FF",
        color: data.textColor || "#000000",
        border: data.border || "1px solid #222",
        width: data.width || "200px",
      }}
    >
      {/* Adding handles from DashboardPage */}
      <Handle
        type="source"
        position="top"
        id="top"
        style={{ background: '#555', width: 10, height: 10 }}
      />
      <Handle
        type="source"
        position="right"
        id="right"
        style={{ background: '#555', width: 10, height: 10 }}
      />
      <div className="font-bold text-sm mb-1">{data.label.split('\n')[0]}</div>
      <div className="text-xs opacity-80">{data.label.split('\n').slice(1).join('\n')}</div>
      {data.techStack && (
        <div className="mt-2">
          <div className="text-xs font-semibold mb-1">Tech Stack:</div>
          <div className="flex flex-wrap gap-1">
            {data.techStack.map((tech, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded bg-white bg-opacity-20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
      <Handle
        type="target"
        position="bottom"
        id="bottom"
        style={{ background: '#555', width: 10, height: 10 }}
      />
      <Handle
        type="target"
        position="left"
        id="left"
        style={{ background: '#555', width: 10, height: 10 }}
      />
    </div>
  );
};

// Custom Edge Component from DashboardPage
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}) => {
  const edgePath = `M${sourceX},${sourceY} C${sourceX + (targetX - sourceX) / 2},${sourceY} ${sourceX + (targetX - sourceX) / 2},${targetY} ${targetX},${targetY}`;
  const labelX = sourceX + (targetX - sourceX) / 2;
  const labelY = sourceY + (targetY - sourceY) / 2;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {label && (
        <foreignObject
          width={100}
          height={40}
          x={labelX - 50}
          y={labelY - 20}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className="edge-label-foreignobject">
            <div className="edge-label bg-white bg-opacity-70 px-2 py-1 rounded text-xs text-center">
              {label}
            </div>
          </div>
        </foreignObject>
      )}
    </>
  );
};

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

export default function DiagramSection({ darkMode, setDiagram }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [diagramType, setDiagramType] = useState("");
  const [diagramTypes, setDiagramTypes] = useState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const fileInputRef = useRef(null);
  const [accessToken, setAccessToken] = useState("");
  const [diagramTitle, setDiagramTitle] = useState("");
  const [diagramDescription, setDiagramDescription] = useState("");
  // Additional states from DashboardPage
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Existing useEffect for token and diagram types
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    const fetchDiagramTypes = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("https://devexy-backend.azurewebsites.net/diagrams/types", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
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

  // Adding default diagram from DashboardPage
  useEffect(() => {
    if (!diagramTitle && nodes.length === 0 && edges.length === 0) {
      const defaultDiagram = {
        diagram_type: "architecture",
        data: {
          elements: [
            { id: "web_browser", type: "external_system", name: "Web Browser", description: "User interface for interacting with the application", tech_stack: ["HTML", "JavaScript"], position: { x: 50, y: 100 } },
            { id: "flask_app", type: "component", name: "Flask Application", description: "Main application handling web requests", tech_stack: ["Python", "Flask"], position: { x: 350, y: 200 } },
            { id: "file_system", type: "data_store", name: "File System", description: "Storage for uploaded videos", tech_stack: ["OS"], position: { x: 650, y: 100 } },
            { id: "conn_web_flask", type: "connection", source: "web_browser", target: "flask_app", description: "HTTP requests" },
            { id: "conn_flask_file", type: "connection", source: "flask_app", target: "file_system", description: "File I/O" },
          ],
          title: "Deepfake Detection System Architecture",
          description: "System architecture diagram showing components and connections",
        },
      };
      setDiagram(defaultDiagram);
      transformDataToFlowElements(defaultDiagram);
    }
  }, [setDiagram, diagramTitle, nodes.length, edges.length]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(null);
    setExtractedFiles([]);
    setNodes([]);
    setEdges([]);
    setDiagramTitle("");
    setDiagramDescription("");

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

  const transformDataToFlowElements = (result) => {
    if (!result || !result.data) return { nodes: [], edges: [] };

    setDiagramTitle(result.data.title || "Untitled Diagram");
    setDiagramDescription(result.data.description || "");

    const newNodes = result.data.elements
      .filter((el) => el.type !== "connection")
      .map((el) => {
        let nodeType = "custom";
        let background = darkMode ? "#4B5EAA" : "#E6F3FF";
        let textColor = darkMode ? "#FFFFFF" : "#000000";

        switch(el.type) {
          case "component":
            background = darkMode ? "#2E7D32" : "#C8E6C9";
            break;
          case "external_system":
            background = darkMode ? "#1565C0" : "#BBDEFB";
            break;
          case "data_store":
            background = darkMode ? "#6A1B9A" : "#E1BEE7";
            break;
        }

        return {
          id: el.id,
          type: nodeType,
          data: { 
            label: `${el.name || "Unnamed"}\n${el.description || ""}`,
            techStack: el.tech_stack,
            background,
            textColor,
            border: el.style?.border || "1px solid #222",
            width: "220px"
          },
          position: {
            x: el.position?.x ?? 0,
            y: el.position?.y ?? 0,
          },
          style: {
            borderRadius: "8px",
          },
        };
      });

    const nodePositions = {};
    newNodes.forEach(node => nodePositions[node.id] = node.position);

    const getHandles = (source, target) => {
      const sourcePos = nodePositions[source];
      const targetPos = nodePositions[target];
      if (!sourcePos || !targetPos) return { sourceHandle: "right", targetHandle: "left" };
      const dx = targetPos.x - sourcePos.x;
      const dy = targetPos.y - sourcePos.y;
      return Math.abs(dx) > Math.abs(dy)
        ? { sourceHandle: dx > 0 ? "right" : "left", targetHandle: dx > 0 ? "left" : "right" }
        : { sourceHandle: dy > 0 ? "bottom" : "top", targetHandle: dy > 0 ? "top" : "bottom" };
    };

    const newEdges = result.data.elements
      .filter((el) => el.type === "connection")
      .map((el) => {
        const { sourceHandle, targetHandle } = getHandles(el.source, el.target);
        return {
          id: el.id || `edge_${el.source}_${el.target}`,
          source: el.source || "",
          target: el.target || "",
          sourceHandle,
          targetHandle,
          type: "custom",
          animated: true,
          label: el.description || "",
          style: {
            stroke: darkMode ? "#FFFFFF" : "#000000",
            strokeWidth: 2,
            strokeDasharray: el.style?.lineStyle === "dash" ? "5,5" : "none",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: darkMode ? "#FFFFFF" : "#000000",
          },
        };
      });

    setNodes(newNodes);
    setEdges(newEdges);
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
  
      const filesPayload = extractedFiles.map(file => ({
        content: file.content,
        filepath: file.path
      }));
  
      const requestBody = {
        files: filesPayload,
        diagram_type: diagramType,
        description: "Generate diagram based on the provided files"
      };
  
      const response = await fetch("https://devexy-backend.azurewebsites.net/diagrams/generate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("isAuthenticated");
          setError("Session expired. Please login again.");
          return;
        }
        throw new Error(await response.text());
      }
  
      const result = await response.json();
      setDiagram(result);
  
      transformDataToFlowElements(result);
      setError(null);
  
      setTimeout(() => {
        if (reactFlowInstance) {
          reactFlowInstance.fitView({ padding: 0.5 });
        }
      }, 100);
    } catch (err) {
      console.error("Error generating diagram:", err);
      setError(err.message || "Failed to generate diagram. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onConnect = useCallback(
    (params) => {
      const newLabel = prompt("Enter connection label:", "");
      if (newLabel !== null) {
        const newEdge = {
          ...params,
          type: "custom",
          animated: true,
          label: newLabel,
          id: `edge_${params.source}_${params.target}_${Math.random().toString(36).substr(2, 9)}`,
          markerEnd: { type: MarkerType.ArrowClosed, color: darkMode ? "#FFFFFF" : "#000000" },
          style: { stroke: darkMode ? "#FFFFFF" : "#000000", strokeWidth: 2 },
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [darkMode, setEdges]
  );

  const onInit = (rfi) => {
    setReactFlowInstance(rfi);
  };

  // Additional functionality from DashboardPage
  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
    const newLabel = prompt("Edit connection label:", edge.label);
    if (newLabel !== null) {
      setEdges((eds) => eds.map((e) => (e.id === edge.id ? { ...e, label: newLabel } : e)));
    }
  }, [setEdges]);

  const onEdgeDelete = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges]);

  const editElement = (elementId) => {
    const element = nodes.find(n => n.id === elementId);
    if (!element) return;
    const newName = prompt("Edit component name:", element.data.label.split('\n')[0]);
    if (newName) {
      setNodes(nds => nds.map(node => 
        node.id === elementId 
          ? { ...node, data: { ...node.data, label: `${newName}\n${node.data.label.split('\n').slice(1).join('\n')}` } }
          : node
      ));
    }
  };

  const addElement = () => {
    const newElement = {
      id: `component_${Math.random().toString(36).substr(2, 9)}`,
      type: "custom",
      position: { x: 200, y: 200 },
      data: {
        label: "New Component\nDescription",
        techStack: ["Technology"],
        background: darkMode ? "#2E7D32" : "#C8E6C9",
        textColor: darkMode ? "#FFFFFF" : "#000000",
        width: "220px",
      },
    };
    setNodes(nds => [...nds, newElement]);
  };

  const onNodeDragStart = (event, node) => {
    setSelectedElement(node);
    setIsDragging(true);
  };

  const onNodeDrag = (event, node) => {
    if (isDragging && selectedElement) {
      setNodes(nds => nds.map(nd => 
        nd.id === node.id ? { ...nd, position: { x: node.position.x, y: node.position.y } } : nd
      ));
    }
  };

  const onNodeDragStop = () => {
    setIsDragging(false);
    setSelectedElement(null);
  };

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

      {(nodes.length > 0 || edges.length > 0) && (
        <div className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                {diagramTitle}
              </h3>
              {diagramDescription && (
                <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {diagramDescription}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addElement}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Add Component
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-lg text-sm font-medium transition-all duration-300"
              >
                Save Diagram
              </button>
            </div>
          </div>
          
          <div className="h-[600px] w-full rounded-xl overflow-hidden border">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                onEdgeClick={onEdgeClick}
                onEdgeDoubleClick={(e, edge) => onEdgeDelete(edge.id)}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={(e, node) => editElement(node.id)}
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                fitView
                nodesDraggable
                style={{ background: darkMode ? "#1F2937" : "#F9FAFB" }}
                defaultEdgeOptions={{
                  type: 'custom',
                  animated: true,
                  markerEnd: { type: MarkerType.ArrowClosed, color: darkMode ? "#FFFFFF" : "#000000" },
                  style: { stroke: darkMode ? "#FFFFFF" : "#000000", strokeWidth: 2 },
                }}
              >
                <Background 
                  color={darkMode ? "#4B5563" : "#D1D5DB"} 
                  gap={16} 
                  variant={darkMode ? "dots" : "lines"}
                />
                <Controls 
                  position="top-right" 
                  showInteractive={false}
                  className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-1 rounded shadow`}
                />
                <MiniMap 
                  nodeColor={(node) => node.data?.background || (darkMode ? "#4B5EAA" : "#E6F3FF")}
                  maskColor={darkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"}
                  style={{
                    backgroundColor: darkMode ? "#374151" : "#F3F4F6",
                  }}
                />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </div>
      )}
    </div>
  );
}