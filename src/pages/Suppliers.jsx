import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function Suppliers() {
  const { suppliers } = useApp();
  return (
    <>
      <PageHeader title="Pemasok" subtitle={`${suppliers.length} pemasok terdaftar`} />
      <Card>
        {suppliers.map((s) => (
          <div className="li" key={s.id}>
            <div>
              <b>{s.nama}</b>
              <small>{s.kode} · {s.kota} · {s.telp}</small>
            </div>
            <Badge tone={s.aktif ? 'ok' : 'wr'}>{s.aktif ? 'Aktif' : 'Nonaktif'}</Badge>
          </div>
        ))}
      </Card>
    </>
  );
}