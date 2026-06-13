from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .schemas import TicketCreate, TicketUpdate

from .crud import (
    create_ticket,
    get_all_tickets,
    get_ticket_by_id,
    update_ticket_status,
    delete_ticket
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Support CRM API",
    description="Customer Support Ticketing System built with FastAPI and SQLite",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://support-crm-frontend-3vnn.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Support CRM API Running Successfully"
    }


@app.post("/api/tickets")
def create_new_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    created_ticket = create_ticket(db, ticket)

    return {
        "ticket_id": created_ticket.ticket_id,
        "status": created_ticket.status
    }


@app.get("/api/tickets")
def get_tickets(
    search: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):

    tickets = get_all_tickets(
        db,
        search,
        status
    )

    return tickets


@app.get("/api/tickets/{ticket_id}")
def get_ticket_detail(
    ticket_id: str,
    db: Session = Depends(get_db)
):

    ticket = get_ticket_by_id(
        db,
        ticket_id
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return ticket


@app.put("/api/tickets/{ticket_id}")
def update_ticket(
    ticket_id: str,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = update_ticket_status(
        db,
        ticket_id,
        ticket_update.status
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return {
        "success": True,
        "ticket_id": ticket.ticket_id,
        "status": ticket.status
    }

@app.delete("/api/tickets/{ticket_id}")
def delete_ticket_api(
    ticket_id: str,
    db: Session = Depends(get_db)
):

    deleted = delete_ticket(
        db,
        ticket_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return {
        "success": True,
        "message": "Ticket deleted successfully"
    }