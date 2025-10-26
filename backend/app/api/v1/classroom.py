from fastapi import APIRouter, WebSocket, Depends
from datetime import datetime
import random
from ...services.bci_service import get_bci_data
from ...services.analytics_lake import get_neuro_data
from ...services.mars_sync import sync_data

router = APIRouter()

@router.websocket("/ws/classroom")
async def classroom_websocket(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # Process data
        await websocket.send_text(f"Message text was: {data}")

@router.get("/classroom/neuro")
async def get_neuro_metrics():
    """
    Get neuro metrics data for analytics dashboard.

    Returns:
        dict: Neuro metrics including attention, focus, and engagement
    """
    # Generate mock neuro data
    metrics = {
        "attention": round(random.uniform(60, 95), 2),
        "focus": round(random.uniform(55, 90), 2),
        "engagement": round(random.uniform(65, 98), 2),
    }

    return {
        "metrics": metrics,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/classroom/bci")
async def get_bci_metrics():
    """
    Get BCI (Brain-Computer Interface) data.

    Returns:
        dict: BCI status and data
    """
    # Generate mock BCI data
    return {
        "status": "connected",
        "data": {
            "signal_strength": round(random.uniform(0.7, 0.95), 2),
            "connected": True,
            "device_id": "BCI-001",
            "battery_level": random.randint(65, 100)
        }
    }