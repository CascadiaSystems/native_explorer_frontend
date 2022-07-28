import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';
import { IconButton, Typography } from '@mui/material';

const Footer = () => {
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between flex-shrink-0"
      style={{ margin: '0 5%' }}
    >
      <div className="flex items-center gap-5 py-5 sm:py-7">
        <IconButton disableRipple href="https://facebook.com" color="secondary" className="hover:text-primary">
          <FontAwesomeIcon icon={faDiscord} />
        </IconButton>
        <IconButton disableRipple href="https://twitter.com" color="secondary" className="hover:text-primary">
          <FontAwesomeIcon icon={faTwitter} />
        </IconButton>
      </div>
      <Typography color="secondary" className="pb-5 sm:pb-0">
        Copyright <FontAwesomeIcon icon={faCopyright} className="text-secondary" /> 2022 - native.sophon.com
      </Typography>
    </div>
  );
};

export default Footer;