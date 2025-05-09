"use client";
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useDialogContext } from "../context/dialogContext";
import { collection, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuthContext } from "../context/authContextConfig";
import { nanoid } from "nanoid";

const inputStyle = "outline-none border border-gray-300 rounded-lg p-3 py-2 w-full focus:border-gray-400";

export const NewShoppingListDialog = () => {
  const { openNewShoppingListDialog, setOpenNewShoppingListDialog } = useDialogContext();
  const { user } = useAuthContext();
  if (!user) {
    router.push("/signin");
    return null;
  }
  const { uid } = user;

  const [newListData, setNewListData] = useState({
    listName: "",
    listDescription: "",
    listDate: ""
  });
  const [error, setError] = useState("");

  const { listName, listDescription, listDate } = newListData;

  const handleCloseDialog = () => {
    setOpenNewShoppingListDialog(false);
    document.body.style.overflow = "";
  };

  const handleCreateShoppingList = async () => {
    if (!uid) return;
    if (!listName) return;

    const newShoppingList = {
      ...newListData,
      listDate: !listDate ? new Date() : new Date(listDate),
      listItems: [],
      createdAt: serverTimestamp()
    };

    try {
      const success = await addDoc(collection(db, "users", uid, "shoppingLists"), newShoppingList);

      if (success) {
        handleCloseDialog();
      }
    } catch (error) {
      setError(error?.message || "Error creating shopping list");
    }
  };

  const handleChange = (e) => {
    setNewListData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-50 flex justify-center items-center">
      {/* dialog */}
      <div className=" flex flex-col gap-7 border border-gray-300 bg-gray-100 shadow p-6 rounded-lg min-h-[400px] w-[500px]">
        {/* heading div */}
        <div className="flex w-full justify-between items-center gap-5 text-[20px] font-bold">
          <h1>New Shopping List</h1>
          <IoMdClose className="hover:text-gray-500" onClick={handleCloseDialog} />
        </div>
        {/* body div */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="List Name"
            name="listName"
            value={listName}
            className={inputStyle}
            onChange={handleChange}
            required
          />
          <textarea
            placeholder="List Description"
            name="listDescription"
            value={listDescription}
            className={inputStyle}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-2">
            <label className="ml-1 font-semibold text-gray-600">Shopping Date</label>
            <input
              type="date"
              placeholder="List Date"
              name="listDate"
              value={listDate}
              className={inputStyle}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* action button div */}
        <div className="w-full flex justify-center items-center">
          <button type="submit" disabled={!listName} className="w-1/5" onClick={handleCreateShoppingList}>
            Create
          </button>
        </div>
        {error && <div className="text-red-600 w-full">{error}</div>}
      </div>
    </div>
  );
};

