// ============================================
// PAGE: Dashboard
// FUNGSI: Ringkasan stok, KPI, insight, perlu perhatian
// ============================================

import { useApp } from '../context/AppContext';
import { rp, nf } from '../utils/format';
import { getStatus } from '../utils/status';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

export default function Dashboard() {
  const { items, pos, createPo, go } = useApp();

  // ---------- DERIVED ----------
  const low = items.filter((i) => i.stok < i.reorder);
  const totalValue = items.reduce((a, i) => a + i.stok * i.harga, 0);
  const activePo = pos.filter((p) => p.kolom < 3).length;

  const handleAutoPo = async () => {
    await createPo('PT Nusa Tani');
    go('po');
  };

  return (
    <>
      <PageHeader
        title="Dasbor Persediaan"
        subtitle="Ringkasan stok seluruh gudang"
      />

      {/* KPI */}
      <div className="row">
        <Card className="kpi">
          <div className="l">Nilai persediaan</div>
          <div className="v">{rp(totalValue)}</div>
          <div className="d">Dihitung dari stok × harga</div>
        </Card>
        <Card className="kpi">
          <div className="l">SKU aktif</div>
          <div className="v">{items.length}</div>
          <div className="d">3 gudang</div>
        </Card>
        <Card className="kpi">
          <div className="l">Stok menipis</div>
          <div className="v">{low.length}</div>
          <div className="d r">Perlu PO segera</div>
        </Card>
        <Card className="kpi">
          <div className="l">PO berjalan</div>
          <div className="v">{activePo}</div>
          <div className="d">Lihat di menu Pembelian</div>
        </Card>
      </div>

      {/* Insight */}
      <div className="row">
        <Card variant="ai" style={{ flex: 1, minWidth: 260 }}>
          <div className="h2">Insight AI</div>
          <p>
            {low.length
              ? `${low.length} SKU di bawah titik reorder. Sistem merekomendasikan PO otomatis.`
              : 'Semua stok dalam kondisi aman. Tidak ada rekomendasi saat ini.'}
          </p>
          <Button variant="pri" onClick={handleAutoPo} disabled={!low.length}>
            Buat PO otomatis
          </Button>
        </Card>
      </div>

      {/* Perlu perhatian */}
      <Card>
        <div className="h2">Perlu perhatian</div>
        {low.length === 0 && <p className="sub">Semua stok aman.</p>}
        {low.map((i) => {
          const [tone, label] = getStatus(i);
          return (
            <div className="li" key={i.id}>
              <div>
                <b>{i.nama}</b>
                <small>{i.sku} · {i.gudang} · sisa {nf(i.stok)}</small>
              </div>
              <Badge tone={tone}>{label}</Badge>
            </div>
          );
        })}
      </Card>
    </>
  );
}