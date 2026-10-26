import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Users() {
  const { users } = useApp();
  return (
    <>
      <PageHeader title="Pengguna & Akses" subtitle={`${users.length} pengguna`} />
      <Card>
        {users.map((u) => (
          <div className="li" key={u.id}>
            <div>
              <b>{u.nama}</b>
              <small>{u.email}</small>
            </div>
            <Badge tone={u.role === 'Admin' ? 'if' : 'ok'}>{u.role}</Badge>
          </div>
        ))}
      </Card>
    </>
  );
}