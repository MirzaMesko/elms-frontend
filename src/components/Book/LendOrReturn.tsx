/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import Button from '@material-ui/core/Button';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
// @ts-ignore
import TabPanel from '../Helpers/TabPanel.tsx';
// @ts-ignore
import UserInfo from '../User/UserInfo.tsx';
// @ts-ignore
import OwedBooks from './OwedBooks.tsx';
// @ts-ignore
import LendBook from './LendBook.tsx';
// @ts-ignore
import { RootState } from '../../store.ts';
// @ts-ignore
import type { User } from '../../types.ts';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100%',
  },
}));

type Params = {
  id: string;
};

const LendOrReturn: React.FC = () => {
  const classes = useStyles();
  const [user, setUser] = React.useState<User>();
  const [owedBooks, setOwedBooks] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const { id } = useParams<Params>();
  const history = useHistory();
  const { token, authUser, users } = useSelector((state: RootState) => state.users);
  const { books } = useSelector((state: RootState) => state.books);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
    // setSearch('');
  };

  React.useEffect(() => {
    const result = users.filter((u: { _id: string }) => u._id === id);
    setUser(result[0]);
    if (result[0].owedBooks?.length) {
      setOwedBooks(result[0].owedBooks);
    } else {
      setOwedBooks([]);
    }
  }, [users]);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className={classes.container} data-testid="lend-return-page">
      <UserInfo user={user} />
      <div style={{ flex: '6', padding: '1rem' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Lend new book" {...a11yProps(0)} data-testid="lend-new-book-tab" />
          <Tab label="Owed Books" {...a11yProps(1)} data-testid="owed-books-tab" />
        </Tabs>
        <TabPanel value={value} index={0} key={0}>
          <LendBook books={books} user={user} token={token} authUserRoles={authUser.roles} />
        </TabPanel>
        <TabPanel value={value} index={1} key={1}>
          <OwedBooks
            owedBooks={owedBooks}
            books={books}
            user={user}
            token={token}
            authUserRoles={authUser.roles}
          />
        </TabPanel>

        <div className="centered">
          <ButtonGroup variant="outlined" size="large" aria-label="large button group">
            <Button
              autoFocus
              onClick={() => history.push(`/manage/users`)}
              data-testid="back-to-users-button"
            >
              back to users
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default LendOrReturn;
