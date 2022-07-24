import React from 'react';
import { useHistory } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';

interface Props {
  href: string;
  username: string;
  title: string;
}

const LinkTab: React.FC<Props> = (props: Props) => {
  const history: any = useHistory();
  const { username, href, title } = props;

  return (
    <Tab
      component="a"
      label={title}
      onClick={(event) => {
        event.preventDefault();
        if (!window.document.location.pathname?.includes(`${href}`)) {
          history.push(`/users/settings/${username}/${href}`);
        }
      }}
      {...props}
    />
  );
};

export default LinkTab;
