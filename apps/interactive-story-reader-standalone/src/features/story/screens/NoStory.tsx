import { Button } from '~/components/Button';
//import { useAppDispatch } from '~/store';

export const NoStory = () => {
  //const dispatch = useAppDispatch();

  const handleOpen = async () => {
    //dispatch(openStory());
  }

  return (
    <Button onClick={handleOpen}>Open Story</Button>
  );
}
