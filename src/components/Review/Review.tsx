/* eslint-disable no-underscore-dangle */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Fade from '@material-ui/core/Fade';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
// @ts-ignore
import ReviewDialog from '../Dialogues/ReviewDialogue.tsx';
import { LightTooltip } from '../Helpers/Tooltip';
import * as helpers from '../Helpers/helpers';
import profilePlaceholder from '../../utils/profile-picture-default-png.png';
// @ts-ignore
import { RootState, AppDispatch } from '../../store.ts';
// @ts-ignore
import { User, Review } from '../../types.ts';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '90%',
    backgroundColor: '#f5f5f5',
    minHeight: '2rem',
    padding: '0.1rem',
    margin: '0 auto',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
    padding: '1.2rem',
  },
  pos: {
    marginBottom: 12,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

interface OwnProps {
  review: Array<Review>;
  authUser: string;
  onDelete: () => void;
  onEdit: () => void;
  reviewAuthor: {
    username: string;
    roles: any;
    _id: string;
    email: string;
    slice: string;
  };
}

type Props = OwnProps & RootState & AppDispatch;

const ReviewCard: React.FC<OwnProps> = (props: Props) => {
  const { review, reviewAuthor, authUser, onDelete, onEdit } = props;
  const [showReviewDialogue, setShowReviewDialogue] = React.useState(false);
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <ReviewDialog
        show={showReviewDialogue}
        close={() => setShowReviewDialogue(false)}
        review={review}
        title="Edit review"
        onEdit={onEdit}
      />
      <CardContent>
        <div className="spaceBetween">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Avatar
              className={classes.small}
              src={reviewAuthor?.image || profilePlaceholder}
              alt={reviewAuthor?.username || ''}
              {...helpers.stringAvatar(`${reviewAuthor.username} ${reviewAuthor.name}`)}
            >
              {reviewAuthor.username?.slice(0, 1)}
            </Avatar>
            <Typography variant="subtitle1" color="textSecondary">
              {reviewAuthor?.username}
            </Typography>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: '-0.8rem',
            }}
          >
            {authUser === reviewAuthor.username && (
              <>
                <LightTooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  title="Edit"
                >
                  <IconButton aria-label="edit" onClick={() => setShowReviewDialogue(true)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </LightTooltip>

                <LightTooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  title="Delete"
                >
                  <IconButton aria-label="edit" onClick={() => onDelete(review._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </LightTooltip>
              </>
            )}
          </div>
        </div>

        <Typography className={classes.title}>{review.review}</Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {review.timestamp}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
};

const mapStateToProps = (state: RootState, props: Props) => ({
  reviewAuthor: state.users.users.filter((u: User) => u._id === props.review.userId)[0],
  authUser: state.users.authUser.username,
});

export default connect<RootState, AppDispatch, OwnProps>(mapStateToProps)(ReviewCard);