export const EditShoppingListDialog = () => {
  const { openEditShoppingListDialog, setOpenEditShoppingListDialog, shoppingListData, setShoppingListData } =
    useDialogContext();
  const { user } = useAuthContext();
  if (!user) {
    router.push("/signin");
    return null;
  }
  const { uid } = user;

  const { listId, listName, listDescription, convertedListDate, listItems } = shoppingListData;
  const [nativeListDiscription, setNativeListDiscription] = useState(listDescription);
  const [nativeItemsList, setNativeItemsList] = useState(listItems);
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [onItemEdit, setOnItemEdit] = useState(false);
  const [openSaveWarningDialog, setOpenSaveWarningDialog] = useState(false);
  const [unSavedChanges, setUnSavedChanges] = useState(false);
  const [itemData, setItemData] = useState({
    itemId: "",
    itemName: "",
    itemDescription: "",
    itemPrice: "",
    itemQuantity: ""
  });
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unSavedChanges) {
        e.preventDefault();
      }
    };

    // Add the event listener when the component is mounted
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unSavedChanges]);

  useEffect(() => {
    if (searchValue === "") {
      setNativeItemsList(listItems);
    } else {
      const result = listItems.filter(({ itemName }) => itemName.toLowerCase().includes(searchValue));
      setNativeItemsList(result);
    }
  }, [searchValue, listItems]);

  const { itemId, itemName, itemDescription, itemPrice, itemQuantity } = itemData;

  const handleSaveList = async () => {
    const docRef = doc(db, "users", uid, "shoppingLists", listId);

    const dataToUpdate = {
      listName,
      listDescription: nativeListDiscription,
      listItems: nativeItemsList,
      listDate: new Date(convertedListDate)
    };

    try {
      await updateDoc(docRef, dataToUpdate);

      setUnSavedChanges(false);
      document.body.style.overflow = "";
      setOpenEditShoppingListDialog(false);
    } catch (error) {
      setError(error?.message || "Error creating shopping list");
    }
  };
  const handleChange = (e) => {
    setUnSavedChanges(true);
    setItemData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleCreateNewItem = () => {
    if (!itemName) return;
    const newItem = {
      itemId: nanoid(),
      itemName,
      itemDescription,
      itemPrice: !itemPrice ? "£0" : itemPrice,
      itemQuantity: !itemQuantity ? 0 : itemQuantity
    };

    setNativeItemsList((prev) => [...prev, newItem]);

    setItemData({
      itemId: "",
      itemName: "",
      itemDescription: "",
      itemPrice: "",
      itemQuantity: ""
    });
    setOpenNewItemDialog(false);
  };

  const handleEditItem = () => {
    if (!itemName) return;

    const updatedItems = nativeItemsList.map((item) => {
      return item.itemId === itemId ? itemData : item;
    });

    setNativeItemsList(updatedItems);
    setItemData({
      itemId: "",
      itemName: "",
      itemDescription: "",
      itemPrice: "",
      itemQuantity: ""
    });
    setOnItemEdit(false);
  };

  const handleEditOrNewItem = (occasion) => {
    if (occasion === "new") {
      handleCreateNewItem();
    } else {
      handleEditItem();
    }
  };

  const handleSingleItemDelete = (itemId) => {
    const updatedItems = nativeItemsList.filter((item) => item.itemId !== itemId);
    setNativeItemsList(updatedItems);
  };

  // dialog pop up for adding new item to the shopping list
  const newShoppingListItemDialog = (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-50 flex justify-center items-center">
      {/* dialog */}
      <div className=" flex flex-col gap-7 border border-gray-300 bg-gray-100 shadow p-6 rounded-lg min-h-[400px] w-[500px]">
        {/* heading div */}
        <div className="flex w-full justify-between items-center gap-5 text-[20px] font-bold">
          <h1> {onItemEdit ? "Edit" : "Create"} Item</h1>
          <IoMdClose
            className="hover:text-gray-500"
            onClick={() => {
              onItemEdit ? setOnItemEdit(false) : setOpenNewItemDialog(false);
            }}
          />
        </div>
        {/* body div */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Item Name"
            name="itemName"
            value={itemName}
            className={inputStyle}
            onChange={handleChange}
            required
          />
          <textarea
            placeholder="Item Description"
            name="itemDescription"
            value={itemDescription}
            className={inputStyle}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Item Quantity"
            name="itemQuantity"
            value={itemQuantity}
            className={inputStyle}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="(£) Pound.Penny - Item Price"
            name="itemPrice"
            value={itemPrice}
            className={inputStyle}
            onChange={handleChange}
          />
        </div>
        {/* action button div */}
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            disabled={!itemName}
            className="w-1/5"
            onClick={() => handleEditOrNewItem(onItemEdit ? "edit" : "new")}
          >
            {onItemEdit ? "Done" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );

  const saveWarningDialog = (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-10 border border-gray-300 bg-gray-100 shadow pt-10 pb-4 rounded-lg min-h-[100px] w-[450px]">
        <h1 className="font-semibold">Please save you current items before you continue</h1>
        <div className="flex justify-between items-center gap-5 w-3/4">
          <button onClick={() => setOpenSaveWarningDialog(false)}>Keep Editing</button>
          <button onClick={handleSaveList}>Save</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-50 flex justify-center items-center">
      {/* new item dialog div */}
      {(openNewItemDialog || onItemEdit) && newShoppingListItemDialog}
      {openSaveWarningDialog && saveWarningDialog}
      {/* dialog */}
      <div className=" flex flex-col gap-12 border border-gray-300 bg-gray-100 shadow p-8 rounded-lg h-[870px] w-[800px]">
        {/* heading and save action div */}
        <div className="flex flex-col gap-4">
          {/* heading 1 */}
          <div className="flex w-full justify-between items-center gap-5">
            {/* list heading div */}
            <div className="flex w-1/2 justify-between items-center gap-5">
              <h1 className="text-[25px] font-bold">{listName}</h1>
              <span className="text-gray-600 font-semibold">{convertedListDate}</span>
            </div>

            {/* save div */}

            <button onClick={handleSaveList}>Save</button>
          </div>
          <textarea
            className="border border-gray-200 rounded-lg p-2 w-full focus:border-gray-300 outline-none overflow-auto h-[60px] text-gray-600"
            name="listDescription"
            value={nativeListDiscription}
            onChange={(e) => setNativeListDiscription(e.target.value)}
          />
        </div>

        {/* action button and search div */}
        <div className="flex justify-center items-center gap-10 px-5">
          <div className="flex justify-center items-center gap-5">
            <button onClick={() => setNativeItemsList([])}>Delete</button>
            <button
              onClick={() => {
                setItemData({
                  itemId: "",
                  itemName: "",
                  itemDescription: "",
                  itemPrice: "",
                  itemQuantity: ""
                });
                setOpenNewItemDialog(true);
              }}
            >
              New Item
            </button>
          </div>

          <div className=" flex justify-between gap-5 items-center px-3 py-1 border border-gray-300 rounded-2xl shadow w-full">
            <input
              className="w-full outline-none"
              placeholder="Search Shopping List - By Name"
              name="searchValue"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <span className="rounded-full hover:bg-gray-200 hover:cursor-pointer p-2">
              <FaSearch className="size-5 text-gray-500" />
            </span>
          </div>
        </div>

        {/* body div */}
        <div className="flex flex-col gap-4">
          {/* body headings */}
          <div className="flex gap-5 justify-between items-center mr-10 ml-5 font-semibold">
            <h1>Name</h1>
            <h1>Quantity</h1>
            <h1>Price</h1>
            <h1>Actions</h1>
          </div>
          {/* body items */}
          <div className="flex flex-col gap-2 items-center overflow-auto h-[460px] p-2">
            {nativeItemsList.length > 0
              ? nativeItemsList.map((item) => {
                  return (
                    <div
                      key={item.itemId}
                      className="flex py-4 px-6 gap-5 justify-between items-center border border-gray-300 shadow-sm rounded-lg w-full bg-gray-50 hover:bg-gray-100"
                    >
                      <h1>{item.itemName}</h1>
                      <h1>{item.itemQuantity}</h1>
                      <h1>{item.itemPrice}</h1>
                      <div className="flex gap-3 justify-center items-center text-[20px] text-gray-900">
                        <FaEdit
                          className="hover:text-gray-500 hover:cursor-pointer"
                          onClick={() => {
                            setOnItemEdit(true);
                            setItemData(item);
                          }}
                        />
                        <RiDeleteBin6Line
                          className="hover:text-gray-500 hover:cursor-pointer"
                          onClick={() => handleSingleItemDelete(item.itemId)}
                        />
                      </div>
                    </div>
                  );
                })
              : searchValue
              ? "No result found for search"
              : "No Shopping List. Let's start adding"}
          </div>
          {error && <div className="text-red-600 w-full bg-red-200 p-1 border rounded-lg font-semibold">{error}</div>}
        </div>
      </div>
    </div>
  );
};
