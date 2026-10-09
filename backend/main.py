from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="RoutineAI API",
    description="Backend API for the RoutineAI workflow optimizer",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development only
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "RoutineAI backend is running!",
        "status": "success",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "RoutineAI",
    }
from collections import Counter
from typing import Any
from fastapi import HTTPException
from pydantic import BaseModel, Field


class WorkflowRequest(BaseModel):
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


@app.post("/optimize")
def optimize_workflow(workflow: WorkflowRequest):
    if not workflow.nodes:
        raise HTTPException(
            status_code=400,
            detail="Please provide at least one workflow node.",
        )

    # Count nodes by their type or name.
    node_labels = []

    for node in workflow.nodes:
        label = node.get("type") or node.get("name") or node.get("id")

        if label is not None:
            node_labels.append(str(label).strip().lower())

    counts = Counter(node_labels)

    # Repeated labels are candidates for review,
    # not proof that the operations are interchangeable.
    candidates = [
        {
            "label": label,
            "occurrences": count,
            "potential_savings": count - 1,
        }
        for label, count in counts.items()
        if count > 1
    ]

    return {
        "status": "success",
        "workflow_nodes": len(workflow.nodes),
        "workflow_edges": len(workflow.edges),
        "duplicate_candidates": candidates,
        "optimization_count": len(candidates),
        "message": (
            "Analysis complete. Review duplicate candidates "
            "before changing the workflow."
        ),
        "automatic_changes_made": 0,
    }


# --- Workflow storage and feedback feature ---
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

workflows_db = []


class SavedWorkflowRequest(BaseModel):
    task: str
    category: str
    tags: list[str] = []


class FeedbackResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None
    timestamp: str


@app.post("/api/workflows", response_model=FeedbackResponse)
def create_workflow(req: SavedWorkflowRequest):
    new_workflow = {
        "id": str(uuid.uuid4())[:8],
        "task": req.task,
        "category": req.category,
        "tags": req.tags,
        "created_at": datetime.now().isoformat(),
        "status": "saved",
    }
    workflows_db.append(new_workflow)

    return FeedbackResponse(
        status="success",
        message=f"Workflow saved under category '{req.category}'.",
        data=new_workflow,
        timestamp=datetime.now().isoformat(),
    )


@app.get("/api/workflows")
def get_workflows(
    category: Optional[str] = None,
    tag: Optional[str] = None,
):
    filtered = workflows_db

    if category:
        filtered = [
            w for w in filtered
            if w["category"].lower() == category.lower()
        ]

    if tag:
        filtered = [
            w for w in filtered
            if tag.lower() in [t.lower() for t in w["tags"]]
        ]

    return {
        "status": "success",
        "message": f"Found {len(filtered)} workflows.",
        "count": len(filtered),
        "data": filtered,
    }


@app.post("/api/optimize/{workflow_id}", response_model=FeedbackResponse)
def optimize_existing(workflow_id: str):
    for wf in workflows_db:
        if wf["id"] == workflow_id:
            wf["status"] = "re-optimized"
            return FeedbackResponse(
                status="success",
                message="Workflow status updated successfully.",
                data=wf,
                timestamp=datetime.now().isoformat(),
            )

    raise HTTPException(status_code=404, detail="Workflow not found")

# --- Real web search using Tavily ---
import os
from tavily import TavilyClient
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=2)


@app.post("/search")
def search_web(request: SearchRequest):
    api_key = os.getenv("TAVILY_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Tavily API key is not configured on the server.",
        )

    try:
        client = TavilyClient(api_key=api_key)
        response = client.search(
            query=request.query,
            max_results=5,
            search_depth="basic",
        )

        results = [
            {
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": item.get("content", ""),
            }
            for item in response.get("results", [])
        ]

        return {
            "status": "success",
            "query": request.query,
            "count": len(results),
            "results": results,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Web search failed: {str(exc)}",
        )