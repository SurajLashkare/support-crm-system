# Support CRM System

A Customer Support CRM System built using FastAPI, React, and SQLite.

## Project Overview

This application helps support teams manage customer support tickets efficiently. Users can create tickets, update ticket status, search tickets, export ticket data, and view ticket details through a modern dashboard.

## Features

### Ticket Management

* Create new support tickets
* View all tickets
* Update ticket status
* Delete tickets
* View detailed ticket information

### Dashboard Analytics

* Total tickets count
* Open tickets count
* In Progress tickets count
* Closed tickets count
* Pie chart visualization of ticket statistics

### Additional Features

* Search tickets by customer name
* Filter tickets by status
* Export tickets to CSV
* Responsive UI design
* Modal popup for ticket details
* Delete confirmation modal

## Technology Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn

### Frontend

* React.js
* Axios
* Chart.js
* React ChartJS 2
* CSS3

## Project Structure

SupportCRM/

├── backend/

│ ├── app/

│ ├── models/

│ ├── routes/

│ └── database/

│

├── frontend/

│ ├── src/

│ ├── pages/

│ ├── services/

│ └── components/

│

└── README.md

## API Endpoints

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | /api/tickets      | Get all tickets |
| POST   | /api/tickets      | Create ticket   |
| PUT    | /api/tickets/{id} | Update ticket   |
| DELETE | /api/tickets/{id} | Delete ticket   |

## Installation

### Backend

```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Author

Suraj Lashkare

## Submission

Technical Assessment Project for AI + Data Engineering Internship.
