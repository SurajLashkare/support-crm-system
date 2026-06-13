import "../dashboard.css";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [ticketToDelete, setTicketToDelete] =
  useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await API.get("/api/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTicket = async () => {
    try {
      await API.post("/api/tickets", {
        customer_name: customerName,
        customer_email: customerEmail,
        subject: subject,
        description: description,
      });

      setCustomerName("");
      setCustomerEmail("");
      setSubject("");
      setDescription("");

      await fetchTickets();
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (ticketId, newStatus) => {
    try {
      await API.put(`/api/tickets/${ticketId}`, {
  status: newStatus,
});

await fetchTickets();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTicket = (ticketId) => {
  setTicketToDelete(ticketId);
  setShowDeleteModal(true);
};

const confirmDeleteTicket = async () => {
  try {
    await API.delete(
  `/api/tickets/${ticketToDelete}`
);

await fetchTickets();

    setShowDeleteModal(false);
    setTicketToDelete(null);
  } catch (error) {
    console.error(error);
  }
};

  const exportCSV = () => {
    const headers = [
      "Ticket ID",
      "Customer",
      "Email",
      "Subject",
      "Status",
    ];

    const rows = tickets.map((ticket) => [
      ticket.ticket_id,
      ticket.customer_name,
      ticket.customer_email,
      ticket.subject,
      ticket.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "tickets.csv";
    link.click();
  };

  const viewTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.customer_name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "In Progress"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "Closed"
  ).length;

  const chartData = {
  labels: [
    "Open",
    "In Progress",
    "Closed",
  ],
  datasets: [
    {
      data: [
        openTickets,
        inProgressTickets,
        closedTickets,
      ],
      backgroundColor: [
        "#22c55e",
        "#f59e0b",
        "#ef4444",
      ],
      borderWidth: 1,
    },
  ],
};

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Support CRM Dashboard
      </h1>

      <div className="stats-container">
  <div className="stat-card total">

          <h3>Total Tickets</h3>
          <h2>{totalTickets}</h2>
        </div>

        <div className="stat-card open">
          <h3>Open</h3>
          <h2>{openTickets}</h2>
        </div>

        <div className="stat-card progress">
          <h3>In Progress</h3>
          <h2>{inProgressTickets}</h2>
        </div>

        <div className="stat-card closed">
          <h3>Closed</h3>
          <h2>{closedTickets}</h2>
        </div>
      </div>

      <div className="chart-card">
  <h2>Ticket Statistics</h2>

  <div
    style={{
      width: "350px",
      margin: "0 auto",
    }}
  >
    <Pie data={chartData} />
  </div>
</div>

      <div className="form-section">
        <h3>Create New Ticket</h3>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Customer Email"
            value={customerEmail}
            onChange={(e) =>
              setCustomerEmail(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button
            className="create-btn"
            onClick={createTicket}
          >
            Create Ticket
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button
          className="create-btn"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search Customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>
      </div>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTickets.map((ticket) => (
            <tr key={ticket.ticket_id}>
              <td>{ticket.ticket_id}</td>
              <td>{ticket.customer_name}</td>
              <td>{ticket.subject}</td>

              <td>
                <select
                  className="status-select"
                  value={ticket.status}
                  onChange={(e) =>
                    updateStatus(
                      ticket.ticket_id,
                      e.target.value
                    )
                  }
                >
                  <option value="Open">
                    Open
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Closed">
                    Closed
                  </option>
                </select>
              </td>

              <td>
                <button
                  className="create-btn"
                  style={{
                    marginRight: "8px",
                    padding: "8px 12px",
                  }}
                  onClick={() =>
                    viewTicket(ticket)
                  }
                >
                  View
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteTicket(ticket.ticket_id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showDeleteModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Delete Ticket</h2>

      <p>
        Are you sure you want to delete
        this ticket?
      </p>

      <div className="modal-actions">
        <button
          className="cancel-btn"
          onClick={() =>
            setShowDeleteModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="delete-btn"
          onClick={confirmDeleteTicket}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Ticket Details</h2>

            <p>
              <strong>ID:</strong>{" "}
              {selectedTicket.ticket_id}
            </p>

            <p>
              <strong>Customer:</strong>{" "}
              {selectedTicket.customer_name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {selectedTicket.customer_email}
            </p>

            <p>
              <strong>Subject:</strong>{" "}
              {selectedTicket.subject}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {selectedTicket.description}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedTicket.status}
            </p>

            <button
              className="create-btn"
              onClick={() =>
                setSelectedTicket(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;