import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
