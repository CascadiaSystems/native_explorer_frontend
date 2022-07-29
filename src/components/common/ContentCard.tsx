import { Card, CardActions, CardContent, CardHeader } from '@mui/material';

const ContentCard = ({title, action, children, footer, className}: {
  title?: React.ReactNode,
  action?: React.ReactElement,
  children: React.ReactNode,
  footer?: React.ReactNode,
  className?: string
}) => {
  return (    
    <Card className={className?className:''}>
      {
        title ? (
          <CardHeader
            title={title}
            action={action?action:null}
          />
        ) : null
      }
      <CardContent>
        { children }
      </CardContent>
      {
        footer ? (
          <CardActions>{footer}</CardActions>
        ): null
      }
    </Card>
  );
};

export default ContentCard;