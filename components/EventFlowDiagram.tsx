import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow";
import { db } from "@/lib/firebase"; // Assuming firebase config is in lib/firebase
import { doc, getDoc } from "firebase/firestore";
import "reactflow/dist/style.css";

interface EventFlowDiagramProps {
    eventId: string;
  }


const EventFlowDiagram = ({ eventId }: { eventId: string }) => {
  const [flowData, setFlowData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use React Flow hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  useEffect(() => {
    // Fetch event flow diagram from Firestore
    const fetchEventFlowDiagram = async () => {
      try {
        const docRef = doc(db, "eventOutputs", eventId); // Get the event output from Firestore
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = docSnap.data();
          const { eventFlowDiagram } = eventData;
          const nodesWithDraggable = eventFlowDiagram.nodes.map((node: any) => ({
            ...node,
            draggable: true,
          }));

          // Set the flow data from the Firestore document
          setFlowData(eventFlowDiagram);
          setNodes(eventFlowDiagram.nodes);  // Set nodes from Firestore
          setEdges(eventFlowDiagram.edges);  // Set edges from Firestore
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        setError("Error fetching event flow diagram.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventFlowDiagram();
  }, [eventId]);

  const onConnect = (connection: Connection) =>
    setEdges((eds: any) => addEdge(connection, eds));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // If we have flowData, pass it to React Flow
  return flowData ? (
    <div style={{ height: "600px", width: "100%" }}>
      <ReactFlow
        nodes={nodes} // Pass nodes from Firestore data
        edges={edges} // Pass edges from Firestore data
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  ) : (
    <div>No flow diagram available</div>
  );
};

export default EventFlowDiagram;
