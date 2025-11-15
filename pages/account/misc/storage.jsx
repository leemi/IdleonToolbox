import { AppContext } from 'components/common/context/AppProvider';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { cleanUnderscore, getTabs, groupByKey, notateNumber, prefix } from 'utility/helpers';
import styled from '@emotion/styled';
import HtmlTooltip from 'components/Tooltip';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import ItemDisplay from '@components/common/ItemDisplay';
import Tabber from '@components/common/Tabber';
import { PAGES } from '@components/constants';
import { CardWithBreakdown } from '@components/account/Worlds/World5/Hole/commons';


const Looty = () => {
  const { state } = useContext(AppContext);
  const [sortByStackSize, setSortByStackSize] = useState(false);
  const [items, setItems] = useState();
  const [orderByGroup, setOrderByGroup] = useState(false);
  
  const { printer, lab } = state?.account;

  const printingItems = useMemo(() => {
    return printer?.flat().filter(i => i.active);
  }, [printer]);

  const greenstacks = useMemo(() => {
    if (!items) return [];
    console.log(items);
    if (orderByGroup) {
      return Object.values(items).flat().filter(i => i.amount > 10000000);
    } else {
      return items.filter(i => i.amount > 10000000);
    }
  }, [items]);

  const sortedItems = useMemo(() => [...state?.account?.storage?.list]?.sort((a, b) => b?.amount - a?.amount), [state]);
  useEffect(() => {
    let result
    if (orderByGroup) {
      const groupedBy = groupByKey(state?.account?.storage?.list, ({ Type }) => Type);
      if (sortByStackSize) {
        result = Object.entries(groupedBy).reduce((res, [key, val]) => {
          const sorted = [...val].sort((a, b) => b?.amount - a?.amount);
          return { ...res, [key]: sorted }
        }, {})
        setItems(result);
      }
      else {
        setItems(groupedBy)
      }
    }
    else {
      setItems(sortByStackSize ? sortedItems : state?.account?.storage?.list);
    }
  }, [state, orderByGroup, sortByStackSize])

  const handleChange = (event) => {
    setSortByStackSize(event.target.checked);
  };

  const renderItems = (items) => {
    if (!items || !Array.isArray(items)) return null;

    return items?.map((item, index) => {
      const { name, rawName, amount } = item;

      const checkPrint = printingItems.find(i => i.item === rawName);
      const printInfo = checkPrint ? `\n${notateNumber(checkPrint.boostedValue, 'Big')}↑` : '';

      return (
        <Card variant={'outlined'} sx={{ width: 75 }} key={`${name}-${index}`}>
          <CardContent>
            <HtmlTooltip title={<ItemDisplay {...item} showAmount/>}>
              <Stack alignItems="center" key={`${rawName}-${index}`} data-index={index}>
                <Image loading="lazy" data-index={index} width={30} height={30} style={{ objectFit: 'contain' }}
                       src={`${prefix}data/${rawName}.png`} alt={rawName}/>
                <Typography
                  align='center'
                  color={amount >= 1e7
                    ? 'success.light'
                    : ''}>{notateNumber(amount, 'Big')}</Typography>
                <Typography variant="caption" align='center' color="textSecondary">
                  {lab?.items?.[rawName]?.active ? `Lab: ${notateNumber(lab.items[rawName].boostedValue, 'Big')}${printInfo}` : printInfo.trim()}
                </Typography>
              </Stack>
            </HtmlTooltip>
          </CardContent>
        </Card>
      );
    })
  }
  return (
    <>
      <NextSeo
        title="Storage | Idleon Toolbox"
        description="A list of your storage items"
      />
      <Tabber tabs={getTabs(PAGES.ACCOUNT.misc.categories, 'storage')}>
        <Stack>
          <Stack mb={3} direction={'row'} flexWrap={'wrap'}>
            <FormControlLabel
              control={<Checkbox name={'mini'} checked={orderByGroup}
                                 size={'small'}
                                 onChange={() => setOrderByGroup(!orderByGroup)}/>}
              label={'Group by type'}/>
            <FormControlLabel control={<Checkbox checked={sortByStackSize} onChange={handleChange}/>}
                              label="Sort by stack size"/>
            <FormControlLabel control={<Checkbox />}
                              label={greenstacks.length + " greenstacks"} />
          </Stack>
          {orderByGroup && !Array.isArray(items) ? <Stack gap={2}>
              {Object.entries(items || {}).map(([group, groupedItems], index) => {
                if (groupedItems.length === 0) return null;
                return (
                  <Card key={`${group}-${index}`}>
                    <CardContent>
                      <Typography>{(cleanUnderscore(group)).toLowerCase().capitalize()}</Typography>
                      <Stack key={`${group}-${index}`} data-index={index}>
                        <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
                          {renderItems(groupedItems)}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
            : <Stack direction={'row'} gap={1} flexWrap={'wrap'}>
              {renderItems(items)}
            </Stack>}
        </Stack>
        <div>
          <CardWithBreakdown title={'Slots Owned'} value={`${state?.account?.storage?.slots?.value}`}
                             icon={'data/InvStorage1.png'}
                             breakdown={state?.account?.storage?.slots?.breakdown}
                             skipNotation/>
          <Stack direction={'row'} flexWrap={'wrap'} gap={2}>
            {state?.account?.storage?.storageChests?.map(({
                                                            rawName,
                                                            displayName,
                                                            amount,
                                                            capacity,
                                                            unlocked
                                                          }, index) => {
              return <Card key={rawName} sx={{ width: 200, opacity: unlocked ? 1 : .5, cursor: 'pointer' }}
                           onClick={() => window.open(`https://idleon.wiki/wiki/${displayName}`, '_blank')}>
                <CardContent>
                  <Typography>{(cleanUnderscore(displayName)).toLowerCase().capitalize()}</Typography>
                  <Stack direction={'row'} flexWrap={'wrap'} gap={1} data-index={index} alignItems={'center'}>
                    <Image loading="lazy" data-index={index} width={30} height={30} style={{ objectFit: 'contain' }}
                           src={`${prefix}data/${rawName}.png`} alt={rawName}/>
                    <Typography>+{amount || capacity}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            })}
          </Stack>
        </div>

      </Tabber>
    </>
  );
};

const ItemImg = styled.img`
  height: 30px;
  width: 30px;
  object-fit: contain;
`;

export default Looty;
