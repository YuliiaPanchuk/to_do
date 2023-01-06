import React, { useCallback, useEffect, useState } from 'react';
import { ListItem } from '../types';

export const ListContext = React.createContext<{
  lists: ListItem[];
  fetchLists: () => void;
}>({
  lists: [],
  fetchLists: function (): void {
    throw new Error('Function not implemented.');
  },
});

export function ListProvider({ children }: any) {
  const [lists, setLists] = useState<ListItem[]>([]);

  const fetchLists = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/list`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLists(data.result);
      })
      .catch((err) => {
        console.log(`An error occur ${err}`);
      });
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return (
    <ListContext.Provider
      value={{
        lists,
        fetchLists,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useListContext() {
  const context = React.useContext(ListContext);

  if (context === undefined) {
    throw new Error('useListContext must be a child of ListProvider');
  }

  return context;
}
