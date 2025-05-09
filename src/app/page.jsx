"use client";
import { FaSearch } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { NewShoppingListDialog, EditShoppingListDialog } from "./components/dialogs";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "./context/authContextConfig";
import { auth, db } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, doc, deleteDoc, getDocs, writeBatch } from "firebase/firestore";

import { useDialogContext } from "./context/dialogContext";

export default function Home() {
  const router = useRouter();
  const { user, setUser } = useAuthContext();
  const {
    openNewShoppingListDialog,
    openEditShoppingListDialog,
    setOpenNewShoppingListDialog,
    setOpenEditShoppingListDialog,
    shoppingListData,
    setShoppingListData
  } = useDialogContext();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [filteredShoppingLists, setFilteredShoppingLists] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [overallTotalCost, setOverallTotalCost] = useState(0);
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    // Create snapshot listener for shoppingLists collection
    const unsubscribe = onSnapshot(
      collection(db, "users", uid, "shoppingLists"),
      (snapShot) => {
        const retrievedShoppingLists = snapShot.docs.map((doc) => ({
          listId: doc.id,
          ...doc.data()
        }));

        setShoppingLists(retrievedShoppingLists);
      },
      (error) => {
        console.error("Error getting shopping lists: ", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  // use effect to set the shoppingLists state when filteredShoppingLists changes
  useEffect(() => {
    if (searchValue === "") {
      setFilteredShoppingLists(shoppingLists);
    } else {
      const result = shoppingLists.filter(({ listName }) => listName.toLowerCase().includes(searchValue));
      setFilteredShoppingLists(result);
    }
  }, [searchValue, shoppingLists]);

  useEffect(() => {
    const totalCosts = filteredShoppingLists.reduce(
      (acc, list) =>
        acc + list.listItems.reduce((sum, item) => sum + parseFloat(item.itemPrice.match(/\d+(\.\d+)?/)[0]), 0),
      0
    );
    setOverallTotalCost(totalCosts);
  }, [filteredShoppingLists]);

  if (!user) return null;
  const { displayName, email, photoURL, uid } = user;

  const listValueDivStyle =
    " rounded-lg flex flex-col gap-2 items-center justify-center bg-white border border-gray-300 px-3 py-5 w-full h-20";

  const listValueFigureStyle = "";
  const listValueHeadStyle = "whitespace-nowrap font-semibold";

  const handleSearchShoppingList = (e) => {
    setSearchValue(e.target.value.toLowerCase().trim());
  };

  const handleNewShoppingList = () => {
    document.body.style.overflow = "hidden";
    setOpenNewShoppingListDialog(true);
  };

  const handleSaveShoppingList = () => {
    document.body.style.overflow = "";
    setOpenNewShoppingListDialog(false);
  };

  const handleDeleteSingleShoppingList = async (listId) => {
    const docToDelete = doc(db, "users", uid, "shoppingLists", listId);
    await deleteDoc(docToDelete);
  };

  const handleDeleteAllShoppingLists = async () => {
    const shoppingListsToDelete = collection(db, "users", uid, "shoppingLists");
    const snapshot = await getDocs(shoppingListsToDelete);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  };

  const handleViewShoppingList = (shoppingListData) => {
    setShoppingListData(shoppingListData);
    document.body.style.overflow = "hidden";
    setOpenEditShoppingListDialog(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="bg-white p-10 flex flex-col gap-8">
      {/* new list dialog div */}
      {openNewShoppingListDialog && <NewShoppingListDialog />}

      {/* edit list dialog div */}
      {openEditShoppingListDialog && <EditShoppingListDialog />}

      {/* nav div with logout and profile image */}
      <div className="flex flex-row justify-between mb-15 items-center">
        {/* hero heading div */}
        <h1 className="text-[30px] text-gray-700 font-bold">Hi {displayName}, Let's plan shopping</h1>
        <div className="flex flex-row justify-between items-center gap-8 font-semibold">
          <button onClick={handleSignOut}>Log Out</button>
          <div className="flex flex-col items-center justify-center gap-1">
            <div
              title={displayName}
              className="rounded-full h-11 w-11 flex items-center justify-center border border-gray-400 shadow"
              style={{
                background: `url(${photoURL})`,
                backgroundPosition: "center",
                backgroundSize: "cover"
              }}
            ></div>
            <span className="text-gray-500 text-[15px]">{email}</span>
          </div>
        </div>
      </div>

      {/* mini aggregate div */}
      <div className="flex flex-col justify-center items-center gap-5">
        {/* amount div */}
        <div className="border border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center gap-4 w-80 h-40">
          <div className="flex flex-col gap-2 items-center justify-center ">
            <h1 className="font-semibold">Total Cost</h1>
            <h1 className="text-gray-500 italic">Responsive to search</h1>
          </div>

          <span className="text-[40px] font-bold">£{overallTotalCost}</span>
        </div>
      </div>

      {/* main app nav */}
      <div className="flex gap-20 justify-center items-center w-full">
        {/* search div */}
        <div className=" flex justify-between gap-5 items-center px-3 py-1 border border-gray-300 rounded-2xl shadow w-1/3">
          <input
            className="w-full outline-none"
            placeholder="Search Shopping List - By Name"
            onChange={handleSearchShoppingList}
          />
          <span className="rounded-full hover:bg-gray-200 hover:cursor-pointer p-2">
            <FaSearch className="size-5 text-gray-500" />
          </span>
        </div>

        {/* action button div */}
        <div className="flex justify-center items-center gap-10 ">
          <button onClick={handleDeleteAllShoppingLists}>Delete All Shopping List</button>
          <button onClick={handleNewShoppingList}>New Shopping List</button>
        </div>
      </div>

      {/* main body. shopping lists */}
      <div className="flex flex-wrap gap-5 overflow-auto h-[1000px] px-10 w-full justify-center mt-5">
        {filteredShoppingLists.length > 0 ? (
          filteredShoppingLists.map((list) => {
            const { listId, listName, listDescription, listItems } = list;

            // Convert Firestore Timestamp (seconds and nanoseconds) to JavaScript Date
            const convertedListDate = list.listDate?.toDate().toLocaleDateString();

            // Calculate total cost, total items, and total quantity
            let totalCost = 0;
            let totalQuantity = 0;
            for (const item of listItems) {
              totalCost += parseFloat(item.itemPrice.match(/\d+(\.\d+)?/)[0]);
              totalQuantity += parseInt(item.itemQuantity);
            }

            return (
              <div
                key={listId}
                className="flex flex-col gap-12 border border-gray-300 bg-black/4 shadow p-6 rounded-lg w-[320px] h-[400px]"
              >
                {/* Heading div */}
                <div className="flex w-full justify-between items-center gap-5">
                  <h1 className="text-[20px] font-bold">{listName}</h1>
                  {/* Render the converted date */}
                  <span className="font-semibold text-gray-500">{convertedListDate}</span>
                </div>

                {/* Body div */}
                <div className="flex flex-col gap-3 items-center justify-center">
                  {/* 2 col div */}
                  <div className="flex flex-row gap-3">
                    <div className={listValueDivStyle}>
                      <h1 className={listValueHeadStyle}>Total Quantity</h1>
                      <span className={listValueFigureStyle}>{totalQuantity}</span>
                    </div>
                    <div className={listValueDivStyle}>
                      <h1 className={listValueHeadStyle}>Total Items</h1>
                      <span className={listValueFigureStyle}>{listItems.length}</span>
                    </div>
                  </div>

                  {/* 1 col div */}
                  <div className={listValueDivStyle}>
                    <h1 className={listValueHeadStyle}>Total Cost</h1>
                    <span className={listValueFigureStyle}>{totalCost}</span>
                  </div>
                </div>

                {/* Bottom action div */}
                <div className="flex justify-between items-center gap-5">
                  <button
                    onClick={() => {
                      handleViewShoppingList({ listId, listName, listDescription, convertedListDate, listItems });
                    }}
                  >
                    View Items
                  </button>
                  <span
                    className="rounded-full hover:bg-gray-200 hover:cursor-pointer p-2"
                    onClick={() => handleDeleteSingleShoppingList(listId)}
                  >
                    <RiDeleteBin6Line className="size-6" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div>{searchValue ? "No result found for search" : "No Shopping List. Let's start adding"}</div>
        )}
      </div>
    </div>
  );
}
