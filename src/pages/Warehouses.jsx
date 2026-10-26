import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { nf } from '../utils/format';

export default function Warehouses() {
  const { warehouses, items } = useApp();
  return (
    <>
      <PageHeader title="Gudang & Lokasi" subtitle={`${warehouses.length} gudang aktif`} />
      <div className="row">
        {warehouses.map((w) => {
          const totalStok = items.filter((i) => i.gudang === w.nama).reduce((a, i) => a + i.stok, 0);
          return (
            <Card key={w.id} style={{ flex: 1, minWidth: 220 }}>
              <div className="h2">{w.nama}</div>
              <div className="sub">{w.kota} · Kapasitas {nf(w.kapasitas)}</div>
              <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>
                {nf(totalStok)} <span style={{fontSize:14, color:'var(--mut)'}}>unit</span>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}