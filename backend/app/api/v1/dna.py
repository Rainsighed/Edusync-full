from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..services.dna_storage import encode_dna, decode_dna
from ..db.session import get_db

router = APIRouter()

@router.post("/encode")
async def encode_dna_endpoint(data: str, db: Session = Depends(get_db)):
    encoded_data = encode_dna(data)
    return {"encoded": encoded_data}

@router.post("/decode")
async def decode_dna_endpoint(encoded_data: str, db: Session = Depends(get_db)):
    decoded_data = decode_dna(encoded_data)
    return {"decoded": decoded_data}