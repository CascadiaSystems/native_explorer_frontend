import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SearchBar } from "components/SearchBar";
import { IconButton, List, ListItem,  SwipeableDrawer, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


import { clusterPath } from "utils/url";
import { ClusterStatusButton } from "components/ClusterStatusButton";
// import Logo from "img/logos-solana/dark-explorer-logo.svg";

const navItems = [
  {
    label: 'Cluster Stats',
    link: '/'
  },
  {
    label: 'Supply',
    link: '/supply'
  },
  {
    label: 'Inspector',
    link: '/tx/inspector'
  },
];

const Navbar = () => {
  // TODO: use `collapsing` to animate collapsible navbar
  // const [collapse, setCollapse] = useState(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleDrawer = (val: boolean) => (event: React.MouseEvent | React.KeyboardEvent) => {
    setMenuOpen(val);
  }
  
  
  return (
    // <nav className="navbar navbar-expand-md navbar-light">
    //   <div className="container">
    //     <Link to={clusterPath("/")}>
    //       <img src={Logo} height="30" alt="Velas Native Explorer" />
    //     </Link>

    //     <button
    //       className="navbar-toggler"
    //       type="button"
    //       onClick={() => setCollapse((value) => !value)}
    //     >
    //       <span className="navbar-toggler-icon"></span>
    //     </button>

    //     <div
    //       className={`collapse navbar-collapse ml-auto mr-4 ${collapse ? "show" : ""
    //         }`}
    //     >
    //       <ul className="navbar-nav mr-auto tabs">
    //         <li className="nav-item">
    //           <NavLink className="nav-link" to={clusterPath("/")} exact>
    //             Cluster Stats
    //           </NavLink>
    //         </li>
    //         <li className="nav-item">
    //           <NavLink className="nav-link" to={clusterPath("/supply")}>
    //             Supply
    //           </NavLink>
    //         </li>
    //         <li className="nav-item">
    //           <NavLink className="nav-link" to={clusterPath("/tx/inspector")}>
    //             Inspector
    //           </NavLink>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link url-link" href="https://velasvalidators.com" target="_blank" rel="noreferrer">
    //           velasvalidators.com
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link url-link" href="https://velasity.com/" target="_blank" rel="noreferrer">
    //           velasity.com
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a className="nav-link url-link" href="https://evmexplorer.velas.com/" target="_blank" rel="noreferrer">
    //             EVM Explorer
    //           </a>
    //         </li>
    //       </ul>
    //     </div>

    //     <div className="d-none d-md-block">
    //       <ClusterStatusButton />
    //     </div>
    //   </div>
    // </nav>
    <div className="bg-grey-main border-grey-light border-b">
      <div className="py-6 flex items-center justify-between gap-10" style={{ margin: '0 5%' }}>
        <div className="flex items-center gap-12">
          <NavLink to='/'>
            <Typography variant='h2'>Sophon</Typography>
          </NavLink>
          <div className="gap-9 lg:flex items-center hidden">
            {
              navItems.map((item, index) => (
                <NavLink
                  key={index}
                  className="hover:text-primary text-secondary whitespace-nowrap"
                  // className={({ isActive }) =>
                  //   isActive ? "text-primary" : "text-secondary"
                  // }
                  to={clusterPath(item.link)}
                >
                  {item.label}
                </NavLink>
              ))
            }
            <ClusterStatusButton />
          </div>
        </div>        
        <SearchBar />
        <div className="block lg:hidden">
          <IconButton disableRipple onClick={toggleDrawer(true)}>
            <FontAwesomeIcon icon={faBars} className="text-primary"/>
          </IconButton>
          <SwipeableDrawer
            anchor="top"
            open={menuOpen}
            onOpen={toggleDrawer(true)}
            onClose={toggleDrawer(false)}
            onClick={toggleDrawer(false)}
          >
            <List disablePadding>
              {
                navItems.map((item, key) => (
                  <ListItem key={key} disablePadding>
                    <NavLink to={item.link}
                      className="text-lg text-light-dark w-full text-center py-2 bg-dark-light"
                      // className={({ isActive })=>
                      //   isActive ? "text-lg text-light-light w-full text-center p-4 bg-dark-dark" : "text-lg text-light-dark w-full text-center p-4 bg-dark-light" 
                      // }
                    >
                      {item.label}
                    </NavLink>
                  </ListItem>
                ))
              }
            </List>
            <div className="p-2 border-t border-grey-light">
              <ClusterStatusButton className="w-full"/>
            </div>
          </SwipeableDrawer>
        </div>      
      </div>
    </div>
  );
}

export default Navbar;