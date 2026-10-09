const ROUTINEAI_API = "http://127.0.0.1:8000";

async function checkRoutineAIBackend() {
    try {
        const response = await fetch(`${ROUTINEAI_API}/health`);

        if (!response.ok) {
            throw new Error(`Health check failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("RoutineAI backend connected:", data);
        return true;
    } catch (error) {
        console.error("RoutineAI backend connection failed:", error);
        return false;
    }
}

async function sendWorkflowToRoutineAI(nodes, edges = []) {
    const response = await fetch(`${ROUTINEAI_API}/optimize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nodes, edges })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || `API error: ${response.status}`);
    }

    console.log("RoutineAI optimization analysis:", result);
    return result;
}

checkRoutineAIBackend();

async function optimizeWorkflowWithAPI() {
    const nodes = [
        { id: "step-1", type: "search", name: "Web research" },
        { id: "step-2", type: "reasoning", name: "Analyze results" },
        { id: "step-3", type: "search", name: "Web research" },
        { id: "step-4", type: "validation", name: "Validate results" }
    ];

    const edges = [
        { source: "step-1", target: "step-2" },
        { source: "step-2", target: "step-3" },
        { source: "step-3", target: "step-4" }
    ];

    try {
        const result = await sendWorkflowToRoutineAI(nodes, edges);
        alert("RoutineAI API analysis complete!\n" +
              JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(error);
        alert("Optimization API failed: " + error.message);
    }
}
async function optimizeWorkflow() {
    const button = document.getElementById("optimizeWorkflowBtn");

    const workflow = {
        nodes: [
            { id: "step-1", type: "search", name: "Web research" },
            { id: "step-2", type: "reasoning", name: "Analyze results" },
            { id: "step-3", type: "search", name: "Web research" },
            { id: "step-4", type: "validation", name: "Validate results" }
        ],
        edges: [
            { source: "step-1", target: "step-2" },
            { source: "step-2", target: "step-3" },
            { source: "step-3", target: "step-4" }
        ]
    };

    try {
        button.disabled = true;
        button.textContent = "Analyzing...";

        const response = await fetch("http://127.0.0.1:8000/optimize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workflow)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || "Backend request failed");
        }

        console.log("Backend result:", result);
        alert("Backend connected!\n" + JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(error);
        alert("Backend connection failed. Check that your Python server is running.");
    } finally {
        button.disabled = false;
        button.textContent = "⚡ Optimize Workflow";
    }
}