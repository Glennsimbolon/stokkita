import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function Integrations() {
  return (
    <>
      <PageHeader title="Integrasi" subtitle="Hubungkan dengan platform lain" />
      <Card>
        <div className="li">
          <div><b>WhatsApp Bot</b><small>Notifikasi stok ke HP</small></div>
          <Badge tone="wr">Segera</Badge>
        </div>
        <div className="li">
          <div><b>Tokopedia / Shopee</b><small>Sinkronisasi pesanan</small></div>
          <Badge tone="wr">Segera</Badge>
        </div>
      </Card>
    </>
  );
}