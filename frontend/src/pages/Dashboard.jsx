import { useSelector } from "react-redux";

export default function Dashboard() {
  const user = useSelector(s => s.auth.user);
  return (
    <section>
      <h1 className="title">Dashboard</h1>
      <p>Nume complet: <strong>{user?.first_name} {user?.last_name}</strong></p>
      <p>Rol: <strong>{user?.role}</strong></p>
    </section>
  );
}
