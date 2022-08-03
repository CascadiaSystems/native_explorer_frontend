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
                  exact
                  key={index}
                  className="hover:text-primary text-secondary whitespace-nowrap"
                  activeStyle={{
                    color: "#E4E6EB"
                  }}
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
                      exact
                      className="text-lg text-secondary w-full text-center py-2 bg-grey-main"
                      activeStyle={{
                        backgroundColor: "#18191A",
                        color: "#E4E6EB"
                      }}
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