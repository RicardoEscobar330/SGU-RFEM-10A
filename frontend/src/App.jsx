import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import './App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ nombreCompleto: "", email: "", telefono: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `${import.meta.env.VITE_API_PROTOCOL}://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}${import.meta.env.VITE_API_BASE}/usuarios`;

  // Obtener usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Crear usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombreCompleto || !form.email || !form.telefono) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos.'
      });
      return;
    }
    try {
      await axios.post(API_URL, form);
      setForm({ nombreCompleto: "", email: "", telefono: "" });
      fetchUsers();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Usuario agregado',
        showConfirmButton: false,
        timer: 1400
      });
    } catch (err) {
      console.error("Error al crear usuario:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el usuario.'
      });
    }
  };

  // Editar usuario
  const handleEdit = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Usuario',
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${user.nombreCompleto}">
        <input id="swal-email" class="swal2-input" placeholder="Email" value="${user.email}">
        <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${user.telefono}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          nombreCompleto: document.getElementById('swal-name').value,
          email: document.getElementById('swal-email').value,
          telefono: document.getElementById('swal-phone').value
        }
      }
    });

    if (formValues) {
      try {
        await axios.put(`${API_URL}/${user.id}`, formValues);
        fetchUsers();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Usuario actualizado',
          showConfirmButton: false,
          timer: 1400
        });
      } catch (err) {
        console.error("Error al actualizar usuario:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el usuario.'
        });
      }
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Usuario eliminado',
        showConfirmButton: false,
        timer: 1200
      });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el usuario.'
      });
    }
  };

  const formatPhone = (p) => {
    if (!p) return "-";
    return p.toString();
  };

  return (
    <div className="app-root">
      <header className="hero">
        <div className="hero-inner">
          <h1>Gestión de Usuarios</h1>
        </div>
      </header>

      <main className="container">
        <section className="card form-card">
          <h2>Nuevo usuario</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Nombre completo"
              value={form.nombreCompleto}
              onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
            />
            <input
              className="input"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input"
              type="tel"
              placeholder="Número de teléfono"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            />
            <div className="actions">
              <button className="btn primary" type="submit">Agregar usuario</button>
            </div>
          </form>
        </section>

        <section className="card list-card">
          <div className="list-header">
            <h2>Usuarios</h2>
            <div className="meta">{loading ? "Cargando..." : `${users.length} usuarios`}</div>
          </div>

          {error && <div className="alert">{error}</div>}

          {/* Responsive: grid of cards on small screens, table on wide screens */}
          <div className="users-grid">
            {users.length === 0 && !loading ? (
              <div className="empty">No hay usuarios registrados</div>
            ) : (
              users.map((u) => (
                <article className="user-card" key={u.id}>
                  <div className="user-top">
                    <div className="avatar">{(u.nombreCompleto || "").charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="user-name">{u.nombreCompleto}</div>
                      <div className="user-email">{u.email}</div>
                    </div>
                  </div>
                  <div className="user-bottom">
                    <div className="user-phone">{formatPhone(u.telefono)}</div>
                    <div className="user-actions">
                      <button className="btn primary small" onClick={() => handleEdit(u)}>
                        Editar
                      </button>
                      <button className="btn danger small" onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="table-wrap">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={`t-${u.id}`}>
                    <td>{u.id}</td>
                    <td>{u.nombreCompleto}</td>
                    <td>{u.email}</td>
                    <td>{u.telefono}</td>
                    <td className="actions-cell">
                      <button className="btn primary small" onClick={() => handleEdit(u)}>
                        Editar
                      </button>
                      <button className="btn danger small" onClick={() => handleDelete(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}