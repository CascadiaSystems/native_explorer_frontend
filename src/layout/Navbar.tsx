import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Typography } from '@mui/material';
// import { IconButton, List, ListItem,  SwipeableDrawer, Typography } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from '@fortawesome/free-solid-svg-icons';


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
      <div className="flex items-center gap-20 py-6" style={{ margin: '0 5%' }}>
        <NavLink to='/'>
          <Typography variant='h2'>Sophon</Typography>
        </NavLink>
        <div className="gap-9 flex">
          {
            navItems.map((item, index) => (
              <NavLink
                key={index}
                className="hover:text-primary text-secondary"
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
        {/* <div className="block md:hidden">
          <IconButton disableRipple onClick={toggleDrawer(true)}>
            <FontAwesomeIcon icon={faBars} />
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
                      className={({ isActive })=>
                        isActive ? "text-lg text-light-light w-full text-center p-4 bg-dark-dark" : "text-lg text-light-dark w-full text-center p-4 bg-dark-light" 
                      }
                    >
                      {item.label}
                    </NavLink>
                  </ListItem>
                ))
              }
            </List>
          </SwipeableDrawer>
        </div>       */}
      </div>
    </div>
  );
}

export default Navbar;