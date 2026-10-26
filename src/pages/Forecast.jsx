import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';

export default function Forecast() {
  const { items } = useApp();
  const low = items.filter((i) => i.stok < i.reorder);
  return (
    <>
      <PageHeader title="Prediksi & Reorder" subtitle="Berdasarkan data historis" />
      <Card variant="ai">
        <div className="h2">Analisis AI</div>
        <p>Terdapat {low.length} produk yang diprediksi akan segera habis.</p>
        <p>Segera buat Purchase Order (PO) untuk menjaga ketersediaan stok.</p>
      </Card>
    </>
  );
}