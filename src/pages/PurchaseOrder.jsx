// ============================================
// PAGE: PurchaseOrder
// FUNGSI: Kanban PO dari Draft → Selesai
// ============================================

import { useApp } from '../context/AppContext';
import { rp } from '../utils/format';
import { PO_COLUMNS } from '../data/constants';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

export default function PurchaseOrder() {
  const { items, pos, movePo, createPo } = useApp();
  const need = items.filter((i) => i.stok < i.reorder).length;

  return (
    <>
      <PageHeader
        title="Pembelian (Purchase Order)"
        subtitle="Pantau PO dari draft sampai barang diterima"
        action={
          <Button variant="pri" onClick={() => createPo('Pemasok baru')}>
            + Buat PO
          </Button>
        }
      />

      <Card variant="ai">
        <div className="h2">Rekomendasi pemesanan ulang</div>
        <p>
          {need} SKU berada di bawah titik reorder. Sistem mengelompokkan
          per pemasok agar ongkir lebih hemat.
        </p>
        <Button variant="pri" onClick={() => createPo('PT Nusa Tani')}>
          Buat PO otomatis
        </Button>
      </Card>

      <div className="row">
        {PO_COLUMNS.map((colName, ci) => (
          <section
            className="col"
            aria-label={colName}
            key={colName}
          >
            <h3>{colName} ({pos.filter((p) => p.kolom === ci).length})</h3>
            {pos.filter((p) => p.kolom === ci).map((p) => {
              const isDone = p.kolom >= PO_COLUMNS.length - 1;
              return (
                <div className="po" key={p.id}>
                  <b>{p.kode}</b>
                  <small>{p.supplier}</small>
                  <div className="f">
                    <span>{rp(p.amount)}</span>
                    {isDone ? (
                      <Badge tone="ok">Selesai</Badge>
                    ) : (
                      <Button size="sm" onClick={() => movePo(p.kode)}>
                        Lanjut
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </>
  );
}