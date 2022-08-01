import Navbar from './Navbar'
import Footer from './Footer';
import { ClusterModal } from "components/ClusterModal";
// import { MessageBanner } from "components/MessageBanner";
import { SearchBar } from "components/SearchBar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen h-full'>
      <div className='flex-1'>
        <ClusterModal />
        <Navbar />
        {/* <MessageBanner />*/}
        <div style={{ margin: '0 5%' }}>
          { children }
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;