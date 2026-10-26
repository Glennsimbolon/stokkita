import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { rp } from '../utils/format';

export default function Reports() {
  const { items } = useApp();
  const totalNilai = items.reduce((a, i) => a + i.stok * i.harga, 0);
  return (
    <>
      <PageHeader title="Laporan" subtitle="Ringkasan nilai persediaan" />
      <Card>
        <div className="h2">Total Nilai Persediaan</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--acc)' }}>
          {rp(totalNilai)}
        </div>
      </Card>
    </>
  );
}