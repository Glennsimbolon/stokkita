// ============================================
// PAGE: SalesOrder
// FUNGSI: Kanban penjualan (SO)
// ============================================

import { useApp } from '../context/AppContext';
import { rp } from '../utils/format';
import { SO_COLUMNS } from '../data/constants';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

export default function SalesOrder() {
  const { so, moveSo, createSo } = useApp();

  return (
    <>
      <PageHeader
        title="Penjualan (Sales Order)"
        subtitle="Pantau pesanan pelanggan dari Baru → Selesai"
        action={
          <Button variant="pri" onClick={() => createSo('Pelanggan baru')}>
            + Buat SO
          </Button>
        }
      />

      <div className="row">
        {SO_COLUMNS.map((colName, ci) => (
          <section className="col" aria-label={colName} key={colName}>
            <h3>{colName} ({so.filter((s) => s.kolom === ci).length})</h3>
            {so.filter((s) => s.kolom === ci).map((s) => {
              const isDone = s.kolom >= SO_COLUMNS.length - 1;
              return (
                <div className="po" key={s.id}>
                  <b>{s.kode}</b>
                  <small>{s.customer}</small>
                  <div className="f">
                    <span>{rp(s.amount)}</span>
                    {isDone ? (
                      <Badge tone="ok">Selesai</Badge>
                    ) : (
                      <Button size="sm" onClick={() => moveSo(s.kode)}>
                        Lanjut
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {so.filter((s) => s.kolom === ci).length === 0 && (
              <p className="sub" style={{ padding: 8 }}>Tidak ada pesanan</p>
            )}
          </section>
        ))}
      </div>

      <Card>
        <div className="h2">Total SO aktif</div>
        <p className="sub">
          {so.filter((s) => s.kolom < 3).length} pesanan sedang berjalan,{' '}
          {so.filter((s) => s.kolom === 3).length} selesai.
        </p>
      </Card>
    </>
  );
}