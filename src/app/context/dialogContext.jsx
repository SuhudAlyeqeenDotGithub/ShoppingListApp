"use client";
import { createContext, useContext, useState } from "react";

const DialogContext = createContext();
export const DialogProvider = ({ children }) => {
  const [openNewShoppingListDialog, setOpenNewShoppingListDialog] = useState(false);
  const [openEditShoppingListDialog, setOpenEditShoppingListDialog] = useState(false);
  const [shoppingListData, setShoppingListData] = useState({});

  return (
    <DialogContext.Provider
      value={{
        openNewShoppingListDialog,
        openEditShoppingListDialog,
        setOpenNewShoppingListDialog,
        setOpenEditShoppingListDialog,
        shoppingListData,
        setShoppingListData
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => useContext(DialogContext);
