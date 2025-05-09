"use client";
import { IoMdClose } from "react-icons/io";
import { FaSearch, FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";
import { useDialogContext } from "../context/dialogContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuthContext } from "../context/authContextConfig";

export const NewShoppingListDialog = () => {
  const { openNewShoppingListDialog, setOpenNewShoppingListDialog } = useDialogContext();
  const { user } = useAuthContext();

  if (!user) {
    router.push("/signin");
    return null;
  }
  const { uid } = user;

  const inputStyle = "outline-none border border-gray-300 rounded-lg p-3 py-2 w-full focus:border-gray-400";

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

  const { listId, listName, listDescription, convertedListDate, listItems } = shoppingListData;
  console.log({ listId, listName, listDescription, convertedListDate, listItems });
  const [nativeListDiscription, setNativeListDiscription] = useState(listDescription);

  const handleSaveList = () => {
    document.body.style.overflow = "";
    setOpenEditShoppingListDialog(false);
  };

  return (
    <div className="bg-black/50 w-full h-full fixed inset-0 z-50 flex justify-center items-center">
      {/* dialog */}
      <div className=" flex flex-col gap-12 border border-gray-300 bg-gray-100 shadow p-8 rounded-lg h-[800px] w-[800px]">
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
            <button>Delete</button>
            <button>New Item</button>
          </div>

          <div className=" flex justify-between gap-5 items-center px-3 py-1 border border-gray-300 rounded-2xl shadow w-full">
            <input className="w-full outline-none" placeholder="Search Shopping List - By Name" />
            <span className="rounded-full hover:bg-gray-200 hover:cursor-pointer p-2">
              <FaSearch className="size-5 text-gray-500" />
            </span>
          </div>
        </div>

        {/* body div */}
        <div className="flex flex-col gap-4">
          {/* body headings */}
          <div className="grid grid-cols-5 gap-5 justify-between items-center ml-5 font-semibold">
            <div className="flex items-center gap-4">
              <input type="checkbox" className="w-5 h-5 accent-gray-700" />
              <h1 className="text-gray-500 mt-1">20</h1>
            </div>
            <h1>Name</h1>
            <h1>Quantity</h1>
            <h1>Price</h1>
            <h1>Actions</h1>
          </div>
          {/* body items */}
          <div className="flex flex-col gap-2 items-center overflow-auto h-[460px] p-2">
            {listItems.length > 0
              ? listItems.map(({ itemName, itemPrice, itemQuantity }) => (
                  <div className="grid grid-cols-5 p-4 gap-5 justify-between items-center border border-gray-300 shadow-sm rounded-lg w-full bg-gray-50 hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 accent-gray-700" />
                    <h1>{itemName}</h1>
                    <h1>{itemQuantity}</h1>
                    <h1>{itemPrice}</h1>
                    <div className="flex gap-3 justify-center items-center text-[20px] text-gray-900">
                      <FaEdit className="hover:text-gray-500 hover:cursor-pointer" />
                      <RiDeleteBin6Line className="hover:text-gray-500 hover:cursor-pointer" />
                    </div>
                  </div>
                ))
              : "You have not items in this list. Let's start adding"}
          </div>
        </div>
      </div>
    </div>
  );
};
