import { Navigate } from 'react-router-dom';

export default function Profile(): JSX.Element {
  return <Navigate to="/settings#profile" replace />;
}
