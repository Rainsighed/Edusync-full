from fastapi import APIRouter, WebSocket, Depends
from ..services.bci_service import get_bci_data
from ..services.mars_sync import sync_data

router = APIRouter()

@router.websocket("/ws/classroom")
async def classroom_websocket(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # Process data
        await websocket.send_text(f"Message text was: {data}")