from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
from .models import Ticket


def create_ticket(db: Session, ticket_data):

    count = db.query(Ticket).count() + 1

    ticket_number = f"TKT-{count:03d}"

    new_ticket = Ticket(
        ticket_id=ticket_number,
        customer_name=ticket_data.customer_name,
        customer_email=ticket_data.customer_email,
        subject=ticket_data.subject,
        description=ticket_data.description,
        status="Open"
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket


def get_all_tickets(
    db: Session,
    search: str = None,
    status: str = None
):

    query = db.query(Ticket)

    if search:
        query = query.filter(
            or_(
                Ticket.ticket_id.contains(search),
                Ticket.customer_name.contains(search),
                Ticket.customer_email.contains(search),
                Ticket.subject.contains(search),
                Ticket.description.contains(search)
            )
        )

    if status:
        query = query.filter(
            Ticket.status == status
        )

    return query.all()


def get_ticket_by_id(
    db: Session,
    ticket_id: str
):

    return db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()


def update_ticket_status(
    db: Session,
    ticket_id: str,
    status: str
):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        return None

    ticket.status = status
    ticket.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket

def delete_ticket(
    db: Session,
    ticket_id: str
):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        return False

    db.delete(ticket)
    db.commit()

    return True