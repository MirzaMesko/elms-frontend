import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
// @ts-ignore
import Ratings from '../Helpers/Rating.tsx';

interface Props {
  open: boolean;
  close: () => void;
  rate: () => void;
}

const RatingDialogue: React.FC<Props> = ({ open, close, rate }: Props) => (
  <div data-testid="rating-dialog">
    <Dialog open={open} onClose={close}>
      <DialogContent style={{ padding: '1rem 3rem' }}>
        <Ratings name="hover-feedback" onClick={rate} />
      </DialogContent>
    </Dialog>
  </div>
);

export default RatingDialogue;
