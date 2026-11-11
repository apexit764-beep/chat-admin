import { Navigate, Route, Routes } from 'react-router-dom';
import { VendorShell } from '@v/components/VendorShell';
import { Forgot, Login, CreatePassword } from '@v/pages/Auth';
import Home from '@v/pages/Home';
import Clients from '@v/pages/Clients';
import Payouts from '@v/pages/Payouts';
import Account from '@v/pages/Account';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/invite/:vid" element={<CreatePassword mode="invite" />} />
      <Route path="/reset/:vid" element={<CreatePassword mode="reset" />} />
      <Route element={<VendorShell />}>
        <Route path="/home" element={<Home />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/account" element={<Account />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
