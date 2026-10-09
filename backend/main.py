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