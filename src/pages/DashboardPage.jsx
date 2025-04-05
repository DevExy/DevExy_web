import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DiagramSection from "../components/DiagramSection";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
// Custom node component for better visualization
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
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

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
  data
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={200}
        height={100}
        x={labelX - 100}
        y={labelY - 25}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="edge-label-foreignobject">
          <div className="edge-label">
            {data.label}
          </div>
        </div>
      </foreignObject>
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};


export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Diagram-specific states
  const [diagram, setDiagram] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const diagramContainerRef = useRef(null);
  
  // ReactFlow states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUsername(userData.username || "User");

    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDarkMode);

    if (!diagram && activeNav === "diagram") {
      const defaultDiagram = {
        diagram_type: "architecture",
        data: {
          elements: [
            { id: "flask_app", type: "component", name: "Flask Application", description: "Main application handling HTTP requests", tech_stack: ["Python", "Flask"], position: { x: 200, y: 100 } },
            { id: "web_browser", type: "external_system", name: "Web Browser", description: "User interface", tech_stack: ["HTML", "JavaScript"], position: { x: 50, y: 100 } },
            { id: "deepfake_model", type: "data_store", name: "Deepfake Model", description: "Detection model", tech_stack: ["TensorFlow"], position: { x: 400, y: 300 } },
            { id: "connection1", type: "connection", source: "web_browser", target: "flask_app", description: "HTTP requests" }
          ],
          layout: "hierarchical",
          metadata: { version: "1.0" },
          title: "Architecture Diagram",
          description: "System architecture"
        }
      };
      
      setDiagram(defaultDiagram);
      updateFlowElements(defaultDiagram);
    }
  }, [navigate, activeNav]);

  useEffect(() => {
    if (diagram) {
      updateFlowElements(diagram);
    }
  }, [diagram, darkMode]);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const edgeUpdateSuccessful = useRef(true);

  const updateFlowElements = (diagramData) => {
    if (!diagramData || !diagramData.data) return;

    const newNodes = diagramData.data.elements
      .filter((el) => el.type !== "connection")
      .map((el) => {
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
          type: "custom",
          data: { 
            label: `${el.name || "Unnamed"}\n${el.description || ""}`,
            techStack: el.tech_stack,
            background,
            textColor,
            border: el.style?.border || "1px solid #222",
            width: "220px"
          },
          position: el.position || { x: 0, y: 0 },
          style: {
            borderRadius: "8px",
          },
        };
      });

    const newEdges = diagramData.data.elements
      .filter((el) => el.type === "connection")
      .map((el) => ({
        id: el.id,
        source: el.source || "",
        target: el.target || "",
        type: "smoothstep",
        animated: true,
        label: el.description || "",
        style: {
          stroke: darkMode ? "#FFFFFF" : "#000000",
          strokeWidth: 2,
          strokeDasharray: el.style?.lineStyle === "dashed" ? "5,5" : "none",
        },
        labelStyle: {
          fill: darkMode ? "#FFFFFF" : "#000000",
          fontSize: "10px",
        },
        markerEnd: {
          type: "arrowclosed",
          color: darkMode ? "#FFFFFF" : "#000000",
        },
      }));

    setNodes(newNodes);
    setEdges(newEdges);
  };
  const onEdgeClick = useCallback((event, edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
    const newLabel = prompt("Edit connection label:", edge.label);
    if (newLabel !== null) {
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id === edge.id) {
            return {
              ...e,
              label: newLabel,
              data: { ...e.data, label: newLabel }
            };
          }
          return e;
        })
      );
    }
  }, []);

  // Handle edge delete
  const onEdgeDelete = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdge(null);
  }, []);

  // Handle connection creation
  const onConnect = useCallback(
    (params) => {
      const newLabel = prompt("Enter connection label:", "");
      if (newLabel !== null) {
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              type: "custom",
              animated: true,
              label: newLabel,
              data: { label: newLabel },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: darkMode ? "#FFFFFF" : "#000000",
              },
              style: {
                stroke: darkMode ? "#FFFFFF" : "#000000",
                strokeWidth: 2,
              },
            },
            eds
          )
        );
      }
    },
    [darkMode]
  );


  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const editElement = (elementId) => {
    const element = nodes.find(n => n.id === elementId);
    if (!element) return;
    
    const newName = prompt("Edit component name:", element.data.label.split('\n')[0]);
    if (newName) {
      const newLabel = `${newName}\n${element.data.label.split('\n').slice(1).join('\n')}`;
      
      setNodes(nds => nds.map(node => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel
            }
          };
        }
        return node;
      }));
    }
  };

  const addElement = () => {
    const newElement = {
      id: `component_${Math.random().toString(36).substr(2, 9)}`,
      type: "component",
      position: { x: 200, y: 200 },
      data: {
        label: "New Component\nDescription",
        techStack: ["Technology"],
        background: darkMode ? "#2E7D32" : "#C8E6C9",
        textColor: darkMode ? "#FFFFFF" : "#000000",
        width: "220px"
      }
    };
    
    setNodes(nds => [...nds, newElement]);
  };

  const onNodeDragStart = (event, node) => {
    setSelectedElement(node);
    setIsDragging(true);
  };

  const onNodeDrag = (event, node) => {
    if (isDragging && selectedElement) {
      setNodes(nds => nds.map(nd => {
        if (nd.id === node.id) {
          return {
            ...nd,
            position: {
              x: node.position.x,
              y: node.position.y
            }
          };
        }
        return nd;
      }));
    }
  };

  const onNodeDragStop = () => {
    setIsDragging(false);
    setSelectedElement(null);
  };

  const renderDashboard = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Projects", "Tasks", "Analytics"].map((item) => (
          <motion.div
            key={item}
            whileHover={{ scale: 1.03 }}
            className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <h3 className="text-xl font-semibold mb-3">{item}</h3>
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Your {item.toLowerCase()} information will appear here.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
  const renderDiagram = () => (
    <>
      <DiagramSection darkMode={darkMode} setDiagram={setDiagram} />
      {diagram && diagram.diagram_type === "architecture" && (
        <div className={`p-6 rounded-xl shadow-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{diagram.data.title}</h3>
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
          
          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {diagram.data.description}
          </p>
          
            
          <div className="h-[600px] w-full rounded-xl overflow-hidden border">
            <ReactFlowProvider>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeClick={onEdgeClick}
                onEdgeDoubleClick={(event, edge) => onEdgeDelete(edge.id)}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={(event, node) => editElement(node.id)}
                onNodeDragStart={onNodeDragStart}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onInit={setReactFlowInstance}
                fitView
                style={{ background: darkMode ? "#1F2937" : "#F9FAFB" }}
                connectionLineStyle={{
                  stroke: darkMode ? "#FFFFFF" : "#000000",
                  strokeWidth: 2,
                }}
                defaultEdgeOptions={{
                  type: 'custom',
                  animated: true,
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: darkMode ? "#FFFFFF" : "#000000",
                  },
                  style: {
                    stroke: darkMode ? "#FFFFFF" : "#000000",
                    strokeWidth: 2,
                  },
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
    </>
  );

  const renderAbout = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">About DevExy</h2>
      <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          DevExy is a powerful development platform designed to help developers streamline their workflow and increase productivity.
        </p>
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Our mission is to provide innovative tools that make development more efficient and enjoyable.
        </p>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
      <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          We'd love to hear from you! Please reach out to us with any questions or feedback.
        </p>
        <div className="mt-6">
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg transition-all duration-300">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard": return renderDashboard();
      case "diagram": return renderDiagram();
      case "about": return renderAbout();
      case "contact": return renderContact();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`w-full min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-gray-50 to-green-50 text-gray-800"} transition-colors duration-300`}>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${darkMode ? "bg-green-500" : "bg-green-300"} opacity-20`}
            style={{ width: Math.random() * 8 + 4, height: Math.random() * 8 + 4, left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh` }}
            animate={{ y: [0, -Math.random() * 100 - 50], x: [0, (Math.random() - 0.5) * 50], opacity: [0.2, 0] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, repeatType: "loop" }}
          />
        ))}
      </div>

      <header className={`w-full ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md z-10`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="DevExy Logo" className="h-6 w-auto" />
            <span className={`ml-2 text-xl font-light ${darkMode ? "text-green-400" : "text-green-600"}`}>DevExy</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Welcome, <span className="font-medium">{username}</span>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggleTheme} className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-700"}`}>
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
              Sign Out
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className={`w-64 border-r ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-lg z-10`}>
          <div className="py-6 px-4">
            <ul className="space-y-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" /></svg>) },
                { id: "diagram", label: "Diagram", icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" /></svg>) },
                { id: "about", label: "About", icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>) },
                { id: "contact", label: "Contact", icon: (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>) }
              ].map((item) => (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveNav(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeNav === item.id
                        ? `${darkMode ? "bg-green-600 text-white" : "bg-green-100 text-green-800"}`
                        : `${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`
                    }`}
                  >
                    <span className={activeNav === item.id ? "text-current" : `${darkMode ? "text-gray-400" : "text-gray-500"}`}>{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <main className="flex-1 overflow-auto relative z-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}