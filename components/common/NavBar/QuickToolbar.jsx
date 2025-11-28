import { useContext } from 'react';
import { NextLinkComposed } from '../NextLinkComposed';
import { useRouter } from 'next/router';
import { prefix } from '@utility/helpers';
import { Stack, ListItemIcon, ButtonGroup, IconButton } from '@mui/material';
import { AppContext } from '../context/AppProvider';
import { PAGES } from '@components/constants';
import Tooltip from '../../Tooltip';

const QuickToolbar = ({ drawer }) => {

  const { state } = useContext(AppContext);
  const router = useRouter();
  const { t, nt, dnt, ...updatedQuery } = router?.query || {};

  const isSelected = (label) => {
    return router.pathname.includes(label);
  }

  return (
    <Stack flexDirection={'row'} flexWrap={'wrap'} maxWidth={'1200px'} gap={1} justifyContent={'center'} sx={{ display: { xs: 'none', md: 'none', lg: 'flex' }, height: '100%' }} >

      {Object.entries(PAGES.ACCOUNT).map(([key, value], index) => {
        const { icon, categories, style } = value;
        return (
          <ButtonGroup variant="contained" key={key + ' ' + index} sx={{border: '1px solid grey', borderRadius: 2}}>
            {categories?.map((category, categoryIndex) => {
              const label = category?.label.split(/(?=[A-Z])/).map((str) => str.toLowerCase()).join('-');
              const selectedSubSection = isSelected(label);

              const url = key ? `/account/${key.split(' ').join('-')}/${label}` : `/account/${label}`;
              if (typeof window.gtag !== 'undefined') {
                window.gtag('event', 'handle_nav', {
                  event_category: url,
                  event_label: 'engagement',
                  value: 1
                })
              }

              return (
                <IconButton
                  component={NextLinkComposed}
                  selected={selectedSubSection}
                  data-cy={label}
                  key={category + ' ' + categoryIndex}
                  to={{ pathname: url, query: updatedQuery }}
                  sx={{
                    borderRadius: 2,
                    p: '2px',
                    backgroundColor: selectedSubSection ? '#99ccff' : 'inherit'
                  }}
                >

                <Tooltip title={category?.label
                    .split(/(?=[A-Z])/)
                    .join(' ')
                    .capitalize()}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <img width={28} height={28}
                      style={{ objectFit: 'contain', ...category?.style }}
                      src={`${prefix}${category.icon}.png`}
                      alt="" />
                  </ListItemIcon></Tooltip>
                </IconButton>
                
              );
            })}
          </ButtonGroup>
        );
      })}

    </Stack>
  )
  
};

export default QuickToolbar;
