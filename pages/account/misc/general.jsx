import ObolsView from 'components/account/Worlds/World2/ObolsView';
import Currencies from 'components/account/Misc/Currencies';
import Shrines from '@components/account/Worlds/World3/Shrines';
import Statues from '@components/account/Worlds/World1/Statues';
import Highscores from 'components/account/Misc/Highscores';
import Totals from 'components/account/Misc/Totals';
import { AppContext } from 'components/common/context/AppProvider';
import { useContext } from 'react';
import { NextSeo } from 'next-seo';
import { Stack, Typography, Box } from '@mui/material';
import { format, formatDistanceToNowStrict  } from 'date-fns';

const General = () => {
  const { state } = useContext(AppContext);
  return <Box sx={{ width: '100%' }}>
    <NextSeo
      title="General | Idleon Toolbox"
      description="General account information"
    />
    <>
      <Stack sx={{ '& > div': { maxWidth: 300 } }} gap={4} justifyContent={'center'} direction={'row'} flexWrap={'wrap'}>
        {state?.account?.accountCreateTime && <Box>
          <Typography variant={'h5'}>Account created</Typography>
          <Typography>{format(state?.account?.accountCreateTime, 'dd/MM/yyyy HH:mm:ss')}</Typography>
          <Typography>{formatDistanceToNowStrict(state?.account?.accountCreateTime, { unit: 'day', addSuffix: true })}</Typography>
        </Box>}
        <ObolsView obols={state?.account?.obols} type={'account'} characters={state?.characters}/>
        <Currencies {...(state?.account?.currencies || {})}/>
        <Shrines shrines={state?.account?.shrines} shrinesExpBonus={state?.account?.shrinesExpBonus}/>
        <Statues account={state?.account} characters={state?.characters}/>
        <Stack gap={1.5}>
          <Highscores title={'Colosseum'} highscore={state?.account?.highscores?.coloHighscores}/>
          <Highscores title={'Minigame'} highscore={state?.account?.highscores?.minigameHighscores}/>
        </Stack>
        <Totals account={state?.account} characters={state?.characters}/>
      </Stack>
    </>
  </Box>
};

export default General;
