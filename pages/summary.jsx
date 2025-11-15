import React, { useContext, useMemo } from 'react';
import { AppContext } from 'components/common/context/AppProvider';

const Summary = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const printer = state?.account?.printer;

  const printerItems = useMemo(() => {
    if (!printer) return [];
    return printer.flat().filter(i => i.active).map(i => ({ item: i.item, value: i.value, boostedValue: i.boostedValue }));
  }, [printer]);

  return <code>{JSON.stringify(printerItems, null, 2)}</code>
};

export default Summary;
