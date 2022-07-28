import { Card, CardContent, CardHeader } from '@mui/material';

const ContentCard = ({title, action, children, className}: {
  title: React.ReactNode,
  action?: React.ReactElement,
  children: React.ReactNode,
  className?: string
}) => {
  return (    
    <Card className={className?className:''}>
      <CardHeader
        title={title}
        action={action?action:null}
      />
      <CardContent>
        { children }
      </CardContent>
    </Card>
  );
};

export default ContentCard;