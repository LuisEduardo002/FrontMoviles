// Los estilos de Tailwind se cargan una vez, en la entrada de la app.
import '../global.css';
import AppRoot from '@/components/navigation/AppRoot';

export default function RootLayout() {
  return <AppRoot />;
}
